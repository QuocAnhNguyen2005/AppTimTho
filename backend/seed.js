const { Client } = require('pg');
const bcrypt = require('bcryptjs');
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

    // Hash mật khẩu đúng cách với bcrypt để login route có thể verify được
    const plainPassword = '123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Xóa dữ liệu cũ để tránh ON CONFLICT bỏ qua update password_hash
    await client.query(`DELETE FROM users WHERE phone_number = '0901234567'`);
    await client.query(`DELETE FROM workers WHERE phone_number = '0909876543'`);
    await client.query(`DELETE FROM admins WHERE username = 'admin'`);

    // 1. Tạo tài khoản Admin
    await client.query(`
      INSERT INTO admins (username, password_hash, role)
      VALUES ('admin', $1, 'SUPER_ADMIN');
    `, [hashedPassword]);

    // 2. Tạo tài khoản Khách hàng (User)
    await client.query(`
      INSERT INTO users (phone_number, full_name, password_hash)
      VALUES ('0901234567', 'Nguyễn Văn A', $1);
    `, [hashedPassword]);

    // 3. Tạo tài khoản Thợ sửa chữa (Worker) đã được Admin duyệt
    await client.query(`
      INSERT INTO workers (phone_number, full_name, password_hash, is_verified)
      VALUES ('0909876543', 'Thợ Điện Lạnh Pro', $1, true);
    `, [hashedPassword]);

    console.log('✅ Đã tạo thành công 3 tài khoản mẫu (mật khẩu đã được bcrypt hash)!');
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
