"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerDashboard() {
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Checkout Modal State
  const [checkoutJob, setCheckoutJob] = useState(null);
  const [totalPrice, setTotalPrice] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (!saved) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(saved);
    if (role !== 'worker') {
      alert('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }
    
    // Giả lập worker có balance (API auth hiện tại chưa trả về balance, tạm thời để 0, hoặc có thể thêm endpoint getProfile sau)
    setWorker({ ...user, balance: user.balance || 0 });
    fetchJobs(user.id);
  }, [router]);

  const fetchJobs = async (workerId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/jobs/worker/${workerId}`);
      if (!res.ok) throw new Error('Không thể tải danh sách đơn hàng');
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Lỗi cập nhật trạng thái');
      fetchJobs(worker.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteJob = async () => {
    if (!totalPrice || isNaN(totalPrice) || Number(totalPrice) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${checkoutJob.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_price: Number(totalPrice) }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(()=>({}));
        throw new Error(errData.error || 'Lỗi nghiệm thu đơn hàng');
      }
      
      const data = await res.json();
      alert(`Đã hoàn thành đơn hàng!\nDoanh thu của bạn: ${data.workerEarnings.toLocaleString('vi-VN')} VND\nPhí nền tảng (15.5%): ${data.adminFee.toLocaleString('vi-VN')} VND`);
      
      setCheckoutJob(null);
      setTotalPrice('');
      fetchJobs(worker.id);
      
      // Update local worker balance
      setWorker(prev => ({ ...prev, balance: Number(prev.balance) + data.workerEarnings }));
      
    } catch (err) {
      alert(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!worker) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '100px 20px 40px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header & Balance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Bảng điều khiển Thợ</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Quản lý các yêu cầu sửa chữa được giao cho bạn</p>
          </div>
          <div style={{ 
            backgroundColor: 'var(--accent-primary)', padding: '16px 24px', borderRadius: '16px', 
            color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            boxShadow: '0 10px 25px rgba(59,130,246,0.3)'
          }}>
            <span style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số dư ví (VNĐ)</span>
            <span style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0 0' }}>
              {Number(worker.balance).toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải dữ liệu...</div>
        ) : error ? (
          <div style={{ padding: '20px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '16px', textAlign: 'center' }}>{error}</div>
        ) : jobs.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💤</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px' }}>Chưa có yêu cầu nào</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Hiện tại không có đơn hàng nào đang chờ bạn xử lý.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {jobs.map(job => (
              <div key={job.id} style={{ 
                backgroundColor: 'white', borderRadius: '20px', padding: '24px',
                borderLeft: job.status === 'PENDING' ? '4px solid #F59E0B' : job.status === 'ACCEPTED' ? '4px solid #3B82F6' : '4px solid #10B981',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>Khách: {job.customer_name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>📞 {job.customer_phone}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Trạng thái</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: job.status === 'PENDING' ? '#F59E0B' : job.status === 'ACCEPTED' ? '#3B82F6' : '#10B981' }}>
                      {job.status}
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Lịch hẹn</span>
                      <strong style={{ fontSize: '14px' }}>{new Date(job.scheduled_time).toLocaleString('vi-VN')}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Địa chỉ</span>
                      <strong style={{ fontSize: '14px' }}>{job.address}</strong>
                    </div>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Mô tả vấn đề</span>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-primary)' }}>{job.description}</p>
                  </div>
                  {job.status === 'COMPLETED' && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E5E7EB' }}>
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Tổng tiền dịch vụ</span>
                      <strong style={{ fontSize: '16px', color: '#10B981' }}>{Number(job.total_price).toLocaleString('vi-VN')} ₫</strong>
                    </div>
                  )}
                </div>

                {/* Hành động */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  {job.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleUpdateStatus(job.id, 'REJECTED')} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '700', cursor: 'pointer' }}>
                        Từ chối
                      </button>
                      <button onClick={() => handleUpdateStatus(job.id, 'ACCEPTED')} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#3B82F6', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                        Nhận việc
                      </button>
                    </>
                  )}
                  {job.status === 'ACCEPTED' && (
                    <button onClick={() => setCheckoutJob(job)} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#10B981', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
                      ✅ Hoàn thành & Nhận tiền
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {checkoutJob && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', borderRadius: '20px',
            width: '100%', maxWidth: '400px', overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            padding: '24px'
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: 'var(--text-primary)' }}>Nghiệm thu đơn hàng</h2>
            <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Vui lòng nhập tổng số tiền (VND) khách hàng cần thanh toán cho đơn sửa chữa này.
            </p>
            
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Tổng tiền dịch vụ (VND)</label>
            <input 
              type="number" 
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder="VD: 500000"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--border-color)', marginBottom: '24px', fontSize: '16px', fontWeight: '600' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setCheckoutJob(null)}
                disabled={checkoutLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'none', border: '1.5px solid var(--border-color)', fontWeight: '700', cursor: 'pointer' }}>
                Hủy
              </button>
              <button 
                onClick={handleCompleteJob}
                disabled={checkoutLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                {checkoutLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
