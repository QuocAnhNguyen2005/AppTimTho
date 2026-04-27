const { Client } = require('pg');
require('dotenv').config();

async function createJobsTable() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Đang tạo bảng jobs...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
        worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
        scheduled_time TIMESTAMP NOT NULL,
        address TEXT NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Đã tạo bảng jobs thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi tạo bảng jobs:', err.message);
  } finally {
    await client.end();
  }
}

createJobsTable();
