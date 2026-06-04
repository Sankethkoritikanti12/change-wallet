-- ============================================
-- Change Wallet System — Database Schema
-- Run this in your PostgreSQL database once
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Stores (gas stations using the system)
CREATE TABLE stores (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(100) NOT NULL,
  address          TEXT,
  register_api_key VARCHAR(64) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email        VARCHAR(150) UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gift cards (one per customer, can have multiple in future)
CREATE TABLE gift_cards (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  card_number   VARCHAR(20) UNIQUE NOT NULL,
  balance_cents INT NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
  status        VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- All money movements (deposits from change, redemptions at register)
CREATE TABLE transactions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gift_card_id         UUID NOT NULL REFERENCES gift_cards(id),
  store_id             UUID NOT NULL REFERENCES stores(id),
  type                 VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'redemption')),
  purchase_total_cents INT NOT NULL,
  cash_given_cents     INT,               -- null for redemptions
  change_owed_cents    INT,               -- null for redemptions
  cash_returned_cents  INT,               -- null for redemptions
  coins_to_card_cents  INT NOT NULL,      -- positive = deposit, negative = redemption
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_customers_phone    ON customers(phone_number);
CREATE INDEX idx_gift_cards_customer ON gift_cards(customer_id);
CREATE INDEX idx_transactions_card  ON transactions(gift_card_id);
CREATE INDEX idx_transactions_store ON transactions(store_id);
CREATE INDEX idx_transactions_date  ON transactions(created_at DESC);

-- ============================================
-- Seed: one test store + one test customer
-- ============================================

INSERT INTO stores (name, address, register_api_key) VALUES
  ('QuikTrip #42', '1234 Main St, Southfield, MI', 'test-register-key-12345');

INSERT INTO customers (name, phone_number, email) VALUES
  ('Marcus Thompson', '2485550192', 'marcus@example.com');

INSERT INTO gift_cards (customer_id, card_number, balance_cents)
SELECT id, 'CW-4821-9034', 483 FROM customers WHERE phone_number = '2485550192';
