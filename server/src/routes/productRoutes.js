const express = require('express');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload, uploadDir } = require('../middleware/upload');

const router = express.Router();

// Helper: parse a boolean that may arrive as a real boolean (JSON) or a
// string 'true'/'false' (multipart/form-data), falling back when undefined.
function parseBool(value, fallback) {
  if (value === undefined) return fallback;
  return value === true || value === 'true';
}

// Helper: safely delete a locally-uploaded image file (ignores errors,
// and never touches external URLs like the seeded Unsplash images).
function deleteLocalImage(imageUrl) {
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    const filePath = path.join(uploadDir, path.basename(imageUrl));
    fs.unlink(filePath, () => {});
  }
}

// GET /api/products?category=wallets&search=leather&page=1&limit=12&featured=true
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, featured } = req.query;
    const conditions = ['p.is_active = TRUE'];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`c.slug = $${values.length}`);
    }
    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      conditions.push(`LOWER(p.name) LIKE $${values.length}`);
    }
    if (featured === 'true') {
      conditions.push('p.is_featured = TRUE');
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const countResult = await db.query(
      `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`,
      values
    );

    values.push(parseInt(limit));
    values.push(offset);
    const dataResult = await db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    res.json({
      products: dataResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug - single product with gallery
router.get('/:slug', async (req, res) => {
  try {
    const productResult = await db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [req.params.slug]
    );
    if (productResult.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const product = productResult.rows[0];
    const imagesResult = await db.query(
      'SELECT id, image_url, sort_order FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC',
      [product.id]
    );
    product.gallery = imagesResult.rows;
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - admin only, create product.
// Accepts multipart/form-data with an optional "image" file, OR a JSON/body
// "image_url" string (e.g. to keep using an external image link).
router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, sku } = req.body;
    if (!name || req.body.price === undefined || req.body.price === '') {
      return res.status(400).json({ error: 'name and price are required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const price = parseFloat(req.body.price);
    const compare_at_price = req.body.compare_at_price ? parseFloat(req.body.compare_at_price) : null;
    const stock = req.body.stock !== undefined && req.body.stock !== '' ? parseInt(req.body.stock, 10) : 0;
    const category_id = req.body.category_id ? parseInt(req.body.category_id, 10) : null;
    const is_active = parseBool(req.body.is_active, true);
    const is_featured = parseBool(req.body.is_featured, false);

    // Prefer an uploaded file; fall back to a provided external URL.
    const image_url = req.file ? `/uploads/${req.file.filename}` : (req.body.image_url || null);

    const result = await db.query(
      `INSERT INTO products
        (name, slug, description, price, compare_at_price, stock, sku, image_url, category_id, is_active, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [name, slug, description || null, price, compare_at_price, stock, sku || null, image_url, category_id, is_active, is_featured]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

// PUT /api/products/:id - admin only, update product.
// Same upload handling as create; if a new image is uploaded, the old
// locally-stored image (if any) is removed from disk.
router.put('/:id', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const existing = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const current = existing.rows[0];

    const name = req.body.name || current.name;
    const slug = req.body.name ? slugify(req.body.name, { lower: true, strict: true }) : current.slug;
    const description = req.body.description !== undefined ? req.body.description : current.description;
    const price = req.body.price !== undefined && req.body.price !== '' ? parseFloat(req.body.price) : current.price;
    const compare_at_price = req.body.compare_at_price !== undefined
      ? (req.body.compare_at_price === '' ? null : parseFloat(req.body.compare_at_price))
      : current.compare_at_price;
    const stock = req.body.stock !== undefined && req.body.stock !== '' ? parseInt(req.body.stock, 10) : current.stock;
    const sku = req.body.sku !== undefined ? req.body.sku : current.sku;
    const category_id = req.body.category_id !== undefined
      ? (req.body.category_id === '' ? null : parseInt(req.body.category_id, 10))
      : current.category_id;
    const is_active = parseBool(req.body.is_active, current.is_active);
    const is_featured = parseBool(req.body.is_featured, current.is_featured);

    let image_url = current.image_url;
    if (req.file) {
      deleteLocalImage(current.image_url);
      image_url = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const result = await db.query(
      `UPDATE products SET
         name = $1, slug = $2, description = $3, price = $4, compare_at_price = $5,
         stock = $6, sku = $7, image_url = $8, category_id = $9, is_active = $10, is_featured = $11
       WHERE id = $12 RETURNING *`,
      [name, slug, description, price, compare_at_price, stock, sku, image_url, category_id, is_active, is_featured, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

// DELETE /api/products/:id - admin only (also removes a locally-stored image file)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await db.query('SELECT image_url FROM products WHERE id = $1', [req.params.id]);
    await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (existing.rows[0]) deleteLocalImage(existing.rows[0].image_url);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
