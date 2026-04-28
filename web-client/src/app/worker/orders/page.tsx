"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Job {
  id: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  description: string;
  scheduled_time: string;
  status: string;
  price?: number;
  created_at: string;
  review?: { rating: number; comment: string };
}

const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: '#FEF3C7', color: '#D97706', label: 'Chờ xác nhận' },
  ACCEPTED:  { bg: '#DBEAFE', color: '#2563EB', label: 'Đã nhận' },
  COMPLETED: { bg: '#D1FAE5', color: '#059669', label: 'Hoàn thành' },
  CANCELLED: { bg: '#FEE2E2', color: '#DC2626', label: 'Đã huỷ' },
};

export default function WorkerOrdersPage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [orders, setOrders] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try {
      const w = JSON.parse(saved);
      setWorker(w);
      fetchOrders(w.id);
    } catch { router.push('/login'); }
  }, [router]);

  const fetchOrders = async (workerId: number) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`http://localhost:5000/api/jobs/worker/${workerId}`);
      if (!res.ok) throw new Error('Không thể tải lịch sử đơn hàng');
      const data = await res.json();
      setOrders(data.jobs || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  if (!worker) return null;

  const displayOrders = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);
  const counts = Object.fromEntries(
    Object.keys(STATUS_MAP).map(k => [k, orders.filter(o => o.status === k).length])
  );

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>📋 Lịch sử đơn hàng</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Tất cả đơn hàng của bạn · {orders.length} đơn tổng cộng</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[['ALL', 'Tất cả', orders.length], ...Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label, counts[k] ?? 0])].map(([key, label, count]) => (
          <button key={key as string} onClick={() => setFilterStatus(key as string)}
            style={{ padding: '7px 16px', borderRadius: '20px', border: `1.5px solid ${filterStatus === key ? 'var(--accent-primary)' : 'var(--border-color)'}`, backgroundColor: filterStatus === key ? 'var(--accent-primary)' : 'white', color: filterStatus === key ? 'white' : 'var(--text-secondary)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {label as string} ({count as number})
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải...</div>}
      {error && <div style={{ padding: '16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '12px', fontWeight: '600' }}>⚠️ {error}</div>}

      {!loading && !error && (
        displayOrders.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <h3 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Không có đơn hàng</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Chưa có đơn nào trong mục này</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {displayOrders.map(order => {
              const s = STATUS_MAP[order.status] ?? { bg: '#F3F4F6', color: '#4B5563', label: order.status };
              return (
                <div key={order.id} style={{ backgroundColor: 'white', borderRadius: '18px', padding: '20px 24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '3px' }}>👤 {order.customer_name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📞 {order.customer_phone}</div>
                    </div>
                    <span style={{ backgroundColor: s.bg, color: s.color, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Thời gian</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                        {new Date(order.scheduled_time).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Địa chỉ</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{order.address}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', backgroundColor: '#F9FAFB', padding: '10px 14px', borderRadius: '10px' }}>{order.description}</div>
                  {order.review && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#D97706', marginBottom: '4px' }}>
                        ⭐ Đánh giá: {'★'.repeat(order.review.rating)}{'☆'.repeat(5 - order.review.rating)}
                      </div>
                      {order.review.comment && <div style={{ fontSize: '13px', color: '#92400E' }}>"{order.review.comment}"</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
