"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  job_id: number;
  reply?: string; // Mock field for worker reply
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<string, number>;
}

export default function WorkerReviewsPage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI States
  const [activeTab, setActiveTab] = useState<'REVIEWS' | 'PROFILE'>('REVIEWS');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Mock Profile state
  const [profileData, setProfileData] = useState({
    cccd: '012345678910',
    bankName: 'Vietcombank',
    bankAccount: '1012345678',
    skills: ['Sửa máy lạnh', 'Sửa tủ lạnh', 'Điện nước dân dụng']
  });
  
  const availableSkills = ['Sửa máy lạnh', 'Sửa tủ lạnh', 'Sửa máy giặt', 'Điện nước dân dụng', 'Sơn sửa nhà', 'Thông tắc vệ sinh'];

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try {
      const w = JSON.parse(saved);
      setWorker(w);
      fetchReviews(w.id);
    } catch { router.push('/login'); }
  }, [router]);

  const fetchReviews = async (workerId: number) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workers/${workerId}/reviews`);
      if (!res.ok) throw new Error('Không thể tải đánh giá');
      const data = await res.json();
      
      // Inject some mock replies for UI demonstration
      const mockReviews = (data.reviews || []).map((r: Review, i: number) => ({
        ...r,
        reply: i === 0 ? 'Cảm ơn anh chị đã tin tưởng! Hẹn gặp lại nếu cần hỗ trợ thêm.' : undefined
      }));
      
      setReviews(mockReviews);
      setStats(data.stats || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = (reviewId: number) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, reply: replyText } : r));
    setReplyingTo(null);
    setReplyText('');
    alert('Phản hồi đã được gửi!');
  };

  const handleSkillToggle = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  if (!worker) return null;

  const avgRating = stats?.average_rating ?? 0;

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>⭐ Uy tín & Hồ sơ</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Quản lý thương hiệu cá nhân và thông tin hành nghề</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: '32px', gap: '32px' }}>
        <button onClick={() => setActiveTab('REVIEWS')}
          style={{ padding: '0 0 16px 0', background: 'none', border: 'none', borderBottom: `3px solid ${activeTab === 'REVIEWS' ? 'var(--accent-primary)' : 'transparent'}`, cursor: 'pointer', fontWeight: activeTab === 'REVIEWS' ? '800' : '600', color: activeTab === 'REVIEWS' ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '16px', transition: 'all 0.2s', marginBottom: '-2px' }}>
          Đánh giá từ khách hàng
        </button>
        <button onClick={() => setActiveTab('PROFILE')}
          style={{ padding: '0 0 16px 0', background: 'none', border: 'none', borderBottom: `3px solid ${activeTab === 'PROFILE' ? 'var(--accent-primary)' : 'transparent'}`, cursor: 'pointer', fontWeight: activeTab === 'PROFILE' ? '800' : '600', color: activeTab === 'PROFILE' ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '16px', transition: 'all 0.2s', marginBottom: '-2px' }}>
          Hồ sơ hành nghề
        </button>
      </div>

      {loading && <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</div>}
      {error && <div style={{ padding: '16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '12px', fontWeight: '600', marginBottom: '16px' }}>⚠️ {error}</div>}

      {!loading && !error && activeTab === 'REVIEWS' && (
        <>
          {/* Rating Summary */}
          {stats && (
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)', marginBottom: '32px', display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ textAlign: 'center', minWidth: '150px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Điểm trung bình</div>
                <div style={{ fontSize: '72px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{avgRating.toFixed(1)}<span style={{ fontSize: '24px', color: 'var(--text-secondary)' }}>/5</span></div>
                <div style={{ fontSize: '28px', color: '#F59E0B', margin: '12px 0' }}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>Dựa trên {stats.total_reviews} đánh giá</div>
              </div>
              
              <div style={{ width: '1px', height: '120px', backgroundColor: 'var(--border-color)', display: 'none', '@media (min-width: 768px)': { display: 'block' } } as any} />

              {stats.rating_distribution && (
                <div style={{ flex: 1, minWidth: '250px', borderLeft: '1px solid var(--border-color)', paddingLeft: '48px' }}>
                  <div style={{ marginBottom: '16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Chi tiết đánh giá</div>
                  {[
                    { label: 'Thái độ phục vụ', score: 4.9, pct: 98 },
                    { label: 'Trình độ tay nghề', score: 4.8, pct: 96 },
                    { label: 'Đúng giờ', score: 4.5, pct: 90 },
                  ].map(criterion => {
                    return (
                      <div key={criterion.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ width: '130px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {criterion.label}
                        </div>
                        <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${criterion.pct}%`, backgroundColor: '#10B981', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--text-primary)', width: '30px', textAlign: 'right', fontWeight: '700' }}>{criterion.score}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Review List */}
          {reviews.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
              <h3 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Chưa có đánh giá nào</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Hoàn thành thêm đơn hàng để nhận đánh giá từ khách</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map(review => (
                <div key={review.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
                        {review.customer_name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '2px' }}>{review.customer_name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          Đơn #DH-{review.job_id.toString().padStart(5, '0')} · {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFFBEB', padding: '6px 14px', borderRadius: '20px', border: '1px solid #FDE68A' }}>
                      <span style={{ color: '#F59E0B', fontSize: '16px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                  
                  {review.comment && (
                    <div style={{ fontSize: '15px', color: 'var(--text-primary)', padding: '0 0 16px 60px', lineHeight: '1.6' }}>
                      {review.comment}
                    </div>
                  )}

                  <div style={{ marginLeft: '60px', marginTop: '8px' }}>
                    {review.reply ? (
                      <div style={{ backgroundColor: '#F3F4F6', padding: '16px', borderRadius: '16px', borderLeft: '4px solid #9CA3AF' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#4B5563', marginBottom: '6px', textTransform: 'uppercase' }}>Phản hồi của bạn</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{review.reply}</div>
                      </div>
                    ) : replyingTo === review.id ? (
                      <div style={{ marginTop: '12px' }}>
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Nhập phản hồi cảm ơn khách hàng..."
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '14px', minHeight: '80px', resize: 'vertical', marginBottom: '12px', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                          <button onClick={() => setReplyingTo(null)} style={{ padding: '8px 16px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer' }}>Hủy</button>
                          <button onClick={() => handleReplySubmit(review.id)} style={{ padding: '8px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Gửi phản hồi</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingTo(review.id)} style={{ padding: '8px 16px', backgroundColor: 'white', color: '#4F46E5', border: '1.5px solid #E0E7FF', borderRadius: '20px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        💬 Phản hồi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && activeTab === 'PROFILE' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' } } as any}>
          {/* Info Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>Thông tin pháp lý & Thanh toán</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Số Căn Cước Công Dân (CCCD)</label>
                <input type="text" value={profileData.cccd} readOnly style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '15px', fontWeight: '600' }} />
                <div style={{ fontSize: '12px', color: '#10B981', marginTop: '6px', fontWeight: '600' }}>✓ Đã xác minh</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Ngân hàng nhận tiền</label>
                <input type="text" value={profileData.bankName} readOnly style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '15px', fontWeight: '600' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>Số tài khoản</label>
                <input type="text" value={profileData.bankAccount} readOnly style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', fontSize: '15px', fontWeight: '600' }} />
              </div>

              <div style={{ marginTop: '8px' }}>
                <button style={{ padding: '14px', width: '100%', backgroundColor: 'white', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                  Yêu cầu thay đổi thông tin
                </button>
              </div>
            </div>
          </div>

          {/* Skills Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Chuyên môn hành nghề</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Hệ thống sẽ dựa vào chuyên môn để phân bổ đơn hàng phù hợp cho bạn.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableSkills.map(skill => {
                const isSelected = profileData.skills.includes(skill);
                return (
                  <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', border: `1.5px solid ${isSelected ? '#4F46E5' : 'var(--border-color)'}`, backgroundColor: isSelected ? '#EEF2FF' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${isSelected ? '#4F46E5' : '#D1D5DB'}`, backgroundColor: isSelected ? '#4F46E5' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <span style={{ color: 'white', fontSize: '14px', fontWeight: '900' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: isSelected ? '700' : '500', color: isSelected ? '#3730A3' : 'var(--text-primary)' }}>{skill}</span>
                    <input type="checkbox" checked={isSelected} onChange={() => handleSkillToggle(skill)} style={{ display: 'none' }} />
                  </label>
                );
              })}
            </div>

            <div style={{ marginTop: '24px' }}>
              <button style={{ padding: '14px', width: '100%', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>
                Lưu chuyên môn
              </button>
            </div>
          </div>

          {/* Certificates Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Chứng chỉ chuyên môn (Hồ sơ năng lực)</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Khách hàng sẽ nhìn thấy các bằng cấp này để tăng độ tin tưởng khi thuê bạn.</p>
              </div>
              <button style={{ padding: '8px 16px', backgroundColor: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                + Tải lên chứng chỉ
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {/* Cert 1 */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src="https://placehold.co/100x70?text=CCNA" alt="CCNA" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>Chứng chỉ Mạng CCNA</div>
                  <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>✓ Đã xác thực</div>
                </div>
              </div>

              {/* Cert 2 */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src="https://placehold.co/100x70?text=DienLanh" alt="Điện lạnh" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>Bằng Nghề Điện Lạnh</div>
                  <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>✓ Đã xác thực</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
