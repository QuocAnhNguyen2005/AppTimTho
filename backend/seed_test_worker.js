const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Seeding Test Worker...');

    // 1. Create a User (Customer) for jobs
    let customerId;
    const custRes = await client.query("SELECT id FROM users LIMIT 1");
    if (custRes.rowCount > 0) {
      customerId = custRes.rows[0].id;
    } else {
      const cRes = await client.query(
        "INSERT INTO users (phone_number, full_name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
        ['0888888888', 'Khách Hàng Test', '123456', 'CUSTOMER']
      );
      customerId = cRes.rows[0].id;
    }

    // 2. Create Test Worker
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456', salt);
    
    // Delete if exists
    await client.query("DELETE FROM workers WHERE phone_number = '0999999999'");

    const wRes = await client.query(
      `INSERT INTO workers 
        (phone_number, full_name, password_hash, specialties, experience_years, 
         districts_active, is_verified, average_rating, total_reviews, identity_card, balance) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        '0999999999', 
        'Thợ Kiểm Thử', 
        hash, 
        ['Sửa máy lạnh', 'Điện nước'], 
        '10', 
        ['Quận 1', 'Quận 2'], 
        true, 
        4.8, 
        100, 
        null, // NO CCCD
        5000000 // 5M balance
      ]
    );
    const workerId = wRes.rows[0].id;

    // 3. Create Jobs
    for(let i=1; i<=5; i++) {
      const status = i <= 3 ? 'COMPLETED' : (i===4 ? 'ACCEPTED' : 'PENDING');
      const total_price = status === 'COMPLETED' ? 1000000 : null;
      const jobRes = await client.query(
        `INSERT INTO jobs (customer_id, worker_id, scheduled_time, address, description, status, total_price) 
         VALUES ($1, $2, NOW() - INTERVAL '${i} days', '123 Đường Test, Quận 1', 'Sửa máy lạnh bị chảy nước lần ${i}', $3, $4) RETURNING id`,
        [customerId, workerId, status, total_price]
      );
      
      const jobId = jobRes.rows[0].id;

      // 4. Create Reviews for Completed Jobs
      if (status === 'COMPLETED') {
        await client.query(
          `INSERT INTO reviews (job_id, user_id, worker_id, rating, comment) 
           VALUES ($1, $2, $3, $4, $5)`,
          [jobId, customerId, workerId, i === 1 ? 5 : 4, `Thợ làm rất nhiệt tình lần ${i}`]
        );
      }
    }

    console.log('✅ Đã tạo Thợ Kiểm Thử thành công!');
    console.log('📱 Số điện thoại đăng nhập: 0999999999');
    console.log('🔑 Mật khẩu: 123456');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

seed();
