const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/workers/search
 * Tìm kiếm thợ theo từ khóa, lọc theo rating, giá và khoảng cách (tạm thời bỏ qua distance vì chưa có GPS)
 *
 * Query params:
 *   q         - Từ khóa tìm kiếm (tên, chuyên môn, khu vực)
 *   min_rating - Lọc theo rating tối thiểu (vd: 4, 4.5)
 *   max_price  - Lọc theo giá tối đa (chưa dùng vì chưa có bảng worker_services riêng)
 *   limit      - Số lượng kết quả (mặc định 20)
 *   offset     - Phân trang (mặc định 0)
 */
router.get('/search', async (req, res) => {
  try {
    const { q = '', min_rating, limit = 20, offset = 0 } = req.query;

    // Xây dựng câu WHERE động
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Tìm kiếm linh hoạt: ILIKE không phân biệt hoa/thường
    if (q.trim()) {
      const keyword = `%${q.trim()}%`;
      conditions.push(`(
        w.full_name ILIKE $${paramIndex}
        OR w.phone_number ILIKE $${paramIndex}
        OR array_to_string(w.specialties, ' ') ILIKE $${paramIndex}
        OR array_to_string(w.districts_active, ' ') ILIKE $${paramIndex}
      )`);
      values.push(keyword);
      paramIndex++;
    }

    // Lọc theo rating tối thiểu
    if (min_rating) {
      conditions.push(`w.average_rating >= $${paramIndex}`);
      values.push(parseFloat(min_rating));
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query chính
    const queryText = `
      SELECT
        w.id,
        w.full_name,
        w.phone_number,
        w.avatar_url,
        w.specialties,
        w.experience_years,
        w.districts_active,
        w.is_verified,
        w.average_rating,
        w.total_reviews,
        w.created_at
      FROM workers w
      ${whereClause}
      ORDER BY w.is_verified DESC, w.average_rating DESC, w.total_reviews DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    values.push(parseInt(limit));
    values.push(parseInt(offset));

    // Query đếm tổng số kết quả (để phân trang)
    const countQuery = `
      SELECT COUNT(*) FROM workers w ${whereClause}
    `;
    const countValues = values.slice(0, paramIndex - 1); // bỏ limit và offset

    const [result, countResult] = await Promise.all([
      db.query(queryText, values),
      db.query(countQuery, countValues),
    ]);

    res.status(200).json({
      keyword: q,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset),
      workers: result.rows,
    });

  } catch (error) {
    console.error('Lỗi khi tìm kiếm thợ:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message, stack: error.stack });
  }
});

/**
 * GET /api/workers
 * Lấy danh sách tất cả thợ (có phân trang, không cần từ khóa)
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await db.query(
      `SELECT id, full_name, phone_number, avatar_url, specialties, experience_years,
              districts_active, is_verified, average_rating, total_reviews
       FROM workers
       ORDER BY is_verified DESC, average_rating DESC, total_reviews DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM workers');

    res.status(200).json({
      total: parseInt(countResult.rows[0].count),
      workers: result.rows,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thợ:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message });
  }
});

module.exports = router;
