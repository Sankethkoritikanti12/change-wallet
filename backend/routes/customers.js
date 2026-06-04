const express = require('express');
const router = express.Router();
const db = require('../db');

function generateCardNumber() {
  const a = Math.floor(1000 + Math.random() * 9000);
  const b = Math.floor(1000 + Math.random() * 9000);
  return `CW-${a}-${b}`;
}

// POST /api/customers/register
router.post('/register', async (req, res) => {
  const { name, phoneNumber, email, address, city, state, zip } = req.body;

  if (!name || !phoneNumber) {
    return res.status(400).json({ error: 'name and phoneNumber are required' });
  }

  const cleanPhone = phoneNumber.replace(/\D/g, '');

  try {
    const existing = await db.query(
      'SELECT id FROM customers WHERE phone_number = $1',
      [cleanPhone]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    await db.query('BEGIN');

    const customerResult = await db.query(
      `INSERT INTO customers (name, phone_number, email, address, city, state, zip)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, cleanPhone, email || null, address || null, city || null, state || null, zip || null]
    );
    const customerId = customerResult.rows[0].id;

    const cardNumber = generateCardNumber();
    const cardResult = await db.query(
      'INSERT INTO gift_cards (customer_id, card_number) VALUES ($1, $2) RETURNING id, card_number',
      [customerId, cardNumber]
    );
    const cardId = cardResult.rows[0].id;

    // If address provided, create a physical card order
    let order = null;
    if (address && city && state && zip) {
      const orderResult = await db.query(
        `INSERT INTO card_orders (customer_id, gift_card_id, address, city, state, zip)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, status`,
        [customerId, cardId, address, city, state, zip]
      );
      order = orderResult.rows[0];
    }

    await db.query('COMMIT');

    res.status(201).json({
      success: true,
      customer: { id: customerId, name, phoneNumber: cleanPhone, address, city, state, zip },
      card: { id: cardId, cardNumber: cardResult.rows[0].card_number, balanceCents: 0 },
      order: order ? { id: order.id, status: order.status } : null
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register customer' });
  }
});

// GET /api/customers/lookup?phone=xxx
router.get('/lookup', async (req, res) => {
  const cleanPhone = (req.query.phone || '').replace(/\D/g, '');
  if (!cleanPhone) {
    return res.status(400).json({ error: 'phone query param is required' });
  }
  try {
    const { rows } = await db.query(
      `SELECT c.id, c.name, c.phone_number, c.address, c.city, c.state, c.zip,
              gc.id AS gift_card_id, gc.card_number, gc.balance_cents
       FROM customers c
       JOIN gift_cards gc ON gc.customer_id = c.id
       WHERE c.phone_number = $1 AND gc.status = 'active'`,
      [cleanPhone]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const r = rows[0];
    res.json({
      customer: {
        id: r.id, name: r.name, phoneNumber: r.phone_number,
        address: r.address, city: r.city, state: r.state, zip: r.zip
      },
      card: {
        id: r.gift_card_id, cardNumber: r.card_number,
        balanceCents: r.balance_cents,
        balanceDisplay: `$${(r.balance_cents / 100).toFixed(2)}`
      }
    });
  } catch (err) {
    console.error('Lookup error:', err);
    res.status(500).json({ error: 'Failed to look up customer' });
  }
});

// GET /api/customers/:customerId/history
router.get('/:customerId/history', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT t.id, t.type, t.coins_to_card_cents, t.created_at,
              s.name AS store_name, t.location,
              s.address AS store_address
       FROM transactions t
       JOIN stores s ON s.id = t.store_id
       JOIN gift_cards gc ON gc.id = t.gift_card_id
       WHERE gc.customer_id = $1
       ORDER BY t.created_at DESC
       LIMIT 50`,
      [req.params.customerId]
    );
    res.json({
      transactions: rows.map(r => ({
        id: r.id,
        type: r.type,
        amountCents: r.coins_to_card_cents,
        amountDisplay: `${r.coins_to_card_cents > 0 ? '+' : ''}$${(Math.abs(r.coins_to_card_cents) / 100).toFixed(2)}`,
        storeName: r.store_name,
        location: r.location || r.store_address || null,
        date: r.created_at,
      }))
    });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET /api/customers/:customerId/orders
router.get('/:customerId/orders', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT co.id, co.status, co.tracking_number, co.created_at, co.updated_at,
              co.address, co.city, co.state, co.zip,
              gc.card_number
       FROM card_orders co
       JOIN gift_cards gc ON gc.id = co.gift_card_id
       WHERE co.customer_id = $1
       ORDER BY co.created_at DESC`,
      [req.params.customerId]
    );
    res.json({ orders: rows });
  } catch (err) {
    console.error('Orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;