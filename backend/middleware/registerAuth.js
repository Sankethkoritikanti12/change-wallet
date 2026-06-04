// Middleware: verifies the register's API key against the stores table
const db = require('../db');

async function registerAuth(req, res, next) {
  const apiKey = req.headers['x-register-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing x-register-key header' });
  }

  try {
    const { rows } = await db.query(
      'SELECT id, name FROM stores WHERE register_api_key = $1',
      [apiKey]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid register API key' });
    }
    req.store = rows[0]; // attach store to request
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error during auth' });
  }
}

module.exports = registerAuth;
