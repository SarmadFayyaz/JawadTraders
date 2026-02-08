-- Jawad Traders - Khata System Database Schema
-- Run this in Supabase SQL Editor

-- Accounts table (customers and suppliers)
CREATE TABLE accounts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  phone           TEXT,
  address         TEXT,
  type            TEXT NOT NULL CHECK (type IN ('customer', 'supplier')),
  opening_balance NUMERIC(12, 2) DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_accounts_type ON accounts (type);
CREATE INDEX idx_accounts_name ON accounts (name);

-- Transactions table (credit/debit entries)
CREATE TABLE transactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id  UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_transactions_account_id ON transactions (account_id);
CREATE INDEX idx_transactions_date ON transactions (date DESC);

-- Account balances view (aggregated balances)
CREATE VIEW account_balances AS
SELECT
  a.id,
  a.name,
  a.type,
  a.phone,
  a.opening_balance,
  a.opening_balance
    + COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0)
    - COALESCE(SUM(CASE WHEN t.type = 'debit'  THEN t.amount ELSE 0 END), 0)
    AS current_balance,
  COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) AS total_credit,
  COALESCE(SUM(CASE WHEN t.type = 'debit'  THEN t.amount ELSE 0 END), 0) AS total_debit,
  COUNT(t.id) AS transaction_count
FROM accounts a
LEFT JOIN transactions t ON t.account_id = a.id
GROUP BY a.id, a.name, a.type, a.phone, a.opening_balance;

-- Row Level Security (permissive for single-user setup)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
