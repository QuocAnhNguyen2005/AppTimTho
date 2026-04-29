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

  // Mock chart data for 7 days
  const mockChartData = [
    { day: 'T2', value: 150000, height: '30%' },
    { day: 'T3', value: 300000, height: '60%' },
    { day: 'T4', value: 50000,  height: '10%' },
    { day: 'T5', value: 450000, height: '90%' },
    { day: 'T6', value: 200000, height: '40%' },
    { day: 'T7', value: 600000, height: '100%' },
    { day: 'CN', value: 400000, height: '80%' },
  ];

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
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>Tổng thu nhập tháng này</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{formatVND(stats.this_month_earned ?? 0)}</div>
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>Tổng đã nộp nền tảng</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{formatVND(stats.total_commission ?? 0)}</div>
              </div>
            </div>

            {/* CSS Chart */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Thu nhập 7 ngày qua</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px', width: '100%', paddingBottom: '20px', borderBottom: '1px dashed #E5E7EB', position: 'relative' }}>
                {mockChartData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }} className="chart-bar-group">
                    {/* Tooltip (pseudo) */}
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#6B7280', marginBottom: '4px' }}>{(d.value/1000).toFixed(0)}k</div>
                    
                    {/* Bar */}
                    <div style={{ width: '100%', maxWidth: '30px', height: d.height, backgroundColor: i === 5 ? '#4F46E5' : '#C7D2FE', borderRadius: '4px 4px 0 0', transition: 'height 0.5s' }} />
                    
                    {/* Label */}
                    <div style={{ position: 'absolute', bottom: '-24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      {!loading && (
        <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: '#F9FAFB' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Lịch sử dòng tiền</h2>
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
