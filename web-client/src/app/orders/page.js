"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Kiểm tra đăng nhập
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) {
      router.push('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
      fetchOrders(parsedUser.id);
    } catch {
      router.push('/login');
    }
  }, [router]);

  // 2. Gọi API lấy danh sách đơn hàng
  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/jobs/customer/${userId}`);
      if (!res.ok) {
        throw new Error('Không thể tải lịch sử đơn hàng');
      }
      const data = await res.json();
      setOrders(data.jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Hàm hiển thị trạng thái đơn hàng (Badge)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Đang chờ thợ</span>;
      case 'ACCEPTED':
        return <span style={{ backgroundColor: '#DBEAFE', color: '#2563EB', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Thợ đã nhận</span>;
      case 'COMPLETED':
        return <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Đã hoàn thành</span>;
      case 'CANCELLED':
        return <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Đã hủy</span>;
      default:
        return <span style={{ backgroundColor: '#F3F4F6', color: '#4B5563', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{status}</span>;
    }
  };

  if (!user) return null; // Đang redirect

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '100px 20px 40px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Lịch sử Đơn hàng</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Theo dõi trạng thái các yêu cầu sửa chữa của bạn</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            style={{ padding: '10px 20px', backgroundColor: 'white', border: '1.5px solid var(--border-color)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)' }}>
            Về trang chủ
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Đang tải dữ liệu...
          </div>
        )}

        {error && (
          <div style={{ padding: '20px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '16px', textAlign: 'center', fontWeight: '600' }}>
            {error}
          </div>
        )}

        {/* Danh sách đơn hàng */}
        {!loading && !error && orders.length === 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px' }}>Chưa có đơn hàng nào</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Bạn chưa đặt thợ lần nào. Hãy tìm thợ và đặt ngay nhé!</p>
            <button 
              onClick={() => router.push('/')}
              style={{ padding: '12px 24px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
              Tìm thợ ngay
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ 
              backgroundColor: 'white', borderRadius: '20px', padding: '24px', 
              border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              {/* Header Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                    {order.worker_avatar ? (
                      <img src={order.worker_avatar} alt={order.worker_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👷‍♂️</div>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{order.worker_name}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>📞 {order.worker_phone}</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Body Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Lịch hẹn</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {new Date(order.scheduled_time).toLocaleString('vi-VN', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Địa chỉ</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{order.address}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Mô tả tình trạng</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    {order.description}
                  </div>
                </div>
              </div>

              {/* Footer Card */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                Đã đặt lúc: {new Date(order.created_at).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
