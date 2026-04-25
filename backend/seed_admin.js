const db = require('./db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    console.log('Bắt đầu tạo tài khoản Tester Admin...');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin', salt);

    // Xóa admin cũ nếu có để tránh lỗi duplicate phone_number
    await db.query(`DELETE FROM users WHERE phone_number = 'admin'`);
    await db.query(`DELETE FROM workers WHERE phone_number = 'admin_worker'`);

    // 1. Tạo tài khoản Tester Khách hàng
    await db.query(
      `INSERT INTO users (full_name, phone_number, password_hash, address) 
       VALUES ($1, $2, $3, $4)`,
      ['Tester Khách hàng', 'admin', password_hash, '123 Đường Test, Quận 1, TP.HCM']
    );
    console.log('✅ Đã tạo Khách hàng Tester: Tên đăng nhập: "admin" - Mật khẩu: "admin"');

    // 2. Tạo tài khoản Tester Thợ
    await db.query(
      `INSERT INTO workers (
        full_name, phone_number, password_hash, date_of_birth, identity_card, 
        bank_name, bank_account_number, bank_account_name, specialties, 
        experience_years, districts_active, is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        'Tester Thợ', 'admin_worker', password_hash, '1990-01-01', '012345678901',
        'Vietcombank', '000011112222', 'TESTER THO', '{Điện lạnh}', '5', '{Quận 1}', true
      ]
    );
    console.log('✅ Đã tạo Thợ Tester: Tên đăng nhập: "admin_worker" - Mật khẩu: "admin"');

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi tạo tài khoản tester:', err);
    process.exit(1);
  }
}

seedAdmin();
