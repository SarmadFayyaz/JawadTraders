-- Jawad Traders - Complete Database Setup
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================
-- PART 1: Schema
-- ============================================

-- Accounts table (customers and suppliers)
CREATE TABLE IF NOT EXISTS accounts (
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

CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts (type);
CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts (name);

-- Transactions table (credit/debit entries)
CREATE TABLE IF NOT EXISTS transactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id  UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions (account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);

-- Account balances view (aggregated balances)
CREATE OR REPLACE VIEW account_balances AS
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

-- ============================================
-- PART 2: Auto-confirm auth users (skip email verification)
-- ============================================

CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth
AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- ============================================
-- PART 2.5: Clients table
-- ============================================

CREATE TABLE IF NOT EXISTS clients (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_name ON clients (name);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true) WITH CHECK (true);

-- Client items table (items linked to clients)
CREATE TABLE IF NOT EXISTS client_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  item_name  TEXT NOT NULL,
  quantity   NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_items_client_id ON client_items (client_id);

ALTER TABLE client_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on client_items" ON client_items FOR ALL USING (true) WITH CHECK (true);

-- Vegetables inventory table
CREATE TABLE IF NOT EXISTS vegetables (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  qty_bought   NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (qty_bought >= 0),
  qty_sold     NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (qty_sold >= 0),
  price_bought NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price_bought >= 0),
  price_sold   NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price_sold >= 0),
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vegetables_date ON vegetables (date DESC);

ALTER TABLE vegetables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on vegetables" ON vegetables FOR ALL USING (true) WITH CHECK (true);

-- Chicken records table (bought/sold entries)
CREATE TABLE IF NOT EXISTS chicken_records (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type      TEXT NOT NULL CHECK (type IN ('bought', 'sold')),
  quantity  INTEGER NOT NULL CHECK (quantity > 0),
  weight_kg NUMERIC(10, 2) NOT NULL CHECK (weight_kg > 0),
  price     NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  date      DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chicken_records_date ON chicken_records (date DESC);

ALTER TABLE chicken_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on chicken_records" ON chicken_records FOR ALL USING (true) WITH CHECK (true);

-- Cylinder types table (gas cylinder categories)
CREATE TABLE IF NOT EXISTS cylinder_types (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL UNIQUE,
  weight_kg      NUMERIC(10, 2) NOT NULL CHECK (weight_kg > 0),
  cylinder_price NUMERIC(12, 2) NOT NULL CHECK (cylinder_price >= 0),
  gas_price      NUMERIC(12, 2) NOT NULL CHECK (gas_price >= 0),
  no_of_cylinders INTEGER NOT NULL DEFAULT 0 CHECK (no_of_cylinders >= 0),
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cylinder_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on cylinder_types" ON cylinder_types FOR ALL USING (true) WITH CHECK (true);

-- Cylinder assignments table (daily tracking of cylinders given to clients)
CREATE TABLE IF NOT EXISTS cylinder_assignments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  cylinder_type_id UUID NOT NULL REFERENCES cylinder_types(id) ON DELETE CASCADE,
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at       TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cyl_assign_client ON cylinder_assignments (client_id);
CREATE INDEX IF NOT EXISTS idx_cyl_assign_date ON cylinder_assignments (date);
ALTER TABLE cylinder_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on cylinder_assignments" ON cylinder_assignments FOR ALL USING (true) WITH CHECK (true);

-- Vegetable names table (master list of vegetables)
CREATE TABLE IF NOT EXISTS vegetable_names (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  unit       TEXT NOT NULL DEFAULT 'kg',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vegetable_names ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on vegetable_names" ON vegetable_names FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- PART 3: Sample Data
-- ============================================

INSERT INTO accounts (name, phone, type, opening_balance) VALUES
  ('احمد سپلائرز', '0300-1234567', 'supplier', 0),
  ('محمد عمر', '0321-9876543', 'customer', 5000),
  ('علی ٹریڈرز', '0333-4567890', 'supplier', 0),
  ('بلال اینڈ سنز', '0345-1112233', 'customer', 0),
  ('فاروق جنرل سٹور', '0312-7778899', 'customer', 2000);

INSERT INTO transactions (account_id, type, amount, description, date) VALUES
  ((SELECT id FROM accounts WHERE name = 'احمد سپلائرز'), 'credit', 50000, 'مال وصول - سیمنٹ', '2026-01-15'),
  ((SELECT id FROM accounts WHERE name = 'احمد سپلائرز'), 'debit', 30000, 'ادائیگی', '2026-01-20'),
  ((SELECT id FROM accounts WHERE name = 'محمد عمر'), 'debit', 25000, 'سیمنٹ 50 بوری', '2026-01-18'),
  ((SELECT id FROM accounts WHERE name = 'محمد عمر'), 'credit', 15000, 'نقد وصولی', '2026-01-25'),
  ((SELECT id FROM accounts WHERE name = 'علی ٹریڈرز'), 'credit', 80000, 'سریا وصول', '2026-02-01'),
  ((SELECT id FROM accounts WHERE name = 'علی ٹریڈرز'), 'debit', 80000, 'مکمل ادائیگی', '2026-02-05'),
  ((SELECT id FROM accounts WHERE name = 'بلال اینڈ سنز'), 'debit', 45000, 'بجری اور ریت', '2026-02-03'),
  ((SELECT id FROM accounts WHERE name = 'بلال اینڈ سنز'), 'credit', 20000, 'قسط وصولی', '2026-02-07'),
  ((SELECT id FROM accounts WHERE name = 'فاروق جنرل سٹور'), 'debit', 12000, 'پینٹ', '2026-02-06');
