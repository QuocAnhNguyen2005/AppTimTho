const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/jobs
 * Tạo một yêu cầu đặt thợ (Booking/Job) mới
 */
router.post('/', async (req, res) => {
  try {
    const { worker_id, customer_id, scheduled_time, address, description } = req.body;

    // Validate
    if (!worker_id || !customer_id || !scheduled_time || !address || !description) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    // Insert into DB
    const queryText = `
      INSERT INTO jobs (customer_id, worker_id, scheduled_time, address, description, status)
      VALUES ($1, $2, $3, $4, $5, 'PENDING')
      RETURNING id, status, created_at
    `;
    const values = [customer_id, worker_id, new Date(scheduled_time), address, description];

    const result = await db.query(queryText, values);

    res.status(201).json({
      message: 'Đặt thợ thành công',
      job: result.rows[0],
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn đặt thợ:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message });
  }
});

/**
 * GET /api/jobs/customer/:customer_id
 * Lấy danh sách lịch sử đơn hàng của một khách hàng
 */
router.get('/customer/:customer_id', async (req, res) => {
  try {
    const { customer_id } = req.params;

    const queryText = `
      SELECT 
        j.id,
        j.scheduled_time,
        j.address,
        j.description,
        j.status,
        j.created_at,
        w.id as worker_id,
        w.full_name as worker_name,
        w.phone_number as worker_phone,
        w.avatar_url as worker_avatar
      FROM jobs j
      JOIN workers w ON j.worker_id = w.id
      WHERE j.customer_id = $1
      ORDER BY j.created_at DESC
    `;
    const result = await db.query(queryText, [customer_id]);

    res.status(200).json({
      total: result.rowCount,
      jobs: result.rows,
    });
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message });
  }
});

/**
 * GET /api/jobs/worker/:worker_id
 * Lấy danh sách đơn hàng được giao cho thợ
 */
router.get('/worker/:worker_id', async (req, res) => {
  try {
    const { worker_id } = req.params;

    const queryText = `
      SELECT 
        j.id,
        j.scheduled_time,
        j.address,
        j.description,
        j.status,
        j.total_price,
        j.created_at,
        u.full_name as customer_name,
        u.phone_number as customer_phone
      FROM jobs j
      JOIN users u ON j.customer_id = u.id
      WHERE j.worker_id = $1
      ORDER BY 
        CASE j.status 
          WHEN 'PENDING' THEN 1 
          WHEN 'ACCEPTED' THEN 2 
          ELSE 3 
        END,
        j.created_at DESC
    `;
    const result = await db.query(queryText, [worker_id]);

    res.status(200).json({
      total: result.rowCount,
      jobs: result.rows,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn của thợ:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message });
  }
});

/**
 * PUT /api/jobs/:job_id/status
 * Thợ Nhận hoặc Từ chối đơn
 */
router.put('/:job_id/status', async (req, res) => {
  try {
    const { job_id } = req.params;
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const result = await db.query(
      'UPDATE jobs SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, job_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json({ message: 'Đã cập nhật trạng thái', job: result.rows[0] });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message });
  }
});

/**
 * POST /api/jobs/:job_id/complete
 * Nghiệm thu đơn hàng: Nhập tổng tiền, tính hoa hồng, cộng số dư thợ
 */
router.post('/:job_id/complete', async (req, res) => {
  try {
    const { job_id } = req.params;
    const { total_price } = req.body;

    if (!total_price || isNaN(total_price) || total_price <= 0) {
      return res.status(400).json({ error: 'Vui lòng nhập tổng tiền hợp lệ' });
    }

    // Bắt đầu transaction
    await db.query('BEGIN');

    // 1. Kiểm tra đơn hàng & lấy worker_id
    const jobRes = await db.query('SELECT worker_id, status FROM jobs WHERE id = $1', [job_id]);
    if (jobRes.rowCount === 0) throw new Error('Không tìm thấy đơn hàng');
    if (jobRes.rows[0].status !== 'ACCEPTED') throw new Error('Chỉ có thể hoàn thành đơn Đã nhận');

    const workerId = jobRes.rows[0].worker_id;

    // 2. Tính toán: Admin 15.5%, Thợ 84.5%
    const adminFee = (total_price * 15.5) / 100;
    const workerEarnings = total_price - adminFee;

    // 3. Cập nhật đơn hàng (Lưu total_price, đổi trạng thái)
    await db.query(
      'UPDATE jobs SET status = $1, total_price = $2 WHERE id = $3',
      ['COMPLETED', total_price, job_id]
    );

    // 4. Cộng tiền vào balance của thợ
    await db.query(
      'UPDATE workers SET balance = balance + $1 WHERE id = $2',
      [workerEarnings, workerId]
    );

    // (Tuỳ chọn: Thêm ghi nhận vào bảng payments nếu dùng chung)
    await db.query(`
      INSERT INTO payments (booking_id, amount, transaction_type, status) 
      VALUES (NULL, $1, 'PLATFORM_FEE', 'COMPLETED')
    `, [adminFee]);

    // Hoàn tất transaction
    await db.query('COMMIT');

    res.status(200).json({ 
      message: 'Hoàn thành đơn hàng thành công', 
      total_price, 
      workerEarnings, 
      adminFee 
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Lỗi khi nghiệm thu đơn hàng:', error);
    res.status(500).json({ error: error.message || 'Lỗi server nội bộ' });
  }
});

/**
 * POST /api/jobs/:job_id/review
 * Khách hàng đánh giá thợ sau khi hoàn thành
 */
router.post('/:job_id/review', async (req, res) => {
  try {
    const { job_id } = req.params;
    const { rating, comment, customer_id } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating phải từ 1 đến 5 sao' });
    }

    // Lấy worker_id từ job
    const jobRes = await db.query('SELECT worker_id, status FROM jobs WHERE id = $1 AND customer_id = $2', [job_id, customer_id]);
    if (jobRes.rowCount === 0) throw new Error('Không tìm thấy đơn hàng hợp lệ');
    if (jobRes.rows[0].status !== 'COMPLETED') throw new Error('Chỉ được đánh giá đơn đã hoàn thành');

    const workerId = jobRes.rows[0].worker_id;

    await db.query('BEGIN');

    // Insert review
    await db.query(`
      INSERT INTO reviews (job_id, user_id, worker_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
    `, [job_id, customer_id, workerId, rating, comment]);

    // Update worker average rating
    const avgRes = await db.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE worker_id = $1', [workerId]);
    const avgRating = parseFloat(avgRes.rows[0].avg_rating).toFixed(1);
    const totalReviews = parseInt(avgRes.rows[0].total);

    await db.query('UPDATE workers SET average_rating = $1, total_reviews = $2 WHERE id = $3', [avgRating, totalReviews, workerId]);

    await db.query('COMMIT');

    res.status(201).json({ message: 'Cảm ơn bạn đã đánh giá!' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Lỗi khi đánh giá:', error);
    res.status(500).json({ error: error.message || 'Lỗi server nội bộ' });
  }
});

/**
 * GET /api/jobs/:job_id
 * Lấy thông tin chi tiết một đơn hàng (Dùng cho Polling ở Mobile)
 */
router.get('/:job_id', async (req, res) => {
  try {
    const { job_id } = req.params;
    const queryText = `
      SELECT 
        j.id, j.status, j.total_price, j.created_at,
        w.id as worker_id, w.full_name as worker_name, w.phone_number as worker_phone
      FROM jobs j
      LEFT JOIN workers w ON j.worker_id = w.id
      WHERE j.id = $1
    `;
    const result = await db.query(queryText, [job_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json({ job: result.rows[0] });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi server nội bộ', details: error.message });
  }
});

module.exports = router;
