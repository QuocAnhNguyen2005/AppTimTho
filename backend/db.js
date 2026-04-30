const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'apptimtho',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 5432,
  max: 20, // Tối đa 20 connections trong pool (Connection Pooling)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Lỗi kết nối PostgreSQL:', err.stack);
  }
  console.log('✅ Kết nối PostgreSQL thành công!');
  release();
});

module.exports = pool;
