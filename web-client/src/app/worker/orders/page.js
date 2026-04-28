"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerOrdersPage() {
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, COMPLETED, CANCELED
  const [timeFilter, setTimeFilter] = useState('ALL'); // ALL, THIS_WEEK, THIS_MONTH
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Job for Modal
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (!saved || role !== 'worker') {
      router.push('/login');
      return;
    }
    const user = JSON.parse(saved);
    setWorker(user);
    fetchJobs(user.id);
  }, [router]);

  const fetchJobs = async (workerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/worker/${workerId}`);
      if (res.ok) {
        const data = await res.json();
        // Sắp xếp đơn mới nhất lên đầu
        const sortedJobs = (data.jobs || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setJobs(sortedJobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredJobs = () => {
    return jobs.filter(job => {
      // 1. Filter by Status
      if (statusFilter === 'COMPLETED' && job.status !== 'COMPLETED') return false;
      if (statusFilter === 'CANCELED' && job.status !== 'REJECTED' && job.status !== 'CANCELED') return false; // Giả sử REJECTED/CANCELED là hủy

      // 2. Filter by Time
      if (timeFilter !== 'ALL') {
        const jobDate = new Date(job.created_at);
        const now = new Date();
        if (timeFilter === 'THIS_WEEK') {
          const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); // Thứ 2
          firstDayOfWeek.setHours(0,0,0,0);
          if (jobDate < firstDayOfWeek) return false;
        } else if (timeFilter === 'THIS_MONTH') {
          if (jobDate.getMonth() !== now.getMonth() || jobDate.getFullYear() !== now.getFullYear()) return false;
        }
      }
      return true;
    });
  };

  const filteredJobs = getFilteredJobs();
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') return <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>Hoàn thành</span>;
    if (status === 'REJECTED' || status === 'CANCELED') return <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>Đã hủy</span>;
    if (status === 'ACCEPTED') return <span style={{ backgroundColor: '#DBEAFE', color: '#2563EB', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>Đang thực hiện</span>;
    return <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>Chờ xác nhận</span>;
  };

  const maskPhone = (phone) => {
    if (!phone) return 'Không có';
    if (phone.length < 10) return phone;
    return phone.substring(0, 4) + '***' + phone.substring(phone.length - 3);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header & Breadcrumb */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/worker/dashboard')} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            ←
          </button>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '800' }}>Quản lý Đơn hàng</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Xem và quản lý tất cả đơn hàng của bạn</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', marginBottom: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Trạng thái</label>
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#F9FAFB' }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELED">Bị hủy / Từ chối</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Thời gian</label>
            <select 
              value={timeFilter} 
              onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#F9FAFB' }}
            >
              <option value="ALL">Toàn thời gian</option>
              <option value="THIS_WEEK">Tuần này</option>
              <option value="THIS_MONTH">Tháng này</option>
            </select>
          </div>
        </div>

        {/* List of Orders */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          {currentJobs.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>Không tìm thấy đơn hàng</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Thử thay đổi bộ lọc hoặc thời gian</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {currentJobs.map((job, idx) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  style={{ 
                    padding: '20px', borderBottom: idx === currentJobs.length - 1 ? 'none' : '1px solid var(--border-color)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    transition: 'background-color 0.2s', ':hover': { backgroundColor: '#F9FAFB' }
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {job.service_name?.includes('Máy lạnh') ? '❄️' : '🔧'}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700' }}>{job.service_name || 'Dịch vụ sửa chữa'}</h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Khách: {job.customer_name} • {new Date(job.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    {getStatusBadge(job.status)}
                    <span style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '15px' }}>
                      {job.total_price ? `${Number(job.total_price).toLocaleString('vi-VN')} ₫` : 'Chưa chốt giá'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            <button 
              disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: currentPage === 1 ? '#F3F4F6' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Trang trước
            </button>
            <span style={{ padding: '8px 16px', fontWeight: '700' }}>Trang {currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: currentPage === totalPages ? '#F3F4F6' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Trang sau
            </button>
          </div>
        )}

      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '450px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setSelectedJob(null)} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
            
            <h2 style={{ margin: '0 0 24px', fontSize: '22px' }}>Chi tiết Đơn hàng</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Khách hàng</span>
                <strong style={{ textAlign: 'right' }}>{selectedJob.customer_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Số điện thoại</span>
                <strong style={{ textAlign: 'right' }}>
                  {selectedJob.status === 'COMPLETED' ? maskPhone(selectedJob.customer_phone) : selectedJob.customer_phone}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Địa chỉ</span>
                <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{selectedJob.address}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Dịch vụ</span>
                <strong style={{ textAlign: 'right' }}>{selectedJob.service_name || 'Không rõ'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Trạng thái</span>
                {getStatusBadge(selectedJob.status)}
              </div>
              
              {(selectedJob.status === 'REJECTED' || selectedJob.status === 'CANCELED') && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Lý do hủy</span>
                  <strong style={{ textAlign: 'right', color: '#DC2626' }}>{selectedJob.cancel_reason || 'Không có lý do'}</strong>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '12px', marginTop: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>Tổng tiền</span>
                <strong style={{ fontSize: '18px', color: 'var(--accent-primary)' }}>
                  {selectedJob.total_price ? `${Number(selectedJob.total_price).toLocaleString('vi-VN')} ₫` : 'Chưa báo giá'}
                </strong>
              </div>
            </div>

            <button onClick={() => setSelectedJob(null)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#F3F4F6', color: 'var(--text-primary)', fontWeight: '700', fontSize: '15px', marginTop: '24px', cursor: 'pointer' }}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
