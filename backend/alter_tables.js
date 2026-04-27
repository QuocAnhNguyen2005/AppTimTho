const { Client } = require('pg');
require('dotenv').config();

async function alterTables() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Đang cập nhật cấu trúc database...');
    
    // Thêm cột balance vào workers (nếu chưa có)
    await client.query(`
      ALTER TABLE workers 
      ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0.0;
    `);
    
    // Thêm cột total_price vào jobs (nếu chưa có)
    await client.query(`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS total_price DECIMAL(15,2);
    `);

    // Hỗ trợ review cho jobs
    await client.query(`
      ALTER TABLE reviews 
      ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE CASCADE;
    `);

    // Thêm trạng thái Online/Offline cho Thợ
    await client.query(`
      ALTER TABLE workers 
      ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT TRUE;
    `);

    console.log('✅ Đã cập nhật bảng workers, jobs, reviews thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật database:', err.message);
  } finally {
    await client.end();
  }
}

alterTables();
