require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const transactionRoutes = require('./routes/transactions');
const customerRoutes    = require('./routes/customers');
const adminRoutes       = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());

// Basic request logger (replace with a proper logger in production)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ── Routes ──────────────────────────────────
app.use('/api/transaction', transactionRoutes);
app.use('/api/customers',   customerRoutes);
app.use('/api/admin',       adminRoutes);
const rewardRoutes = require('./routes/rewards');
app.use('/api/rewards', rewardRoutes);
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 fallthrough
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ───────────────────────────────────
app.listen(PORT, () => {
  console.log(`Change Wallet API running on http://localhost:${PORT}`);
});
