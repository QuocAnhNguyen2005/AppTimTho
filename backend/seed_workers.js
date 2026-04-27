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
      // --- ĐIỆN LẠNH & ĐIỀU HÒA ---
      { phone: '0901111111', name: 'Nguyễn Văn Hùng', specialties: ['Sửa điều hòa', 'Điện lạnh', 'Máy giặt'], experience_years: '8', districts_active: ['Quận 1', 'Quận 3', 'Bình Thạnh'], is_verified: true, average_rating: 4.9, total_reviews: 237 },
      { phone: '0911000002', name: 'Cao Minh Tuấn', specialties: ['Sửa điều hòa', 'Bơm gas điều hòa', 'Vệ sinh máy lạnh'], experience_years: '6', districts_active: ['Quận 2', 'Quận 9', 'Thủ Đức'], is_verified: true, average_rating: 4.8, total_reviews: 167 },
      { phone: '0911000003', name: 'Đặng Tuấn Anh', specialties: ['Điện lạnh', 'Tủ lạnh', 'Lò vi sóng'], experience_years: '10', districts_active: ['Quận 7', 'Nhà Bè'], is_verified: true, average_rating: 4.6, total_reviews: 301 },
      { phone: '0911000004', name: 'Phan Bảo Châu', specialties: ['Bơm gas', 'Máy giặt cửa ngang', 'Sửa điều hòa Daikin'], experience_years: '4', districts_active: ['Quận 4', 'Quận 1'], is_verified: false, average_rating: 4.3, total_reviews: 45 },
      { phone: '0911000005', name: 'Lê Hoàng Phong', specialties: ['Sửa điều hòa âm trần', 'Điện lạnh công nghiệp'], experience_years: '12', districts_active: ['Quận 10', 'Quận 5'], is_verified: true, average_rating: 5.0, total_reviews: 540 },

      // --- ĐIỆN NƯỚC & ỐNG NƯỚC ---
      { phone: '0902222222', name: 'Trần Minh Quân', specialties: ['Sửa ống nước', 'Chống thấm', 'Thông tắc bồn cầu'], experience_years: '6', districts_active: ['Quận 7', 'Quận 4', 'Nhà Bè'], is_verified: true, average_rating: 4.8, total_reviews: 184 },
      { phone: '0908888888', name: 'Ngô Thành Tâm', specialties: ['Lắp đặt điện', 'Thay dây điện', 'Lắp đèn', 'Sửa điện'], experience_years: '9', districts_active: ['Quận 12', 'Hóc Môn', 'Củ Chi'], is_verified: false, average_rating: 4.5, total_reviews: 88 },
      { phone: '0911000006', name: 'Bùi Anh Khoa', specialties: ['Sửa điện nước', 'Thông tắc chậu rửa', 'Dò tìm rò rỉ nước'], experience_years: '7', districts_active: ['Tân Bình', 'Gò Vấp'], is_verified: true, average_rating: 4.7, total_reviews: 215 },
      { phone: '0911000007', name: 'Nguyễn Quốc Việt', specialties: ['Chống thấm nhà vệ sinh', 'Ống nước', 'Thi công điện nước'], experience_years: '15', districts_active: ['Quận 3', 'Quận 1'], is_verified: true, average_rating: 4.9, total_reviews: 620 },
      { phone: '0911000008', name: 'Lâm Chấn Khang', specialties: ['Thay vòi nước', 'Lắp đặt thiết bị vệ sinh', 'Sửa máy bơm'], experience_years: '3', districts_active: ['Phú Nhuận', 'Bình Thạnh'], is_verified: false, average_rating: 4.1, total_reviews: 22 },

      // --- ĐIỆN TỬ & CÔNG NGHỆ ---
      { phone: '0903333333', name: 'Lê Văn Đức', specialties: ['Sửa điện tử', 'Sửa PC', 'Sửa laptop', 'Camera an ninh'], experience_years: '10', districts_active: ['Quận 10', 'Quận 11', 'Tân Phú'], is_verified: true, average_rating: 4.7, total_reviews: 312 },
      { phone: '0911000009', name: 'Hoàng Nhật Minh', specialties: ['Sửa tivi', 'Sửa loa', 'Amply', 'Sửa điện tử'], experience_years: '8', districts_active: ['Quận 5', 'Quận 6'], is_verified: true, average_rating: 4.8, total_reviews: 198 },
      { phone: '0911000010', name: 'Đỗ Tiến Dũng', specialties: ['Cài win dạo', 'Sửa máy in', 'Phục hồi dữ liệu'], experience_years: '5', districts_active: ['Thủ Đức', 'Quận 9'], is_verified: false, average_rating: 4.4, total_reviews: 67 },
      { phone: '0911000011', name: 'Trần Đại Quang', specialties: ['Camera an ninh', 'Hệ thống chống trộm', 'Điện thông minh'], experience_years: '11', districts_active: ['Quận 1', 'Quận 7', 'Quận 2'], is_verified: true, average_rating: 4.9, total_reviews: 280 },
      { phone: '0911000012', name: 'Phạm Hồng Thái', specialties: ['Sửa mạch điện tử', 'Bếp từ', 'Nồi cơm điện cao tần'], experience_years: '9', districts_active: ['Tân Phú', 'Bình Tân'], is_verified: true, average_rating: 4.6, total_reviews: 154 },

      // --- VỆ SINH ---
      { phone: '0904444444', name: 'Phạm Thị Lan', specialties: ['Vệ sinh công nghiệp', 'Tổng vệ sinh nhà', 'Vệ sinh điều hòa'], experience_years: '4', districts_active: ['Bình Thạnh', 'Gò Vấp', 'Phú Nhuận'], is_verified: false, average_rating: 4.5, total_reviews: 95 },
      { phone: '0911000013', name: 'Lê Thị Mỹ', specialties: ['Vệ sinh nhà ở', 'Giặt sofa', 'Giặt nệm tại nhà'], experience_years: '6', districts_active: ['Quận 2', 'Quận 9'], is_verified: true, average_rating: 4.8, total_reviews: 180 },
      { phone: '0911000014', name: 'Nguyễn Bích Ngọc', specialties: ['Vệ sinh văn phòng', 'Vệ sinh máy lạnh', 'Làm sạch sàn'], experience_years: '3', districts_active: ['Quận 1', 'Quận 3'], is_verified: true, average_rating: 4.7, total_reviews: 132 },
      { phone: '0911000015', name: 'Trịnh Thị Hà', specialties: ['Khử trùng', 'Diệt côn trùng', 'Vệ sinh theo giờ'], experience_years: '8', districts_active: ['Quận 7', 'Quận 4'], is_verified: false, average_rating: 4.2, total_reviews: 58 },
      { phone: '0911000016', name: 'Hoàng Kim Dung', specialties: ['Lau kính tòa nhà', 'Vệ sinh công nghiệp'], experience_years: '5', districts_active: ['Quận 10', 'Quận 5'], is_verified: true, average_rating: 4.9, total_reviews: 210 },

      // --- MỘC, NỘI THẤT & XÂY DỰNG ---
      { phone: '0905555555', name: 'Hoàng Văn Nam', specialties: ['Sửa đồ gỗ', 'Nội thất', 'Lắp tủ bếp', 'Thợ mộc'], experience_years: '12', districts_active: ['Quận 9', 'Thủ Đức', 'Quận 2'], is_verified: true, average_rating: 4.6, total_reviews: 156 },
      { phone: '0911000001', name: 'Bùi Thanh Hải', specialties: ['Sơn nhà', 'Chống thấm tường', 'Trát tường', 'Ốp lát gạch'], experience_years: '15', districts_active: ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 10'], is_verified: true, average_rating: 4.9, total_reviews: 420 },
      { phone: '0911000017', name: 'Phan Đình Tùng', specialties: ['Thợ mộc', 'Đóng tủ áo', 'Sơn PU', 'Sửa cửa gỗ'], experience_years: '20', districts_active: ['Gò Vấp', 'Quận 12'], is_verified: true, average_rating: 5.0, total_reviews: 512 },
      { phone: '0911000018', name: 'Lê Công Tuấn', specialties: ['Khoan tường', 'Treo tranh', 'Lắp rèm cửa', 'Nội thất'], experience_years: '2', districts_active: ['Tân Bình', 'Tân Phú'], is_verified: false, average_rating: 4.0, total_reviews: 15 },
      { phone: '0911000019', name: 'Nguyễn Tường Vy', specialties: ['Thiết kế nội thất', 'Cải tạo nhà ở', 'Decal dán tường'], experience_years: '6', districts_active: ['Quận 7', 'Quận 1'], is_verified: true, average_rating: 4.8, total_reviews: 89 },

      // --- KHÓA & CỬA & CƠ KHÍ ---
      { phone: '0906666666', name: 'Đỗ Quốc Bảo', specialties: ['Sửa khóa', 'Cửa cuốn', 'Khóa vân tay', 'Két sắt'], experience_years: '7', districts_active: ['Quận 5', 'Quận 6', 'Quận 8'], is_verified: true, average_rating: 4.8, total_reviews: 201 },
      { phone: '0911000020', name: 'Trần Thanh Tâm', specialties: ['Mở khóa tận nhà', 'Làm chìa khóa xe máy', 'Khóa cửa tay gạt'], experience_years: '10', districts_active: ['Quận 1', 'Bình Thạnh'], is_verified: true, average_rating: 4.9, total_reviews: 345 },
      { phone: '0911000021', name: 'Vương Đình Huệ', specialties: ['Sửa cửa nhôm kính', 'Bản lề sàn', 'Cửa cuốn đứt nan'], experience_years: '8', districts_active: ['Tân Bình', 'Phú Nhuận'], is_verified: true, average_rating: 4.7, total_reviews: 211 },
      { phone: '0911000022', name: 'Lê Phi Yến', specialties: ['Khóa từ thông minh', 'Lắp đặt khóa vân tay'], experience_years: '4', districts_active: ['Quận 2', 'Quận 9'], is_verified: false, average_rating: 4.5, total_reviews: 42 },
      { phone: '0911000023', name: 'Trương Vô Kỵ', specialties: ['Hàn xì', 'Sửa cổng sắt', 'Mái tôn', 'Cơ khí'], experience_years: '14', districts_active: ['Thủ Đức', 'Bình Dương'], is_verified: true, average_rating: 4.8, total_reviews: 188 },

      // --- XE CỘ & BẢO DƯỠNG MÁY MÓC ---
      { phone: '0911000024', name: 'Mai Văn Tình', specialties: ['Sửa xe máy lưu động', 'Vá lốp xe', 'Cứu hộ xe máy'], experience_years: '5', districts_active: ['Quận 10', 'Quận 11', 'Tân Phú'], is_verified: true, average_rating: 4.9, total_reviews: 450 },
      { phone: '0911000025', name: 'Ngô Bá Khá', specialties: ['Bảo dưỡng xe hơi', 'Sửa ô tô', 'Thay ắc quy tại nhà'], experience_years: '9', districts_active: ['Quận 7', 'Quận 4'], is_verified: true, average_rating: 4.7, total_reviews: 124 },
      { phone: '0911000026', name: 'Lý Tiểu Long', specialties: ['Sửa xe đạp điện', 'Xe máy điện', 'Thay pin xe điện'], experience_years: '6', districts_active: ['Bình Thạnh', 'Gò Vấp'], is_verified: true, average_rating: 4.6, total_reviews: 87 },
      { phone: '0911000027', name: 'Trần Hạo Nam', specialties: ['Rửa xe tại nhà', 'Chăm sóc xe hơi', 'Phủ ceramic'], experience_years: '4', districts_active: ['Quận 2', 'Quận 1'], is_verified: false, average_rating: 4.4, total_reviews: 33 },

      // --- CÁC NGÀNH NGHỀ KHÁC ---
      { phone: '0907777777', name: 'Vũ Hải Đăng', specialties: ['Điện lạnh', 'Máy giặt', 'Tủ lạnh', 'Máy rửa chén'], experience_years: '5', districts_active: ['Tân Bình', 'Tân Phú', 'Bình Tân'], is_verified: true, average_rating: 4.7, total_reviews: 143 },
      { phone: '0911000028', name: 'Châu Tinh Trì', specialties: ['Lắp đặt bạt che', 'Mái hiên di động'], experience_years: '8', districts_active: ['Thủ Đức', 'Quận 12'], is_verified: true, average_rating: 4.6, total_reviews: 156 },
      { phone: '0911000029', name: 'Quan Vũ', specialties: ['Di chuyển đồ đạc', 'Chuyển nhà trọn gói', 'Bốc xếp'], experience_years: '7', districts_active: ['Quận 8', 'Quận 4', 'Quận 7'], is_verified: true, average_rating: 4.8, total_reviews: 290 },
      { phone: '0911000030', name: 'Trương Phi', specialties: ['Sửa máy bơm nước', 'Khoan giếng', 'Sục rửa đường ống'], experience_years: '12', districts_active: ['Hóc Môn', 'Củ Chi'], is_verified: true, average_rating: 4.9, total_reviews: 410 },
      { phone: '0911000031', name: 'Tôn Ngộ Không', specialties: ['Cắt tỉa cây cảnh', 'Chăm sóc sân vườn'], experience_years: '6', districts_active: ['Quận 2', 'Quận 9'], is_verified: false, average_rating: 4.3, total_reviews: 18 }
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
