// Handles product image uploads. Files are kept in memory and stored in the
// `images` table in PostgreSQL, then served by the API at /api/images/:id.
// This works everywhere — including read-only serverless hosts like Vercel,
// where writing files to disk is not possible.
const multer = require('multer');
const db = require('../db');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP or GIF images are allowed'));
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB (Vercel caps request bodies at ~4.5MB)
});

// Store an uploaded image in the database and return its API URL,
// e.g. "/api/images/3". The admin panel compresses photos before
// upload, so rows stay small.
async function saveImage(file) {
  const result = await db.query(
    'INSERT INTO images (mime, data) VALUES ($1, $2) RETURNING id',
    [file.mimetype, file.buffer]
  );
  return `/api/images/${result.rows[0].id}`;
}

module.exports = { upload, saveImage };
