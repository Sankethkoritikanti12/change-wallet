const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/admin/summary
router.get('/summary', async (req, res) => {
  const { storeId } = req.query;
  const storeFilter = storeId ? 'AND t.store_id = $1' : '';
  const params = storeId ? [storeId] : [];

  try {
    const [totals, cardStats, todayStats] = await Promise.all([
      db.query(
        `SELECT COALESCE(SUM(coins_to_card_cents), 0) AS total_coins_cents
         FROM transactions WHERE type = 'deposit' ${storeFilter}`,
        params
      ),
      db.query(
        `SELECT COUNT(*) AS active_cards,
                COALESCE(SUM(balance_cents), 0) AS circulation_cents
         FROM gift_cards WHERE status = 'active'`
      ),
      db.query(
        `SELECT COUNT(*) AS txn_count,
                COALESCE(AVG(coins_to_card_cents), 0) AS avg_cents
         FROM transactions
         WHERE type = 'deposit' AND created_at >= CURRENT_DATE ${storeFilter}`,
        params
      ),
    ]);

    res.json({
      totalCoinsCents: Number(totals.rows[0].total_coins_cents),
      activeCards: Number(cardStats.rows[0].active_cards),
      circulationCents: Number(cardStats.rows[0].circulation_cents),
      todayTxnCount: Number(todayStats.rows[0].txn_count),
      todayAvgCents: Math.round(Number(todayStats.rows[0].avg_cents)),
    });
  } catch (err) {
    console.error('Admin summary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// GET /api/admin/customers
router.get('/customers', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.id, c.name, c.phone_number, c.email,
              c.address, c.city, c.state, c.zip,
              c.created_at,
              gc.card_number, gc.balance_cents, gc.status,
              COUNT(t.id) AS transaction_count,
              COALESCE(SUM(CASE WHEN t.type = 'deposit' THEN t.coins_to_card_cents ELSE 0 END), 0) AS total_saved_cents
       FROM customers c
       JOIN gift_cards gc ON gc.customer_id = c.id
       LEFT JOIN transactions t ON t.gift_card_id = gc.id
       GROUP BY c.id, gc.id
       ORDER BY c.created_at DESC`
    );
    res.json({ customers: rows });
  } catch (err) {
    console.error('Admin customers error:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/admin/transactions
router.get('/transactions', async (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
  const offset = parseInt(req.query.offset) || 0;

  try {
    const { rows } = await db.query(
      `SELECT t.id, t.type, t.purchase_total_cents,
              t.cash_returned_cents, t.coins_to_card_cents,
              t.location, t.created_at,
              c.name AS customer_name, s.name AS store_name
       FROM transactions t
       JOIN gift_cards gc ON gc.id = t.gift_card_id
       JOIN customers c ON c.id = gc.customer_id
       JOIN stores s ON s.id = t.store_id
       ORDER BY t.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json({ transactions: rows });
  } catch (err) {
    console.error('Admin transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;