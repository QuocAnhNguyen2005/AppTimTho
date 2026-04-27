/**
 * seed_workers.js
 * Tạo nhiều tài khoản Thợ mẫu với chuyên môn đa dạng để test tính năng tìm kiếm.
 * Chạy: node seed_workers.js
 */
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedWorkers() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'apptimtho',
    password: process.env.DB_PASSWORD || '2005',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('🌱 Đang thêm dữ liệu Thợ mẫu...\n');

    const password = '123456';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const workers = [
      {
        phone: '0901111111',
        name: 'Nguyễn Văn Hùng',
        specialties: ['Sửa điều hòa', 'Điện lạnh', 'Máy giặt'],
        experience_years: '8',
        districts_active: ['Quận 1', 'Quận 3', 'Bình Thạnh'],
        is_verified: true,
        average_rating: 4.9,
        total_reviews: 237,
      },
      {
        phone: '0902222222',
        name: 'Trần Minh Quân',
        specialties: ['Sửa ống nước', 'Chống thấm', 'Thông tắc bồn cầu'],
        experience_years: '6',
        districts_active: ['Quận 7', 'Quận 4', 'Nhà Bè'],
        is_verified: true,
        average_rating: 4.8,
        total_reviews: 184,
      },
      {
        phone: '0903333333',
        name: 'Lê Văn Đức',
        specialties: ['Sửa điện tử', 'Sửa PC', 'Sửa laptop', 'Camera an ninh'],
        experience_years: '10',
        districts_active: ['Quận 10', 'Quận 11', 'Tân Phú'],
        is_verified: true,
        average_rating: 4.7,
        total_reviews: 312,
      },
      {
        phone: '0904444444',
        name: 'Phạm Thị Lan',
        specialties: ['Vệ sinh công nghiệp', 'Tổng vệ sinh nhà', 'Vệ sinh điều hòa'],
        experience_years: '4',
        districts_active: ['Quận Bình Thạnh', 'Gò Vấp', 'Phú Nhuận'],
        is_verified: false,
        average_rating: 4.5,
        total_reviews: 95,
      },
      {
        phone: '0905555555',
        name: 'Hoàng Văn Nam',
        specialties: ['Sửa đồ gỗ', 'Nội thất', 'Lắp tủ bếp', 'Thợ mộc'],
        experience_years: '12',
        districts_active: ['Quận 9', 'Thủ Đức', 'Quận 2'],
        is_verified: true,
        average_rating: 4.6,
        total_reviews: 156,
      },
      {
        phone: '0906666666',
        name: 'Đỗ Quốc Bảo',
        specialties: ['Sửa khóa', 'Cửa cuốn', 'Khóa vân tay', 'Két sắt'],
        experience_years: '7',
        districts_active: ['Quận 5', 'Quận 6', 'Quận 8'],
        is_verified: true,
        average_rating: 4.8,
        total_reviews: 201,
      },
      {
        phone: '0907777777',
        name: 'Vũ Hải Đăng',
        specialties: ['Điện lạnh', 'Máy giặt', 'Tủ lạnh', 'Máy rửa chén'],
        experience_years: '5',
        districts_active: ['Quận Tân Bình', 'Tân Phú', 'Bình Tân'],
        is_verified: true,
        average_rating: 4.7,
        total_reviews: 143,
      },
      {
        phone: '0908888888',
        name: 'Ngô Thành Tâm',
        specialties: ['Lắp đặt điện', 'Thay dây điện', 'Lắp đèn', 'Sửa điện'],
        experience_years: '9',
        districts_active: ['Quận 12', 'Hóc Môn', 'Củ Chi'],
        is_verified: false,
        average_rating: 4.5,
        total_reviews: 88,
      },
      {
        phone: '0911000001',
        name: 'Bùi Thanh Hải',
        specialties: ['Sơn nhà', 'Chống thấm tường', 'Trát tường', 'Ốp lát gạch'],
        experience_years: '15',
        districts_active: ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 10'],
        is_verified: true,
        average_rating: 4.9,
        total_reviews: 420,
      },
      {
        phone: '0911000002',
        name: 'Cao Minh Tuấn',
        specialties: ['Sửa điều hòa', 'Bơm gas điều hòa', 'Vệ sinh máy lạnh'],
        experience_years: '6',
        districts_active: ['Quận 2', 'Quận 9', 'Thủ Đức'],
        is_verified: true,
        average_rating: 4.8,
        total_reviews: 167,
      },
    ];

    let created = 0;
    for (const w of workers) {
      // Bỏ qua nếu số điện thoại đã tồn tại
      const exists = await client.query('SELECT id FROM workers WHERE phone_number = $1', [w.phone]);
      if (exists.rows.length > 0) {
        console.log(`⚠️  Bỏ qua: ${w.name} (${w.phone}) — đã tồn tại`);
        continue;
      }

      await client.query(
        `INSERT INTO workers
           (phone_number, full_name, password_hash, specialties, experience_years,
            districts_active, is_verified, average_rating, total_reviews, identity_card,
            bank_name, bank_account_number, bank_account_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          w.phone,
          w.name,
          hash,
          w.specialties,
          w.experience_years,
          w.districts_active,
          w.is_verified,
          w.average_rating,
          w.total_reviews,
          `00000000${created + 1}`,           // identity_card placeholder
          'Ngân hàng Vietcombank',            // bank_name
          `100${created + 1}00000000`,        // bank_account_number
          w.name,                              // bank_account_name
        ]
      );
      console.log(`✅ Đã tạo: ${w.name} — ${w.specialties.join(', ')}`);
      created++;
    }

    console.log(`\n🎉 Hoàn thành! Đã thêm ${created} thợ mẫu vào database.`);
    console.log('Mật khẩu chung cho tất cả: 123456');

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.end();
  }
}

seedWorkers();
