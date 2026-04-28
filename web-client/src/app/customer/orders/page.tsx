"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  worker_name: string;
  worker_phone: string;
  worker_avatar?: string;
  status: string;
  scheduled_time: string;
  address: string;
  description: string;
  created_at: string;
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewJob, setReviewJob] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
      fetchOrders(parsedUser.id);
    } catch { router.push('/login'); }
  }, [router]);

  const fetchOrders = async (userId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/jobs/customer/${userId}`);
      if (!res.ok) throw new Error('Không thể tải lịch sử đơn hàng');
      const data = await res.json();
      setOrders(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PENDING:   { bg: '#FEF3C7', color: '#D97706', label: 'Đang chờ thợ' },
      ACCEPTED:  { bg: '#DBEAFE', color: '#2563EB', label: 'Thợ đã nhận' },
      COMPLETED: { bg: '#D1FAE5', color: '#059669', label: 'Đã hoàn thành' },
      CANCELLED: { bg: '#FEE2E2', color: '#DC2626', label: 'Đã hủy' },
    };
    const s = map[status] ?? { bg: '#F3F4F6', color: '#4B5563', label: status };
    return <span style={{ backgroundColor: s.bg, color: s.color, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{s.label}</span>;
  };

  const handleReviewSubmit = async () => {
    if (!reviewJob) return;
    try {
      setReviewLoading(true);
      const res = await fetch(`http://localhost:5000/api/jobs/${reviewJob.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, customer_id: user.id }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as any).error || 'Lỗi khi đánh giá');
      }
      alert('Đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến.');
      setReviewJob(null);
      setRating(5);
      setComment('');
      fetchOrders(user.id);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Lịch sử Đơn hàng</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Theo dõi trạng thái các yêu cầu sửa chữa của bạn</p>
          </div>
          <button onClick={() => router.push('/customer/home')}
            style={{ padding: '10px 20px', backgroundColor: 'white', border: '1.5px solid var(--border-color)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)' }}>
            Về trang chủ
          </button>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</div>}
        {error && <div style={{ padding: '20px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '16px', textAlign: 'center', fontWeight: '600' }}>{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px' }}>Chưa có đơn hàng nào</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Bạn chưa đặt thợ lần nào. Hãy tìm thợ và đặt ngay nhé!</p>
            <button onClick={() => router.push('/customer/search')}
              style={{ padding: '12px 24px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
              Tìm thợ ngay
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F3F4F6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {order.worker_avatar ? <img src={order.worker_avatar} alt={order.worker_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👷‍♂️'}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{order.worker_name}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>📞 {order.worker_phone}</p>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Lịch hẹn</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {new Date(order.scheduled_time).toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Địa chỉ</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{order.address}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Mô tả tình trạng</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>{order.description}</div>
                </div>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Đã đặt lúc: {new Date(order.created_at).toLocaleString('vi-VN')}</div>
                {order.status === 'COMPLETED' && (
                  <button onClick={() => setReviewJob(order)}
                    style={{ padding: '8px 16px', backgroundColor: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                    ⭐ Đánh giá Thợ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {reviewJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', padding: '24px' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: 'var(--text-primary)' }}>Đánh giá dịch vụ</h2>
            <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Bạn cảm thấy hài lòng với thợ <strong style={{ color: 'var(--accent-primary)' }}>{reviewJob.worker_name}</strong> chứ?
            </p>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)}
                  style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer', color: star <= rating ? '#F59E0B' : '#E5E7EB' }}>★</button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn (tùy chọn)..." rows={3}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid var(--border-color)', marginBottom: '24px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setReviewJob(null)} disabled={reviewLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'none', border: '1.5px solid var(--border-color)', fontWeight: '700', cursor: 'pointer' }}>Đóng</button>
              <button onClick={handleReviewSubmit} disabled={reviewLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                {reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
