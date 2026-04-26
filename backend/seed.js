const { Client } = require('pg');
require('dotenv').config();

async function seedData() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Đang tạo tài khoản mẫu để test...');

    // Giả lập mật khẩu đã mã hóa (Trong thực tế sẽ dùng bcrypt.hash)
    // Ở đây ta dùng plain text tạm để test đăng nhập nếu chưa nối API mã hóa
    const fakeHash = '123456'; 

    // 1. Tạo tài khoản Admin
    await client.query(`
      INSERT INTO admins (username, password_hash, role)
      VALUES ('admin', $1, 'SUPER_ADMIN')
      ON CONFLICT (username) DO NOTHING;
    `, [fakeHash]);

    // 2. Tạo tài khoản Khách hàng (User)
    await client.query(`
      INSERT INTO users (phone_number, full_name, password_hash)
      VALUES ('0901234567', 'Khách Hàng Test', $1)
      ON CONFLICT (phone_number) DO NOTHING;
    `, [fakeHash]);

    // 3. Tạo tài khoản Thợ sửa chữa (Worker) đã được Admin duyệt
    await client.query(`
      INSERT INTO workers (phone_number, full_name, password_hash, is_verified)
      VALUES ('0909876543', 'Thợ Điện Lạnh Pro', $1, true)
      ON CONFLICT (phone_number) DO NOTHING;
    `, [fakeHash]);

    console.log('✅ Đã tạo thành công 3 tài khoản mẫu!');
    console.log('------------------------------------------------');
    console.log('👉 ADMIN   | User: admin       | Pass: 123456');
    console.log('👉 KHÁCH   | SĐT : 0901234567  | Pass: 123456');
    console.log('👉 THỢ     | SĐT : 0909876543  | Pass: 123456');
    console.log('------------------------------------------------');

  } catch (err) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', err.message);
  } finally {
    await client.end();
  }
}

seedData();
