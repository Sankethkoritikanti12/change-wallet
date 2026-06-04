const express = require('express');
const router = express.Router();
const db = require('../db');

const STORE_BRANDS = ['Shell', 'Mobil', 'BP', 'Chevron', 'QuikTrip'];
const VISITS_REQUIRED = 10;
const REWARD_CENTS = 10; // $0.10 per 10 visits

const BRAND_INFO = {
  Shell:    { logo: '🐚', color: '#e8000d' },
  Mobil:    { logo: '⛽', color: '#e5001b' },
  BP:       { logo: '🌿', color: '#006400' },
  Chevron:  { logo: '⚡', color: '#e31837' },
  QuikTrip: { logo: '🏪', color: '#c8102e' },
};

// GET /api/rewards/:customerId
router.get('/:customerId', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT store_brand, visit_count, redeemed_count, last_visit
       FROM rewards WHERE customer_id = $1`,
      [req.params.customerId]
    );

    const rewardsMap = {};
    rows.forEach(r => { rewardsMap[r.store_brand] = r; });

    const rewards = STORE_BRANDS.map(brand => {
      const r = rewardsMap[brand] || { visit_count: 0, redeemed_count: 0, last_visit: null };
      const totalEarned = Math.floor(r.visit_count / VISITS_REQUIRED);
      const pendingCents = (totalEarned - r.redeemed_count) * REWARD_CENTS;
      return {
        brand,
        visitCount: r.visit_count,
        redeemedCount: r.redeemed_count,
        lastVisit: r.last_visit,
        stampsThisCycle: r.visit_count % VISITS_REQUIRED,
        visitsToNext: VISITS_REQUIRED - (r.visit_count % VISITS_REQUIRED),
        pendingCents,
        totalEarnedCents: totalEarned * REWARD_CENTS,
      };
    });

    res.json({ rewards });
  } catch (err) {
    console.error('Rewards fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// POST /api/rewards/visit
// Called when customer taps/swipes — records visit and auto-credits card if milestone hit
router.post('/visit', async (req, res) => {
  const { customerId, storeBrand } = req.body;
  if (!customerId || !storeBrand) {
    return res.status(400).json({ error: 'customerId and storeBrand are required' });
  }
  if (!STORE_BRANDS.includes(storeBrand)) {
    return res.status(400).json({ error: `storeBrand must be one of: ${STORE_BRANDS.join(', ')}` });
  }

  try {
    await db.query('BEGIN');

    // Upsert visit count
    const { rows } = await db.query(
      `INSERT INTO rewards (customer_id, store_brand, visit_count, last_visit)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (customer_id, store_brand)
       DO UPDATE SET
         visit_count = rewards.visit_count + 1,
         last_visit = NOW()
       RETURNING visit_count, redeemed_count`,
      [customerId, storeBrand]
    );

    const { visit_count, redeemed_count } = rows[0];
    const totalEarned = Math.floor(visit_count / VISITS_REQUIRED);
    const justHitMilestone = visit_count % VISITS_REQUIRED === 0;
    let creditedCents = 0;

    // Auto-credit $0.10 to card when milestone hit
    if (justHitMilestone) {
      creditedCents = REWARD_CENTS;

      // Get customer's gift card
      const cardResult = await db.query(
        `SELECT id FROM gift_cards WHERE customer_id = $1 AND status = 'active' LIMIT 1`,
        [customerId]
      );

      if (cardResult.rows.length > 0) {
        const cardId = cardResult.rows[0].id;

        // Credit the card
        await db.query(
          'UPDATE gift_cards SET balance_cents = balance_cents + $1 WHERE id = $2',
          [REWARD_CENTS, cardId]
        );

        // Get store id for transaction log
        const storeResult = await db.query(
          `SELECT id FROM stores WHERE brand = $1 LIMIT 1`,
          [storeBrand]
        );
        const storeId = storeResult.rows.length > 0
          ? storeResult.rows[0].id
          : (await db.query('SELECT id FROM stores LIMIT 1')).rows[0].id;

        // Log as a transaction
        await db.query(
          `INSERT INTO transactions
             (gift_card_id, store_id, type, purchase_total_cents, coins_to_card_cents)
           VALUES ($1, $2, 'deposit', 0, $3)`,
          [cardId, storeId, REWARD_CENTS]
        );

        // Mark as redeemed
        await db.query(
          `UPDATE rewards SET redeemed_count = $1
           WHERE customer_id = $2 AND store_brand = $3`,
          [totalEarned, customerId, storeBrand]
        );
      }
    }

    await db.query('COMMIT');

    res.json({
      success: true,
      visitCount: visit_count,
      stampsThisCycle: visit_count % VISITS_REQUIRED,
      justHitMilestone,
      creditedCents,
      visitsToNext: VISITS_REQUIRED - (visit_count % VISITS_REQUIRED),
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Visit error:', err);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

module.exports = router;