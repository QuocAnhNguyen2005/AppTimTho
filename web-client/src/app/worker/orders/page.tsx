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

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (workerId: number, pageNum: number = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      setError('');
      // Simulate API pagination: In a real app we pass ?page=${pageNum}&limit=10
      const res = await fetch(`http://localhost:5000/api/jobs/worker/${workerId}`);
      if (!res.ok) throw new Error('Không thể tải lịch sử đơn hàng');
      const data = await res.json();
      
      const allOrders = data.jobs || [];
      // Simulate pagination logic
      const limit = 10;
      const startIndex = (pageNum - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = allOrders.slice(startIndex, endIndex);

      const mockOrders = paginatedOrders.map((j: Job) => ({
        ...j,
        cancel_reason: j.status === 'CANCELLED' ? 'Khách đổi ý không muốn sửa nữa' : undefined,
        images: ['https://placehold.co/100x100?text=Truoc_khi_sua', 'https://placehold.co/100x100?text=Sau_khi_sua']
      }));

      if (isLoadMore) {
        setOrders(prev => [...prev, ...mockOrders]);
      } else {
        setOrders(mockOrders);
      }

      setHasMore(endIndex < allOrders.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (!loading && hasMore && worker) {
          setPage(p => {
            const next = p + 1;
            fetchOrders(worker.id, next, true);
            return next;
          });
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, worker]);

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {displayOrders.map(order => {
              const s = STATUS_MAP[order.status] ?? { bg: '#F3F4F6', color: '#4B5563', label: order.status };
              return (
                <div key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '20px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>{s.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{new Date(order.scheduled_time).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                    {order.description}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>👤 Khách hàng: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{order.status === 'CANCELLED' ? order.customer_name[0] + '***' : order.customer_name}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📍 Quãng đường: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>~2.5 km</span></div>
                  </div>
                  
                  <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>#DH-{order.id.toString().padStart(5, '0')}</span>
                    <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--accent-primary)' }}>{formatPrice(order.price)}</span>
                  </div>
                </div>
              );
            })}
            {loading && <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '20px', color: 'var(--text-secondary)' }}>Đang tải thêm...</div>}
            {!hasMore && displayOrders.length > 0 && <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '20px', color: 'var(--text-secondary)' }}>Hết danh sách</div>}
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

              {/* Timeline / Gantt Chart */}
              <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>Tiến trình thực thi (Gantt/Timeline)</h3>
                <div style={{ position: 'relative', borderLeft: '2px solid #E5E7EB', marginLeft: '12px', paddingBottom: '10px' }}>
                  
                  {/* Step 1 */}
                  <div style={{ position: 'relative', paddingLeft: '24px', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', left: '-7px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid white' }} />
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>14:00</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Khách đặt lịch</div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ position: 'relative', paddingLeft: '24px', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', left: '-7px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid white' }} />
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>14:05</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Thợ nhận đơn</div>
                  </div>

                  {/* Step 3 */}
                  <div style={{ position: 'relative', paddingLeft: '24px', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', left: '-7px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: ['COMPLETED', 'CANCELLED'].includes(selectedOrder.status) ? '#10B981' : '#D1D5DB', border: '2px solid white' }} />
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>14:30</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Check-in tại nhà khách</div>
                  </div>

                  {/* Step 4 */}
                  <div style={{ position: 'relative', paddingLeft: '24px' }}>
                    <div style={{ position: 'absolute', left: '-7px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedOrder.status === 'COMPLETED' ? '#10B981' : '#D1D5DB', border: '2px solid white' }} />
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>15:45</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Hoàn thành công việc</div>
                  </div>
                  
                </div>
              </div>

              {selectedOrder.images && selectedOrder.images.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Hình ảnh bằng chứng (Trước và Sau)</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {selectedOrder.images.map((img, idx) => (
                      <div key={idx} style={{ flex: 1, minWidth: '120px', maxWidth: '200px' }}>
                        <img src={img} alt={`Bằng chứng ${idx+1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} />
                        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', marginTop: '8px', color: 'var(--text-secondary)' }}>
                          {idx === 0 ? 'Trước khi sửa' : 'Sau khi sửa'}
                        </div>
                      </div>
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
