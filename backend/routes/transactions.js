const express = require('express');
const router = express.Router();
const db = require('../db');
const registerAuth = require('../middleware/registerAuth');

// POST /api/transaction
router.post('/', registerAuth, async (req, res) => {
  const { phoneNumber, purchaseTotalCents, cashGivenCents, location } = req.body;

  if (!phoneNumber || !purchaseTotalCents || !cashGivenCents) {
    return res.status(400).json({ error: 'phoneNumber, purchaseTotalCents, and cashGivenCents are required' });
  }
  if (cashGivenCents < purchaseTotalCents) {
    return res.status(400).json({ error: 'Cash given is less than purchase total' });
  }

  const changeOwedCents   = cashGivenCents - purchaseTotalCents;
  const cashReturnedCents = Math.floor(changeOwedCents / 100) * 100;
  const coinsToCardCents  = changeOwedCents - cashReturnedCents;

  if (coinsToCardCents === 0) {
    return res.json({
      cashReturnedCents,
      coinsToCardCents: 0,
      message: 'Exact dollar change — nothing added to card',
    });
  }

  try {
    const cardResult = await db.query(
      `SELECT gc.id AS gift_card_id, gc.balance_cents, c.name
       FROM customers c
       JOIN gift_cards gc ON gc.customer_id = c.id
       WHERE c.phone_number = $1 AND gc.status = 'active'`,
      [phoneNumber]
    );

    if (cardResult.rows.length === 0) {
      return res.status(404).json({ error: 'No active gift card found for this phone number' });
    }

    const { gift_card_id, balance_cents, name } = cardResult.rows[0];

    await db.query('BEGIN');

    await db.query(
      'UPDATE gift_cards SET balance_cents = balance_cents + $1 WHERE id = $2',
      [coinsToCardCents, gift_card_id]
    );

    await db.query(
      `INSERT INTO transactions
         (gift_card_id, store_id, type,
          purchase_total_cents, cash_given_cents,
          change_owed_cents, cash_returned_cents, coins_to_card_cents, location)
       VALUES ($1, $2, 'deposit', $3, $4, $5, $6, $7, $8)`,
      [
        gift_card_id,
        req.store.id,
        purchaseTotalCents,
        cashGivenCents,
        changeOwedCents,
        cashReturnedCents,
        coinsToCardCents,
        location || null,
      ]
    );

    await db.query('COMMIT');

    const newBalance = balance_cents + coinsToCardCents;

    res.json({
      success: true,
      customerName: name,
      cashReturnedCents,
      coinsToCardCents,
      newBalanceCents: newBalance,
      display: {
        cashBack: `$${(cashReturnedCents / 100).toFixed(2)}`,
        addedToCard: `$${(coinsToCardCents / 100).toFixed(2)}`,
        newBalance: `$${(newBalance / 100).toFixed(2)}`,
      },
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Transaction error:', err);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
});

// POST /api/transaction/redeem
router.post('/redeem', registerAuth, async (req, res) => {
  const { phoneNumber, amountCents } = req.body;

  if (!phoneNumber || !amountCents || amountCents <= 0) {
    return res.status(400).json({ error: 'phoneNumber and amountCents are required' });
  }

  try {
    const cardResult = await db.query(
      `SELECT gc.id AS gift_card_id, gc.balance_cents, c.name
       FROM customers c
       JOIN gift_cards gc ON gc.customer_id = c.id
       WHERE c.phone_number = $1 AND gc.status = 'active'`,
      [phoneNumber]
    );

    if (cardResult.rows.length === 0) {
      return res.status(404).json({ error: 'No active gift card found' });
    }

    const { gift_card_id, balance_cents, name } = cardResult.rows[0];

    if (balance_cents < amountCents) {
      return res.status(400).json({
        error: 'Insufficient balance',
        balanceCents: balance_cents,
      });
    }

    await db.query('BEGIN');

    await db.query(
      'UPDATE gift_cards SET balance_cents = balance_cents - $1 WHERE id = $2',
      [amountCents, gift_card_id]
    );

    await db.query(
      `INSERT INTO transactions
         (gift_card_id, store_id, type, purchase_total_cents, coins_to_card_cents)
       VALUES ($1, $2, 'redemption', $3, $4)`,
      [gift_card_id, req.store.id, amountCents, -amountCents]
    );

    await db.query('COMMIT');

    res.json({
      success: true,
      customerName: name,
      amountRedeemedCents: amountCents,
      newBalanceCents: balance_cents - amountCents,
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Redemption error:', err);
    res.status(500).json({ error: 'Failed to process redemption' });
  }
});

module.exports = router;