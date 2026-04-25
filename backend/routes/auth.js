const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Hàm kiểm tra mật khẩu
function isValidPassword(password) {
  if (!password || password.length < 8 || password.length > 16) return false;
  if (!/[A-Z]/.test(password)) return false;
  const digitCount = (password.match(/\d/g) || []).length;
  if (digitCount < 4) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return false;
  return true;
}

// 1. Đăng ký Khách hàng
router.post('/register/customer', async (req, res) => {
  try {
    const { full_name, phone_number, password, address } = req.body;

    // Validate fields
    if (!full_name || !phone_number || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ các trường bắt buộc' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Mật khẩu phải từ 8-16 ký tự, gồm ít nhất 1 chữ hoa, 4 chữ số và 1 ký tự đặc biệt' });
    }

    // Check if phone already exists
    const existingUser = await db.query('SELECT id FROM users WHERE phone_number = $1', [phone_number]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Số điện thoại này đã được sử dụng' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await db.query(
      'INSERT INTO users (full_name, phone_number, password_hash, address) VALUES ($1, $2, $3, $4) RETURNING id, full_name, phone_number',
      [full_name, phone_number, password_hash, address]
    );

    res.status(201).json({ message: 'Đăng ký Khách hàng thành công', user: newUser.rows[0] });

  } catch (error) {
    console.error('Lỗi khi đăng ký Khách hàng:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
});

// 2. Đăng ký Thợ
router.post('/register/worker', async (req, res) => {
  try {
    const { 
      full_name, phone_number, password, date_of_birth, identity_card, 
      cccd_front_url, cccd_back_url, bank_name, bank_account_number, 
      bank_account_name, specialties, experience_years, districts_active 
    } = req.body;

    // Validate essential fields
    if (!full_name || !phone_number || !password || !identity_card || !bank_name || !bank_account_number) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ các trường bắt buộc' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Mật khẩu phải từ 8-16 ký tự, gồm ít nhất 1 chữ hoa, 4 chữ số và 1 ký tự đặc biệt' });
    }

    // Check if phone already exists
    const existingWorker = await db.query('SELECT id FROM workers WHERE phone_number = $1', [phone_number]);
    if (existingWorker.rows.length > 0) {
      return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký làm Thợ' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert worker
    const newWorker = await db.query(
      `INSERT INTO workers (
        full_name, phone_number, password_hash, date_of_birth, identity_card,
        cccd_front_url, cccd_back_url, bank_name, bank_account_number,
        bank_account_name, specialties, experience_years, districts_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, full_name, phone_number`,
      [
        full_name, phone_number, password_hash, date_of_birth, identity_card,
        cccd_front_url, cccd_back_url, bank_name, bank_account_number,
        bank_account_name, specialties, experience_years, districts_active
      ]
    );

    res.status(201).json({ message: 'Hồ sơ Thợ đã được gửi thành công. Chờ duyệt.', worker: newWorker.rows[0] });

  } catch (error) {
    console.error('Lỗi khi đăng ký Thợ:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
});

module.exports = router;
