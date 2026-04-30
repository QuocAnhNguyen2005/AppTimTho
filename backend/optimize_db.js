const { Client } = require('pg');
require('dotenv').config();

async function optimizeDb() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Đang tối ưu hóa Database (Indexing & Pre-calculation)...');

    // 1. Indexing
    console.log('Tạo B-Tree Index cho phone_number và full_name...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
      CREATE INDEX IF NOT EXISTS idx_users_name ON users(full_name);
    `);

    // 2. Pre-calculation: Thêm cột vào users
    console.log('Thêm cột total_bookings_count và total_spent_amount vào users...');
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS total_bookings_count INTEGER DEFAULT 0;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS total_spent_amount DECIMAL(15,2) DEFAULT 0.0;
    `);

    // Đồng bộ dữ liệu cũ (nếu có)
    console.log('Đồng bộ dữ liệu cũ cho các cột vừa thêm...');
    await client.query(`
      UPDATE users u
      SET total_bookings_count = COALESCE((SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id AND b.status = 'COMPLETED'), 0),
          total_spent_amount = COALESCE((SELECT SUM(total_price) FROM bookings b WHERE b.user_id = u.id AND b.status = 'COMPLETED'), 0.0);
    `);

    // 3. Trigger
    console.log('Tạo Trigger tự động tính toán...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_user_stats()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (TG_OP = 'UPDATE' AND NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED') THEN
          UPDATE users
          SET total_bookings_count = total_bookings_count + 1,
              total_spent_amount = total_spent_amount + NEW.total_price
          WHERE id = NEW.user_id;
        ELSIF (TG_OP = 'INSERT' AND NEW.status = 'COMPLETED') THEN
          UPDATE users
          SET total_bookings_count = total_bookings_count + 1,
              total_spent_amount = total_spent_amount + NEW.total_price
          WHERE id = NEW.user_id;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_user_stats ON bookings;
      CREATE TRIGGER trigger_update_user_stats
      AFTER INSERT OR UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_user_stats();
    `);

    console.log('✅ Đã tối ưu hóa Database thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi tối ưu hóa DB:', err.message);
  } finally {
    await client.end();
  }
}

optimizeDb();
