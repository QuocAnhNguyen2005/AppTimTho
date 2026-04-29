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
  // Mock fields for detail
  cancel_reason?: string;
  images?: string[];
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
  
  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Job | null>(null);

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
      
      // Inject some mock data for demonstration purposes
      const mockOrders = (data.jobs || []).map((j: Job) => ({
        ...j,
        cancel_reason: j.status === 'CANCELLED' ? 'Khách đổi ý không muốn sửa nữa' : undefined,
        images: ['https://placehold.co/100x100?text=Loi1', 'https://placehold.co/100x100?text=Loi2']
      }));
      setOrders(mockOrders);
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

  const formatPrice = (price?: number) => {
    if (!price) return 'Theo thỏa thuận';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>📋 Lịch sử đơn hàng</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Sổ sách điện tử quản lý toàn bộ công việc của bạn</p>
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
          <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mã Đơn</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Dịch vụ / Khách hàng</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Thời gian</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Trạng thái</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map(order => {
                  const s = STATUS_MAP[order.status] ?? { bg: '#F3F4F6', color: '#4B5563', label: order.status };
                  return (
                    <tr key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#F9FAFB' } } as any}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', fontWeight: '700', color: '#4338CA' }}>#DH-{order.id.toString().padStart(5, '0')}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{order.description.substring(0, 30)}{order.description.length > 30 ? '...' : ''}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>👤 {order.status === 'CANCELLED' ? order.customer_name[0] + '***' : order.customer_name}</div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {new Date(order.scheduled_time).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ backgroundColor: s.bg, color: s.color, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block' }}>{s.label}</span>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {formatPrice(order.price)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
             onClick={() => setSelectedOrder(null)}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative' }}
               onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              ✕
            </button>
            
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Chi tiết Đơn hàng #DH-{selectedOrder.id.toString().padStart(5, '0')}</h2>
            <div style={{ marginBottom: '24px' }}>
              <StatusBadge status={selectedOrder.status} />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '12px' }}>
                {new Date(selectedOrder.scheduled_time).toLocaleString('vi-VN')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedOrder.status === 'CANCELLED' && selectedOrder.cancel_reason && (
                <div style={{ backgroundColor: '#FEF2F2', padding: '16px', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#DC2626', marginBottom: '4px' }}>Lý do hủy:</div>
                  <div style={{ fontSize: '15px', color: '#991B1B' }}>{selectedOrder.cancel_reason}</div>
                </div>
              )}

              <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Thông tin Khách hàng</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '14px' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Họ tên:</div>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.customer_name}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Điện thoại:</div>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.customer_phone}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Địa chỉ:</div>
                  <div style={{ fontWeight: '600' }}>{selectedOrder.address}</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Mô tả công việc</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                  {selectedOrder.description}
                </p>
              </div>

              {selectedOrder.images && selectedOrder.images.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Hình ảnh đính kèm (Khách chụp)</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedOrder.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Hình lỗi ${idx+1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.review && (
                <div style={{ backgroundColor: '#FFFBEB', padding: '20px', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#D97706' }}>Khách hàng đánh giá</h3>
                  <div style={{ color: '#F59E0B', fontSize: '18px', marginBottom: '8px' }}>
                    {'★'.repeat(selectedOrder.review.rating)}{'☆'.repeat(5 - selectedOrder.review.rating)}
                  </div>
                  <div style={{ fontStyle: 'italic', color: '#92400E', fontSize: '14px' }}>
                    "{selectedOrder.review.comment}"
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '12px 32px', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
