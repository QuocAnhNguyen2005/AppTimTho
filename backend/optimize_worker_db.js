const { Client } = require('pg');
require('dotenv').config();

async function optimizeWorkerDb() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Đang tối ưu hóa DB cho Worker (Materialized Views)...');

    // 2. Materialized Views
    console.log('Tạo Materialized View cho doanh thu 7 ngày...');
    await client.query(`
      DROP MATERIALIZED VIEW IF EXISTS worker_daily_revenue;
      CREATE MATERIALIZED VIEW worker_daily_revenue AS
      SELECT 
        worker_id,
        DATE(completed_at) as revenue_date,
        SUM(worker_earnings) as total_revenue
      FROM bookings
      WHERE status = 'COMPLETED' AND completed_at >= NOW() - INTERVAL '30 days'
      GROUP BY worker_id, DATE(completed_at);

      CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_daily_revenue ON worker_daily_revenue(worker_id, revenue_date);
    `);

    console.log('Tạo Function/Trigger để Refresh Materialized View mỗi đêm lúc 2h sáng...');
    // In PostgreSQL, you typically use an extension like pg_cron or an external script to refresh Materialized Views.
    // For this demonstration, we create a function that the backend can call via node-cron.
    await client.query(`
      CREATE OR REPLACE FUNCTION refresh_worker_revenue()
      RETURNS void AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY worker_daily_revenue;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log('✅ Đã tạo Materialized View thành công! (Dùng node-cron để gọi refresh_worker_revenue mỗi đêm)');

  } catch (err) {
    console.error('❌ Lỗi khi tối ưu hóa DB:', err.message);
  } finally {
    await client.end();
  }
}

optimizeWorkerDb();
