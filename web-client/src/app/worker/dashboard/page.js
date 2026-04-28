"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerDashboard() {
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [activeTab, setActiveTab] = useState('PENDING');
  const [isOnline, setIsOnline] = useState(true);
  const [checkoutJob, setCheckoutJob] = useState(null);
  const [totalPrice, setTotalPrice] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (!saved || role !== 'worker') {
      router.push('/login');
      return;
    }
    const user = JSON.parse(saved);
    setWorker(user);
    loadAllData(user.id);
  }, [router]);

  const loadAllData = async (workerId) => {
    setLoading(true);
    await Promise.all([
      fetchJobs(workerId),
      fetchStats(workerId)
    ]);
    setLoading(false);
  };

  const fetchJobs = async (workerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/worker/${workerId}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async (workerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/workers/${workerId}/dashboard-stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setReviews(data.latest_reviews || []);
        setIsOnline(data.worker.is_online);
        // Cập nhật lại worker data (bao gồm balance mới nhất)
        setWorker(prev => ({...prev, ...data.worker}));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus); // Optimistic UI
    try {
      await fetch(`http://localhost:5000/api/workers/${worker.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_online: newStatus })
      });
    } catch (err) {
      setIsOnline(!newStatus); // Rollback
      alert('Không thể cập nhật trạng thái');
    }
  };

  const handleUpdateJobStatus = async (jobId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadAllData(worker.id);
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
    }
  };

  const handleCompleteJob = async () => {
    if (!totalPrice || isNaN(totalPrice) || Number(totalPrice) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ'); return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${checkoutJob.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_price: Number(totalPrice) }),
      });
      if (!res.ok) throw new Error('Lỗi nghiệm thu');
      
      alert('Đã hoàn thành đơn hàng!');
      setCheckoutJob(null);
      setTotalPrice('');
      loadAllData(worker.id);
      setActiveTab('COMPLETED');
    } catch (err) {
      alert(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!worker || loading) return <div style={{textAlign: 'center', padding: '100px'}}>Đang tải dữ liệu...</div>;

  const filteredJobs = jobs.filter(j => j.status === activeTab);
  const completedJobsList = jobs.filter(j => j.status === 'COMPLETED').slice(0, 5); // Lấy 5 đơn gần nhất cho bảng sao kê

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '100px 20px 40px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Hàng 1: Header + Online Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              Chào ngày mới, {worker.full_name}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Hôm nay bạn muốn làm việc hay nghỉ ngơi?</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', padding: '12px 20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <span style={{ fontWeight: '700', fontSize: '15px', color: isOnline ? '#10B981' : '#6B7280' }}>
              {isOnline ? '🟢 Đang rảnh (Nhận khách)' : '🔴 Tạm nghỉ (Ẩn hồ sơ)'}
            </span>
            <div 
              onClick={toggleOnlineStatus}
              style={{
                width: '56px', height: '32px', borderRadius: '16px', backgroundColor: isOnline ? '#10B981' : '#E5E7EB',
                position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s'
              }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white',
                position: 'absolute', top: '4px', left: isOnline ? '28px' : '4px', transition: 'left 0.3s',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <p style={{ margin: 0 }}>Cảnh báo lừa đảo: Không yêu cầu khách chuyển khoản ngoài hệ thống. Mọi giao dịch qua ví AppTimTho đều được bảo vệ 100%.</p>
        </div>

        {/* Hàng 2: Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div onClick={() => router.push('/worker/wallet')} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'transform 0.2s', ':hover': {transform: 'translateY(-4px)'} }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>💰 Số dư ví hiện tại</span>
              <span style={{color: '#9CA3AF'}}>➔</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-primary)' }}>{Number(worker.balance).toLocaleString('vi-VN')} ₫</div>
          </div>
          <div onClick={() => router.push('/worker/wallet')} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>📈 Thu nhập tháng này</span>
              <span style={{color: '#9CA3AF'}}>➔</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10B981' }}>{Number(stats?.monthly_income || 0).toLocaleString('vi-VN')} ₫</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: stats?.growth_rate >= 0 ? '#10B981' : '#DC2626', marginBottom: '4px', backgroundColor: stats?.growth_rate >= 0 ? '#D1FAE5' : '#FEE2E2', padding: '2px 8px', borderRadius: '8px' }}>
                {stats?.growth_rate >= 0 ? '+' : ''}{stats?.growth_rate}%
              </div>
            </div>
          </div>
          <div onClick={() => router.push('/worker/orders')} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>✅ Tổng đơn hoàn thành</span>
              <span style={{color: '#9CA3AF'}}>➔</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#3B82F6' }}>{stats?.completed_jobs || 0} <span style={{fontSize:'16px', color:'var(--text-secondary)'}}>đơn</span></div>
          </div>
          <div onClick={() => router.push('/worker/reviews')} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>⭐ Điểm đánh giá</span>
              <span style={{color: '#9CA3AF'}}>➔</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#F59E0B' }}>
              {worker.average_rating} <span style={{fontSize:'16px', color:'var(--text-secondary)'}}>/ 5.0 ({worker.total_reviews} đánh giá)</span>
            </div>
          </div>
        </div>

        {/* Hàng 3: Main Content (Grid 65/35) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px' }}>
          
          {/* CỘT TRÁI: QUẢN LÝ ĐƠN HÀNG */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', backgroundColor: 'white', padding: '8px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              {['PENDING', 'ACCEPTED', 'COMPLETED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: activeTab === tab ? (tab==='PENDING'?'#FEE2E2':tab==='ACCEPTED'?'#DBEAFE':'#D1FAE5') : 'transparent',
                    color: activeTab === tab ? (tab==='PENDING'?'#DC2626':tab==='ACCEPTED'?'#2563EB':'#059669') : 'var(--text-secondary)'
                  }}
                >
                  {tab === 'PENDING' ? '🔥 Đơn Mới Gọi' : tab === 'ACCEPTED' ? '🛠️ Việc Hôm Nay' : '✅ Lịch Sử Hoàn Thành'}
                </button>
              ))}
            </div>

            {/* Danh sách đơn theo Tab */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '20px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>💤</div>
                  <h3 style={{ color: 'var(--text-primary)' }}>Trống trải quá!</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Không có đơn hàng nào ở mục này.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div key={job.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderLeft: activeTab==='PENDING'?'4px solid #DC2626':activeTab==='ACCEPTED'?'4px solid #2563EB':'4px solid #10B981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>Khách: {job.customer_name}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>📞 {job.customer_phone}</p>
                      </div>
                      {activeTab === 'PENDING' && (
                        <div style={{ textAlign: 'right', color: '#DC2626', fontWeight: '700', fontSize: '13px', backgroundColor: '#FEE2E2', padding: '4px 12px', borderRadius: '12px', height: 'fit-content' }}>
                          ⏱️ Mới (Đang chờ nhận)
                        </div>
                      )}
                    </div>

                    <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Lịch hẹn</span>
                        <strong style={{ display: 'block', fontSize: '14px' }}>{new Date(job.scheduled_time).toLocaleString('vi-VN')}</strong>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Địa chỉ</span>
                        <strong style={{ display: 'block', fontSize: '14px' }}>{job.address}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Mô tả vấn đề</span>
                        <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{job.description}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      {activeTab === 'PENDING' && (
                        <>
                          <button onClick={() => handleUpdateJobStatus(job.id, 'REJECTED')} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '700', cursor: 'pointer' }}>Từ chối</button>
                          <button onClick={() => handleUpdateJobStatus(job.id, 'ACCEPTED')} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Chấp nhận ngay</button>
                        </>
                      )}
                      {activeTab === 'ACCEPTED' && (
                        <button onClick={() => setCheckoutJob(job)} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Nghiệm thu & Báo giá</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CỘT PHẢI: ĐỐI SOÁT & VINH DANH */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Lịch Hẹn Sắp Tới (Mini Calendar/Timeline) */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>📅 Lịch hẹn sắp tới</h3>
                <span onClick={() => router.push('/worker/orders')} style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '700', cursor: 'pointer' }}>Xem tất cả</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid #E5E7EB', paddingLeft: '16px', marginLeft: '8px' }}>
                {jobs.filter(j => j.status === 'ACCEPTED').slice(0, 3).map((job, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-23px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563EB', border: '3px solid white' }} />
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
                      {new Date(job.scheduled_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(job.scheduled_time).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{job.customer_name} ({job.customer_phone})</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>📍 {job.address}</div>
                  </div>
                ))}
                {jobs.filter(j => j.status === 'ACCEPTED').length === 0 && (
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Không có lịch hẹn sắp tới.</div>
                )}
              </div>
            </div>

            {/* Sao kê tài chính */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>📊 Sao kê đối soát (5 đơn gần nhất)</h3>
                <span onClick={() => router.push('/worker/wallet')} style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '700', cursor: 'pointer' }}>Xem tất cả</span>
              </div>
              
              {completedJobsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>Chưa có giao dịch nào</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {completedJobsList.map(job => {
                    const price = Number(job.total_price);
                    const fee = price * 0.155;
                    const earn = price - fee;
                    return (
                      <div key={job.id} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                        <div style={{ fontWeight: '700', marginBottom: '8px' }}>KH: {job.customer_name} ({new Date(job.created_at).toLocaleDateString('vi-VN')})</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Tổng thu:</span>
                          <strong>{price.toLocaleString('vi-VN')} ₫</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#DC2626' }}>Phí App (15.5%):</span>
                          <strong style={{ color: '#DC2626' }}>-{fee.toLocaleString('vi-VN')} ₫</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '4px', marginTop: '4px' }}>
                          <span style={{ color: '#10B981', fontWeight: '700' }}>Thực nhận:</span>
                          <strong style={{ color: '#10B981', fontSize: '15px' }}>+{earn.toLocaleString('vi-VN')} ₫</strong>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Vinh danh đánh giá */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>❤️ Lời khen từ Khách</h3>
                <span onClick={() => router.push('/worker/reviews')} style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '700', cursor: 'pointer' }}>Xem tất cả</span>
              </div>
              
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>Chưa có đánh giá nào</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map((rev, idx) => (
                    <div key={idx} style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '16px', border: '1px solid #FEF3C7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '14px' }}>{rev.customer_name}</strong>
                        <span style={{ color: '#F59E0B', fontSize: '14px' }}>{'⭐'.repeat(rev.rating)}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{rev.comment || 'Khách hàng không để lại bình luận'}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '400px', padding: '32px' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '22px' }}>Nghiệm thu đơn hàng</h2>
            <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>Nhập tổng tiền (VND) khách hàng cần thanh toán.</p>
            
            <input 
              type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="Ví dụ: 500000"
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid var(--border-color)', marginBottom: '24px', fontSize: '18px', fontWeight: '700', outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setCheckoutJob(null)} disabled={checkoutLoading} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'none', border: '2px solid var(--border-color)', fontWeight: '700', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleCompleteJob} disabled={checkoutLoading} style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
      {/* SOS Button */}
      <div 
        onClick={() => alert('Đang kết nối đến Hotline Hỗ Trợ Khẩn Cấp của Admin...')}
        style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px',
          backgroundColor: '#EF4444', color: 'white', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)', cursor: 'pointer',
          zIndex: 100, fontSize: '24px', fontWeight: '900', transition: 'transform 0.2s',
          ':hover': { transform: 'scale(1.1)' }
        }}
        title="Trợ giúp khẩn cấp"
      >
        🆘
      </div>
    </div>
  );
}
