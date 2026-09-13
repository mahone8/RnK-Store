const express = require('express');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats - dashboard summary
router.get('/stats', async (req, res) => {
  try {
    const [productsCount, ordersCount, usersCount, revenue, lowStock, recentOrders] = await Promise.all([
      db.query('SELECT COUNT(*) FROM products'),
      db.query('SELECT COUNT(*) FROM orders'),
      db.query(`SELECT COUNT(*) FROM users WHERE role = 'customer'`),
      db.query(`SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE status != 'cancelled'`),
      db.query('SELECT id, name, stock FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 5'),
      db.query(
        `SELECT o.id, o.total_amount, o.status, o.created_at, u.name AS customer_name
         FROM orders o JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC LIMIT 5`
      )
    ]);

    res.json({
      total_products: parseInt(productsCount.rows[0].count),
      total_orders: parseInt(ordersCount.rows[0].count),
      total_customers: parseInt(usersCount.rows[0].count),
      total_revenue: parseFloat(revenue.rows[0].total),
      low_stock_products: lowStock.rows,
      recent_orders: recentOrders.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/customers - list customers
router.get('/customers', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
