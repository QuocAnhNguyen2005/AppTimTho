const { Client } = require('pg');
require('dotenv').config();

async function initDb() {
  // 1. Kết nối vào database mặc định 'postgres' để tạo database 'apptimtho'
  const rootClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await rootClient.connect();
    // Kiểm tra xem database đã tồn tại chưa
    const res = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = 'apptimtho'");
    if (res.rowCount === 0) {
      console.log('Đang tạo database apptimtho...');
      await rootClient.query('CREATE DATABASE apptimtho');
      console.log('✅ Đã tạo database apptimtho thành công.');
    } else {
      console.log('⚠️ Database apptimtho đã tồn tại.');
    }
  } catch (err) {
    console.error('❌ Lỗi khi kiểm tra/tạo database:', err.message);
    process.exit(1);
  } finally {
    await rootClient.end();
  }

  // 2. Kết nối vào database 'apptimtho' vừa tạo để khởi tạo các bảng (Tables)
  const appClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho', // Đã kết nối vào DB mới
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await appClient.connect();
    console.log('Đang tạo các tables (Users, Workers, Admins, v.v.)...');
    
    // Câu lệnh SQL để tạo cấu trúc CSDL
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        identity_card VARCHAR(50),
        bank_account_number VARCHAR(50),
        bank_name VARCHAR(100),
        is_verified BOOLEAN DEFAULT FALSE,
        average_rating DECIMAL(3,2) DEFAULT 0.0,
        total_reviews INTEGER DEFAULT 0,
        location_lat DECIMAL(10,8),
        location_lng DECIMAL(11,8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'SUPPORT',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        icon_url TEXT
      );

      CREATE TABLE IF NOT EXISTS worker_services (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(15,2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
        worker_service_id UUID REFERENCES worker_services(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        customer_lat DECIMAL(10,8),
        customer_lng DECIMAL(11,8),
        customer_address TEXT,
        total_price DECIMAL(15,2) NOT NULL,
        commission_fee DECIMAL(15,2) NOT NULL,
        worker_earnings DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
        amount DECIMAL(15,2) NOT NULL,
        payment_method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'PENDING',
        transaction_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await appClient.query(sql);
    console.log('✅ Đã tạo toàn bộ các Tables thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi tạo tables:', err.message);
  } finally {
    await appClient.end();
  }
}

initDb();
