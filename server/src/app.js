// R&K Express app (middleware + routes) — shared by two entrypoints:
//   - server/src/index.js  → local dev / any Node host (app.listen)
//   - api/index.js         → Vercel serverless function
// Developer: levelose.tech
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./db');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve locally uploaded product images. On serverless hosts (Vercel) the
// filesystem is read-only, so skip silently — use external image URLs there.
const uploadsPath = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
  app.use('/uploads', express.static(uploadsPath));
} catch {
  console.warn('Read-only filesystem — /uploads disabled (serverless mode)');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'R&K', developer: 'levelose.tech' });
});

// Serve images uploaded via the admin panel (stored in the `images` table).
// Rows are never modified after insert, so they can be cached forever.
app.get('/api/images/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT mime, data FROM images WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Image not found' });
    res.set('Content-Type', result.rows[0].mime);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(result.rows[0].data);
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (also catches multer upload errors, e.g. file too large / wrong type)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError' || /images are allowed/i.test(err.message || '')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
