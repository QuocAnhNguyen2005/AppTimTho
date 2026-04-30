"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: number;
  job_id: number;
  amount: number;
  commission: number;
  net_amount: number;
  type: string;
  created_at: string;
  description?: string;
  // MOCK field for display purposes: IN for positive, OUT for withdrawal/negative
  flow_type?: 'IN' | 'OUT'; 
}

interface WalletStats {
  balance: number;
  total_earned: number;
  total_commission: number;
  this_month_earned: number;
}

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function WorkerWalletPage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock chart data for weeks
  const mockChartData = [
    { week: 'Tuần 1', value: 1500000, y: 80 },
    { week: 'Tuần 2', value: 3000000, y: 40 },
    { week: 'Tuần 3', value: 2500000, y: 50 },
    { week: 'Tuần 4', value: 4500000, y: 10 },
  ];

  const [filterWeek, setFilterWeek] = useState<string | null>(null);

  const handleChartClick = (week: string) => {
    setFilterWeek(week === filterWeek ? null : week);
    // Scroll to transactions
    document.getElementById('tx-history')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try {
      const w = JSON.parse(saved);
      setWorker(w);
      fetchWallet(w.id);
    } catch { router.push('/login'); }
  }, [router]);

  const fetchWallet = async (workerId: number) => {
    try {
      setLoading(true);
      setError('');
      const [walletRes, txRes] = await Promise.all([
        fetch(`http://localhost:5000/api/workers/${workerId}/wallet`),
        fetch(`http://localhost:5000/api/workers/${workerId}/transactions`),
      ]);
      if (walletRes.ok) {
        const data = await walletRes.json();
        setStats(data.wallet || data);
      }
      if (txRes.ok) {
        const data = await txRes.json();
        const txs = data.transactions || [];
        // Inject mock withdrawal transaction for demonstration
        txs.unshift({
          id: 9999, job_id: 0, amount: 1000000, commission: 0, net_amount: 1000000, 
          type: 'WITHDRAWAL', created_at: new Date().toISOString(), description: 'Rút tiền về Vietcombank (Đang xử lý)', flow_type: 'OUT'
        });
        
        const mappedTxs = txs.map((tx: any) => ({
          ...tx,
          flow_type: tx.type === 'WITHDRAWAL' ? 'OUT' : 'IN'
        }));
        setTransactions(mappedTxs);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  if (!worker) return null;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>💳 Ví tiền & Thu nhập</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Minh bạch tài chính và kiểm soát dòng tiền của bạn</p>
      </div>

      {/* Commission Info */}
      <div style={{ backgroundColor: '#EEF2FF', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>ℹ️</span>
        <div>
          <div style={{ fontWeight: '700', color: '#4338CA', fontSize: '14px', marginBottom: '2px' }}>Chính sách hoa hồng Nền tảng</div>
          <div style={{ fontSize: '13px', color: '#6366F1' }}>Hệ thống giữ lại <strong>15.5%</strong> phí duy trì mỗi đơn hàng. Bạn nhận về <strong>84.5%</strong> giá trị giao dịch.</div>
        </div>
      </div>

      {loading && <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải dữ liệu ví...</div>}
      {error && <div style={{ padding: '16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '12px', fontWeight: '600', marginBottom: '16px' }}>⚠️ {error}</div>}

      {!loading && stats && (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
          
          {/* Main Balance Block */}
          <div style={{ flex: '1 1 350px', background: 'linear-gradient(135deg, #111827 0%, #374151 100%)', borderRadius: '24px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-40px', right: '40px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#D1D5DB', marginBottom: '8px' }}>Số dư khả dụng</div>
              <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-1px' }}>
                {formatVND(stats.balance ?? 0)}
              </div>
              <button style={{ backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 24px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s', width: '100%', justifyContent: 'center' }}
                onClick={() => alert('Tính năng rút tiền đang được phát triển!')}
              >
                <span>🏦</span> Yêu cầu Rút tiền
              </button>
            </div>
          </div>

          {/* Sub Stats & Chart */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>Ví tín dụng (Trừ phí 15.5%)</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#DC2626' }}>{formatVND(500000)}</div>
                <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px', cursor: 'pointer' }}>+ Nạp thêm tiền ảo</div>
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>Tiền mặt thực nhận</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#10B981' }}>{formatVND(stats.this_month_earned ?? 0)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Khách trả trực tiếp</div>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Biến động thu nhập tháng này</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '140px', width: '100%', position: 'relative' }}>
                <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <polyline 
                    points="0,140 16,112 50,56 83,70 116,14" 
                    fill="none" stroke="#4F46E5" strokeWidth="3" 
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Fill area */}
                  <polygon 
                    points="0,140 16,112 50,56 83,70 116,14 116,140" 
                    fill="url(#grad)" opacity="0.2" vectorEffect="non-scaling-stroke"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative', zIndex: 1, justifyContent: 'space-between' }}>
                  <div style={{ width: '0' }}></div>
                  {mockChartData.map((d, i) => (
                    <div key={i} 
                      onClick={() => handleChartClick(d.week)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', position: 'relative', cursor: 'pointer' }}>
                      
                      {/* Chart Point */}
                      <div style={{ position: 'absolute', top: `${d.y}%`, width: '12px', height: '12px', backgroundColor: filterWeek === d.week ? '#10B981' : '#4F46E5', borderRadius: '50%', border: '2px solid white', transform: 'translateY(-50%)', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 2 }} />
                      
                      {/* Tooltip */}
                      <div style={{ position: 'absolute', top: `calc(${d.y}% - 25px)`, fontSize: '11px', fontWeight: '700', color: filterWeek === d.week ? '#10B981' : '#6B7280', whiteSpace: 'nowrap', backgroundColor: 'white', padding: '2px 6px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        {(d.value/1000000).toFixed(1)}M
                      </div>
                      
                      {/* Label */}
                      <div style={{ position: 'absolute', bottom: '0', fontSize: '12px', fontWeight: filterWeek === d.week ? '800' : '600', color: filterWeek === d.week ? '#10B981' : 'var(--text-secondary)' }}>
                        {d.week}
                      </div>
                    </div>
                  ))}
                  <div style={{ width: '0' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      {!loading && (
        <div id="tx-history" style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
              Lịch sử dòng tiền {filterWeek && <span style={{ color: '#10B981' }}>- Lọc theo {filterWeek}</span>}
            </h2>
            {filterWeek && (
              <button onClick={() => setFilterWeek(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>Bỏ lọc</button>
            )}
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧾</div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Chưa có giao dịch nào</p>
            </div>
          ) : (
            transactions.map((tx, i) => {
              const isOut = tx.flow_type === 'OUT';
              return (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: i < transactions.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#F9FAFB' } } as any}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: isOut ? '#FEF2F2' : '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {isOut ? '📤' : '📥'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {isOut ? 'Rút tiền' : `Thanh toán đơn #DH-${tx.job_id.toString().padStart(5, '0')}`}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {new Date(tx.created_at).toLocaleString('vi-VN')}
                        {tx.description && <span style={{ marginLeft: '6px', color: isOut ? '#D97706' : 'var(--text-secondary)' }}>({tx.description})</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: isOut ? '#EF4444' : '#10B981', marginBottom: '4px' }}>
                      {isOut ? '-' : '+'}{formatVND(tx.net_amount)}
                    </div>
                    {!isOut && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Khách trả: {formatVND(tx.amount)} <br/> Phí: -{formatVND(tx.commission)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
