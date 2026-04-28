"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerReviewsPage() {
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Update Form State
  const [certName, setCertName] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Giả lập danh sách Tags hay được khách chọn
  const tags = [
    { name: '#Nhiệt_tình', count: 42 },
    { name: '#Đến_đúng_giờ', count: 38 },
    { name: '#Sạch_sẽ', count: 25 },
    { name: '#Chuyên_môn_cao', count: 19 }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (!saved || role !== 'worker') {
      router.push('/login');
      return;
    }
    const user = JSON.parse(saved);
    setWorker(user);
    fetchReviewsAndStats(user.id);
  }, [router]);

  const fetchReviewsAndStats = async (workerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/workers/${workerId}/dashboard-stats`);
      if (res.ok) {
        const data = await res.json();
        // Cập nhật worker state để lấy rating mới nhất
        setWorker(prev => ({...prev, average_rating: data.worker.average_rating, total_reviews: data.worker.total_reviews}));
        // Giả sử API trả về mảng reviews
        setReviews(data.latest_reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!certName) return;
    alert(`Đã gửi yêu cầu thêm chứng chỉ: ${certName}. Admin sẽ duyệt trong 24h.`);
    setCertName('');
  };

  const handleReplySubmit = (e, reviewId) => {
    e.preventDefault();
    if (!replyText) return;
    alert(`Đã gửi phản hồi thành công!`);
    
    // Optimistic Update: Thêm phản hồi vào UI
    const updatedReviews = reviews.map(r => {
      if (r.id === reviewId || r.customer_name === replyingTo.customer_name) {
        return { ...r, reply: replyText };
      }
      return r;
    });
    setReviews(updatedReviews);
    setReplyingTo(null);
    setReplyText('');
  };

  if (loading || !worker) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải dữ liệu...</div>;

  // Tính toán giả lập cho phân bổ sao
  const total = worker.total_reviews || 1;
  const starDist = [
    { stars: 5, pct: 85 },
    { stars: 4, pct: 10 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/worker/dashboard')} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            ←
          </button>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '800' }}>Uy tín & Hồ sơ</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Lắng nghe khách hàng và nâng cấp kỹ năng</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Cột 1: Tổng quan Đánh giá */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800' }}>⭐ Tổng quan Đánh giá</h3>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#F59E0B', lineHeight: '1' }}>{worker.average_rating || '0.0'}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>{worker.total_reviews} đánh giá</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {starDist.map(item => (
                  <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ width: '12px' }}>{item.stars}</span>
                    <span style={{ color: '#F59E0B' }}>★</span>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', backgroundColor: '#F59E0B' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight Tags */}
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text-secondary)' }}>Khách hàng thường nhận xét:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map(tag => (
                <span key={tag.name} style={{ padding: '6px 12px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                  {tag.name} ({tag.count})
                </span>
              ))}
            </div>
          </div>

          {/* Cột 2: Cập nhật Hồ sơ */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800' }}>🎓 Cập nhật Hồ sơ nghề</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Thêm chứng chỉ hoặc kỹ năng mới để mở rộng tệp khách hàng và tăng độ uy tín.</p>
            
            <form onSubmit={handleAddCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <input 
                type="text" value={certName} onChange={e => setCertName(e.target.value)}
                placeholder="VD: Chứng chỉ An toàn Điện bậc 3"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontWeight: '700', cursor: 'pointer', marginTop: 'auto' }}>
                Gửi duyệt chứng chỉ
              </button>
            </form>
          </div>

        </div>

        {/* Danh sách bình luận */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '800' }}>💬 Chi tiết Đánh giá ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Chưa có bình luận nào từ khách hàng.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map((rev, idx) => (
                <div key={idx} style={{ paddingBottom: '20px', borderBottom: idx === reviews.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '15px' }}>{rev.customer_name}</strong>
                      <span style={{ marginLeft: '12px', color: '#F59E0B', fontSize: '14px' }}>{'⭐'.repeat(rev.rating)}</span>
                    </div>
                    {/* Nút Phản hồi */}
                    {!rev.reply && (
                      <span onClick={() => setReplyingTo(rev)} style={{ fontSize: '13px', color: '#2563EB', fontWeight: '600', cursor: 'pointer' }}>Phản hồi</span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>"{rev.comment || 'Không có bình luận'}"</p>
                  
                  {/* Nếu thợ đã phản hồi */}
                  {rev.reply && (
                    <div style={{ backgroundColor: '#F9FAFB', padding: '12px 16px', borderRadius: '12px', marginLeft: '24px', borderLeft: '4px solid #D1FAE5' }}>
                      <strong style={{ fontSize: '13px', color: '#059669', display: 'block', marginBottom: '4px' }}>Phản hồi của bạn:</strong>
                      <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{rev.reply}</span>
                    </div>
                  )}

                  {/* Form nhập phản hồi */}
                  {replyingTo && replyingTo.customer_name === rev.customer_name && (
                    <form onSubmit={(e) => handleReplySubmit(e, rev.id)} style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" value={replyText} onChange={e => setReplyText(e.target.value)} autoFocus
                        placeholder="Nhập lời cảm ơn hoặc phản hồi..."
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '14px' }}
                      />
                      <button type="submit" style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Gửi</button>
                      <button type="button" onClick={() => setReplyingTo(null)} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#F3F4F6', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer' }}>Hủy</button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
