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
        setTransactions(data.transactions || []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  if (!worker) return null;

  const STAT_CARDS = stats ? [
    { icon: '💰', label: 'Số dư ví', value: formatVND(stats.balance ?? 0), gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)' },
    { icon: '📈', label: 'Tổng thu nhập', value: formatVND(stats.total_earned ?? 0), gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { icon: '📅', label: 'Tháng này', value: formatVND(stats.this_month_earned ?? 0), gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
    { icon: '🏦', label: 'Hoa hồng (15.5%)', value: formatVND(stats.total_commission ?? 0), gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)' },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>💳 Ví tiền</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Thu nhập và lịch sử giao dịch của bạn</p>
      </div>

      {loading && <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải dữ liệu ví...</div>}
      {error && <div style={{ padding: '16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '12px', fontWeight: '600', marginBottom: '16px' }}>⚠️ {error}</div>}

      {!loading && (
        <>
          {/* Stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {STAT_CARDS.map(card => (
                <div key={card.label} style={{ borderRadius: '18px', background: card.gradient, padding: '22px', color: 'white' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{card.value}</div>
                  <div style={{ fontSize: '13px', opacity: 0.85 }}>{card.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Commission Info */}
          <div style={{ backgroundColor: '#EEF2FF', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>ℹ️</span>
            <div>
              <div style={{ fontWeight: '700', color: '#4338CA', fontSize: '14px', marginBottom: '2px' }}>Chính sách hoa hồng AppTimTho</div>
              <div style={{ fontSize: '13px', color: '#6366F1' }}>Hệ thống giữ lại <strong>15.5%</strong> mỗi đơn hàng. Bạn nhận về <strong>84.5%</strong> giá trị giao dịch.</div>
            </div>
          </div>

          {/* Transactions */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Lịch sử giao dịch</h2>
            </div>
            {transactions.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧾</div>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Chưa có giao dịch nào</p>
              </div>
            ) : (
              transactions.map((tx, i) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: i < transactions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      Đơn #{tx.job_id} {tx.description ? `· ${tx.description}` : ''}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(tx.created_at).toLocaleString('vi-VN')} · Hoa hồng: {formatVND(tx.commission)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#10B981' }}>+{formatVND(tx.net_amount)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tổng: {formatVND(tx.amount)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
