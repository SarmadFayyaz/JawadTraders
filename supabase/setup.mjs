import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

// Session mode pooler connection (IPv4 compatible)
const client = new pg.Client({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.zatgpfvqbevwzyuiwnsx',
  password: 'Xqc@1234&abc',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
});

try {
  await client.connect();
  console.log('Connected to Supabase database');
  await client.query(schema);
  console.log('Schema created successfully!');

  // Insert sample data
  const sampleData = `
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
  `;
  await client.query(sampleData);
  console.log('Sample data inserted!');
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await client.end();
}
