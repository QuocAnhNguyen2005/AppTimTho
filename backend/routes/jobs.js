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

module.exports = router;
