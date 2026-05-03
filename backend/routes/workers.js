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
    const conditions = ['w.is_online = true'];
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

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

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
       WHERE is_online = true
       ORDER BY is_verified DESC, average_rating DESC, total_reviews DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM workers WHERE is_online = true');

    res.status(200).json({
      total: parseInt(countResult.rows[0].count),
      workers: result.rows,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thợ:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message });
  }
});

/**
 * PUT /api/workers/:worker_id/status
 * Bật/Tắt trạng thái hoạt động (is_online)
 */
router.put('/:worker_id/status', async (req, res) => {
  try {
    const { worker_id } = req.params;
    const { is_online } = req.body;

    const result = await db.query(
      'UPDATE workers SET is_online = $1 WHERE id = $2 RETURNING id, is_online',
      [is_online, worker_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thợ' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái thành công', worker: result.rows[0] });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái online:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
});

/**
 * GET /api/workers/:worker_id/dashboard-stats
 * Lấy thống kê: Thu nhập tháng, Tổng đơn, Reviews, Lịch sử giao dịch
 */
router.get('/:worker_id/dashboard-stats', async (req, res) => {
  try {
    const { worker_id } = req.params;

    // 1. Lấy thông tin cơ bản
    const workerRes = await db.query('SELECT is_online, balance, average_rating, total_reviews FROM workers WHERE id = $1', [worker_id]);
    if (workerRes.rowCount === 0) return res.status(404).json({ error: 'Không tìm thấy thợ' });
    
    // 2. Thu nhập tháng này (COMPLETED)
    const incomeRes = await db.query(`
      SELECT SUM(total_price * 0.845) as monthly_income, COUNT(*) as completed_jobs
      FROM jobs 
      WHERE worker_id = $1 AND status = 'COMPLETED'
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `, [worker_id]);

    // Thu nhập tháng trước để so sánh (tuỳ chọn)
    const lastMonthIncomeRes = await db.query(`
      SELECT SUM(total_price * 0.845) as last_monthly_income
      FROM jobs 
      WHERE worker_id = $1 AND status = 'COMPLETED'
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
    `, [worker_id]);

    const thisMonth = parseFloat(incomeRes.rows[0].monthly_income) || 0;
    const lastMonth = parseFloat(lastMonthIncomeRes.rows[0].last_monthly_income) || 0;
    
    let growthRate = 0;
    if (lastMonth > 0) {
      growthRate = ((thisMonth - lastMonth) / lastMonth) * 100;
    } else if (thisMonth > 0) {
      growthRate = 100;
    }

    // 3. Lấy 3 đánh giá 5 sao mới nhất
    const reviewsRes = await db.query(`
      SELECT r.rating, r.comment, r.created_at, u.full_name as customer_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.worker_id = $1 AND r.rating >= 4
      ORDER BY r.created_at DESC
      LIMIT 3
    `, [worker_id]);

    res.status(200).json({
      worker: workerRes.rows[0],
      stats: {
        monthly_income: thisMonth,
        completed_jobs: parseInt(incomeRes.rows[0].completed_jobs) || 0,
        growth_rate: growthRate.toFixed(1)
      },
      latest_reviews: reviewsRes.rows
    });

  } catch (error) {
    console.error('Lỗi khi lấy dashboard stats:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
});

/**
 * GET /api/workers/:worker_id/wallet
 * Lấy số dư và thống kê ví
 */
router.get('/:worker_id/wallet', async (req, res) => {
  try {
    const { worker_id } = req.params;
    
    // balance from workers table
    const workerRes = await db.query('SELECT balance FROM workers WHERE id = $1', [worker_id]);
    if (workerRes.rowCount === 0) return res.status(404).json({ error: 'Không tìm thấy thợ' });
    
    const balance = parseFloat(workerRes.rows[0].balance) || 0;

    // total_earned, total_commission from jobs
    const statsRes = await db.query(`
      SELECT 
        SUM(total_price) as total_revenue,
        SUM(total_price * 0.845) as total_earned,
        SUM(total_price * 0.155) as total_commission
      FROM jobs 
      WHERE worker_id = $1 AND status = 'COMPLETED'
    `, [worker_id]);

    const thisMonthRes = await db.query(`
      SELECT SUM(total_price * 0.845) as this_month_earned
      FROM jobs 
      WHERE worker_id = $1 AND status = 'COMPLETED'
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `, [worker_id]);

    res.status(200).json({
      balance,
      total_earned: parseFloat(statsRes.rows[0].total_earned) || 0,
      total_commission: parseFloat(statsRes.rows[0].total_commission) || 0,
      this_month_earned: parseFloat(thisMonthRes.rows[0].this_month_earned) || 0
    });
  } catch (error) {
    console.error('Lỗi lấy ví:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

/**
 * GET /api/workers/:worker_id/transactions
 * Lấy lịch sử giao dịch (Mô phỏng từ bảng jobs)
 */
router.get('/:worker_id/transactions', async (req, res) => {
  try {
    const { worker_id } = req.params;
    
    // Since we don't have a transactions table, we mock it using completed jobs
    const jobsRes = await db.query(`
      SELECT 
        id as job_id, 
        total_price as amount,
        (total_price * 0.155) as commission,
        (total_price * 0.845) as net_amount,
        created_at,
        'INCOME' as type
      FROM jobs
      WHERE worker_id = $1 AND status = 'COMPLETED'
      ORDER BY created_at DESC
    `, [worker_id]);

    const transactions = jobsRes.rows.map((row, index) => ({
      ...row,
      id: index + 1 // mock transaction ID
    }));

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Lỗi lấy transactions:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

/**
 * GET /api/workers/:worker_id/reviews
 * Lấy danh sách đánh giá của thợ
 */
router.get('/:worker_id/reviews', async (req, res) => {
  try {
    const { worker_id } = req.params;

    const reviewsRes = await db.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, r.job_id, u.full_name as customer_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.worker_id = $1
      ORDER BY r.created_at DESC
    `, [worker_id]);

    const statsRes = await db.query(`
      SELECT average_rating, total_reviews FROM workers WHERE id = $1
    `, [worker_id]);

    const distributionRes = await db.query(`
      SELECT rating, COUNT(*) as count 
      FROM reviews 
      WHERE worker_id = $1 
      GROUP BY rating
    `, [worker_id]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distributionRes.rows.forEach(r => {
      distribution[r.rating] = parseInt(r.count);
    });

    res.status(200).json({
      reviews: reviewsRes.rows,
      stats: {
        average_rating: parseFloat(statsRes.rows[0]?.average_rating) || 0,
        total_reviews: parseInt(statsRes.rows[0]?.total_reviews) || 0,
        rating_distribution: distribution
      }
    });

  } catch (error) {
    console.error('Lỗi lấy reviews:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
