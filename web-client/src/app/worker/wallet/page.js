"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerWalletPage() {
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Withdraw Modal
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankCode, setBankCode] = useState('VCB');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (!saved || role !== 'worker') {
      router.push('/login');
      return;
    }
    const user = JSON.parse(saved);
    setWorker(user);
    fetchFinancialData(user.id);
  }, [router]);

  const fetchFinancialData = async (workerId) => {
    try {
      // Gọi API jobs để tự tính toán doanh thu (vì backend chưa có API chuyên cho wallet timeline)
      const res = await fetch(`http://localhost:5000/api/jobs/worker/${workerId}`);
      if (res.ok) {
        const data = await res.json();
        const completedJobs = (data.jobs || []).filter(j => j.status === 'COMPLETED').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // 1. Tạo dữ liệu Cash Flow
        const flow = [];
        completedJobs.forEach(job => {
          const price = Number(job.total_price);
          const fee = price * 0.155;
          const earn = price - fee;
          flow.push({
            id: job.id + '_earn',
            type: 'EARN',
            amount: earn,
            desc: `Tiền công: ${job.service_name || 'Dịch vụ'}`,
            date: job.updated_at || job.created_at
          });
          // Để minh họa Cash Flow chi tiết, ta có thể tách riêng khoản thu và phí, nhưng gộp lại (thực nhận) sẽ dễ nhìn hơn cho thợ.
          // Ở đây ta hiển thị thực nhận.
        });
        setTransactions(flow);

        // 2. Tạo dữ liệu Biểu đồ 7 ngày
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0,0,0,0);
          last7Days.push({
            date: d,
            label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            total: 0
          });
        }

        completedJobs.forEach(job => {
          const jobDate = new Date(job.updated_at || job.created_at);
          jobDate.setHours(0,0,0,0);
          const price = Number(job.total_price);
          const earn = price - (price * 0.155);

          const dayMatch = last7Days.find(d => d.date.getTime() === jobDate.getTime());
          if (dayMatch) {
            dayMatch.total += earn;
          }
        });

        setChartData(last7Days);
      }
      
      // Update worker balance if there is a specific endpoint, otherwise use localstorage
      const workerRes = await fetch(`http://localhost:5000/api/workers/${workerId}/dashboard-stats`);
      if (workerRes.ok) {
        const wData = await workerRes.json();
        setWorker(prev => ({...prev, balance: wData.worker.balance}));
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (Number(withdrawAmount) > Number(worker.balance)) {
      alert('Số dư không đủ để rút!');
      return;
    }
    if (Number(withdrawAmount) < 100000) {
      alert('Số tiền rút tối thiểu là 100,000đ!');
      return;
    }
    // Mock API Call
    alert('Yêu cầu rút tiền đã được gửi tới Admin. Tiền sẽ về tài khoản trong 24h.');
    setShowWithdraw(false);
    setWithdrawAmount('');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải dữ liệu...</div>;

  // Tính max value cho biểu đồ
  const maxChartValue = Math.max(...chartData.map(d => d.total), 100000); // Tối thiểu cột max là 100k để biểu đồ đỡ bị kịch trần nếu thu nhập thấp

  return (
    <>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '800' }}>Ví & Thu nhập</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Quản lý số dư và đối soát dòng tiền</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px', alignItems: 'start' }}>
          {/* Card Số Dư */}
          <div style={{ backgroundColor: 'white', padding: '32px 24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', opacity: 0.9, marginBottom: '8px' }}>Số dư khả dụng</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>{Number(worker.balance).toLocaleString('vi-VN')} ₫</div>
            
            <button onClick={() => setShowWithdraw(true)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: 'white', color: '#059669', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              Rút Tiền Ngay
            </button>
          </div>

          {/* Biểu đồ 7 ngày (CSS Bar Chart) */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', height: '100%' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '16px', color: 'var(--text-secondary)' }}>Biểu đồ thu nhập (7 ngày qua)</h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              {chartData.map((d, idx) => {
                const heightPercent = (d.total / maxChartValue) * 100;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '100%', height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div 
                        title={`${d.total.toLocaleString('vi-VN')} ₫`}
                        style={{ 
                          width: '80%', height: `${heightPercent}%`, backgroundColor: d.total > 0 ? '#3B82F6' : '#E5E7EB', 
                          borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease',
                          cursor: 'pointer'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              {chartData.map((d, idx) => (
                <div key={idx} style={{ width: '10%', textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sao kê dòng tiền */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800' }}>📄 Sao kê dòng tiền</h3>
          
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Chưa có giao dịch nào</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {transactions.map((tx, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: idx === transactions.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      +
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{tx.desc}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleString('vi-VN')}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#10B981' }}>
                    +{Number(tx.amount).toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '400px', padding: '32px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '22px' }}>Rút tiền về thẻ</h2>
            <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>Số dư khả dụng: {Number(worker.balance).toLocaleString('vi-VN')} ₫</p>
            
            <form onSubmit={handleWithdraw}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Ngân hàng</label>
                <select 
                  value={bankCode} onChange={e => setBankCode(e.target.value)} required
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#F9FAFB' }}
                >
                  <option value="VCB">Vietcombank</option>
                  <option value="MB">MB Bank</option>
                  <option value="TCB">Techcombank</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Số tài khoản</label>
                <input 
                  type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required placeholder="Nhập số tài khoản"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Số tiền cần rút (VND)</label>
                <input 
                  type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required placeholder="Tối thiểu 100,000"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #10B981', outline: 'none', fontSize: '18px', fontWeight: '700' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowWithdraw(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: '700', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#10B981', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Xác nhận rút</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
