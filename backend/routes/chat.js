const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { messages, customerName } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a friendly customer support agent for Change Wallet, an app that automatically loads coin change onto a digital gift card instead of giving customers physical coins back. The customer's name is ${customerName}. Keep responses short, friendly and helpful. You can answer any question the customer has — not just about transactions. Be warm and conversational.`,
        messages
      })
    });

    const data = await response.json();
    res.json({ reply: data.content?.[0]?.text || 'Sorry, I could not get a response.' });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;