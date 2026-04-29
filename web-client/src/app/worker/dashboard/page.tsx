"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ─── Types ─────────────────────────────────────────────────── */
interface Job {
  id: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  description: string;
  scheduled_time: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  price?: number;
  created_at: string;
}

interface Stats {
  total_jobs: number;
  completed_jobs: number;
  total_earned: number;
  average_rating: number;
}

/* ─── Status badge ───────────────────────────────────────────── */
const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: '#FEF3C7', color: '#D97706', label: '⏳ Chờ xác nhận' },
  ACCEPTED:  { bg: '#DBEAFE', color: '#2563EB', label: '✅ Đã nhận' },
  COMPLETED: { bg: '#D1FAE5', color: '#059669', label: '🎉 Hoàn thành' },
  CANCELLED: { bg: '#FEE2E2', color: '#DC2626', label: '❌ Đã huỷ' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { bg: '#F3F4F6', color: '#4B5563', label: status };
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, gradient }: {
  icon: string; label: string; value: string | number; sub: string; gradient: string;
}) {
  return (
    <div style={{ borderRadius: '20px', background: gradient, padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '32px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: '12px', opacity: 0.75 }}>{sub}</div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function WorkerDashboard() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACCEPTED' | 'ALL'>('PENDING');
  
  // New states for UI enhancement
  const [isOnline, setIsOnline] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown mock for pending jobs

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try {
      const w = JSON.parse(saved);
      setWorker(w);
      fetchData(w.id);
    } catch { router.push('/login'); }
  }, [router]);

  useEffect(() => {
    // Countdown timer for pending jobs
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async (workerId: number) => {
    setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/jobs/worker/${workerId}`),
        fetch(`http://localhost:5000/api/workers/${workerId}/stats`),
      ]);
      const jobsData = jobsRes.ok ? await jobsRes.json() : { jobs: [] };
      const statsData = statsRes.ok ? await statsRes.json() : null;
      setJobs(jobsData.jobs || []);
      setStats(statsData?.stats || null);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId: number, action: 'accept' | 'reject' | 'complete') => {
    setActionLoading(jobId);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: worker?.id }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as any).error || `Không thể ${action} đơn hàng`);
      }
      fetchData(worker.id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setActionLoading(null);
    }
  };

  if (!worker) return null;

  const filteredJobs = jobs.filter(j => activeTab === 'ALL' ? true : j.status === activeTab);
  const pendingCount = jobs.filter(j => j.status === 'PENDING').length;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Top Bar / Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: '20px', padding: '28px 32px', marginBottom: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative' }}>
        <div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Xin chào, 👋</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>{worker.full_name}</h1>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>
            {pendingCount > 0
              ? <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>🔔 Bạn có {pendingCount} đơn đang chờ!</span>
              : 'Hôm nay chưa có đơn mới'}
          </div>
        </div>
        
        {/* Toggle Online/Offline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px 20px', borderRadius: '16px' }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>{isOnline ? 'Đang nhận cuốc' : 'Đang nghỉ ngơi'}</span>
          <div 
            onClick={() => setIsOnline(!isOnline)}
            style={{ 
              width: '50px', height: '28px', backgroundColor: isOnline ? '#10B981' : '#9CA3AF', 
              borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            <div style={{
              width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%',
              position: 'absolute', top: '3px', left: isOnline ? '25px' : '3px', transition: 'all 0.3s'
            }} />
          </div>
        </div>
      </div>

      {!isOnline && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '16px 24px', borderRadius: '16px', marginBottom: '28px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          Bạn đang ngoại tuyến. Khách hàng sẽ không tìm thấy bạn trên hệ thống. Hãy bật "Nhận cuốc" để tiếp tục làm việc.
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard icon="📋" label="Tổng đơn hàng" value={stats.total_jobs} sub="Kể từ khi tham gia" gradient="linear-gradient(135deg, #4F46E5, #7C3AED)" />
          <StatCard icon="✅" label="Hoàn thành" value={stats.completed_jobs} sub={`Tỷ lệ ${stats.total_jobs ? Math.round(stats.completed_jobs / stats.total_jobs * 100) : 0}%`} gradient="linear-gradient(135deg, #10B981, #059669)" />
          <StatCard icon="⭐" label="Đánh giá" value={stats.average_rating?.toFixed(1) ?? 'N/A'} sub="Điểm trung bình" gradient="linear-gradient(135deg, #F59E0B, #D97706)" />
          <StatCard icon="💰" label="Thu nhập" value={`${((stats.total_earned ?? 0) / 1000).toFixed(0)}K ₫`} sub="Sau hoa hồng 15.5%" gradient="linear-gradient(135deg, #0EA5E9, #4F46E5)" />
        </div>
      )}

      {/* Job List */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 24px', overflowX: 'auto' }}>
          {([['PENDING', `Chờ duyệt ${pendingCount > 0 ? `(${pendingCount})` : ''}`], ['ACCEPTED', 'Đã nhận'], ['ALL', 'Tất cả']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '16px 20px', background: 'none', border: 'none', borderBottom: `3px solid ${activeTab === tab ? 'var(--accent-primary)' : 'transparent'}`, cursor: 'pointer', fontWeight: activeTab === tab ? '700' : '500', color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '14px', whiteSpace: 'nowrap' }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải...</div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Không có đơn nào trong mục này</p>
          </div>
        ) : (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredJobs.map((job) => (
              <div key={job.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                border: job.status === 'PENDING' ? '2px solid #FEF08A' : '1px solid var(--border-color)', 
                boxShadow: job.status === 'PENDING' ? '0 4px 12px rgba(250, 204, 21, 0.15)' : 'var(--shadow-sm)',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {job.status === 'PENDING' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: `${(timeLeft / 300) * 100}%`, backgroundColor: '#F59E0B', transition: 'width 1s linear' }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <StatusBadge status={job.status} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {new Date(job.scheduled_time).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {job.status === 'PENDING' && (
                        <span style={{ fontSize: '12px', color: '#D97706', fontWeight: '700', backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '8px' }}>
                          ⏳ Tự hủy sau: {formatTime(timeLeft)}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {job.description}
                    </div>
                    
                    {job.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📍 Cách bạn: <strong>~2.5 km</strong> (Ước tính)</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>💰 Tiền công: <strong>Theo thỏa thuận</strong></span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>👤 Khách hàng: {job.customer_name}</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>📞 Số điện thoại: <strong>{job.customer_phone}</strong></div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>📍 Địa chỉ: <strong>{job.address}</strong></div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: job.status === 'PENDING' ? 'row' : 'column', gap: '10px', width: job.status === 'PENDING' ? '100%' : 'auto', minWidth: '160px', marginTop: job.status === 'PENDING' ? '12px' : '0' }}>
                    {job.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleJobAction(job.id, 'accept')} disabled={actionLoading === job.id}
                          style={{ flex: 1, padding: '14px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', opacity: actionLoading === job.id ? 0.7 : 1, transition: 'background-color 0.2s', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                          {actionLoading === job.id ? 'Đang xử lý...' : '✅ NHẬN ĐƠN NGAY'}
                        </button>
                        <button onClick={() => handleJobAction(job.id, 'reject')} disabled={actionLoading === job.id}
                          style={{ padding: '14px 24px', backgroundColor: '#F3F4F6', color: '#4B5563', border: '1px solid #D1D5DB', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                          Từ chối
                        </button>
                      </>
                    )}
                    {job.status === 'ACCEPTED' && (
                      <>
                        <button onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`, '_blank')}
                          style={{ padding: '10px 16px', backgroundColor: '#E0E7FF', color: '#4338CA', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          🗺️ Chỉ đường
                        </button>
                        <button onClick={() => window.location.href = `tel:${job.customer_phone}`}
                          style={{ padding: '10px 16px', backgroundColor: '#DCFCE7', color: '#166534', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          📞 Gọi điện
                        </button>
                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                        <button onClick={() => handleJobAction(job.id, 'complete')} disabled={actionLoading === job.id}
                          style={{ padding: '10px 16px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', opacity: actionLoading === job.id ? 0.7 : 1 }}>
                          {actionLoading === job.id ? '...' : '🎉 Hoàn thành'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
