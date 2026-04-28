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
      const res = await fetch(`http://localhost:5000/api/workers/${workerId}/reviews`);
      if (!res.ok) throw new Error('Không thể tải đánh giá');
      const data = await res.json();
      setReviews(data.reviews || []);
      setStats(data.stats || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  if (!worker) return null;

  const avgRating = stats?.average_rating ?? 0;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>⭐ Đánh giá từ khách</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Phản hồi thực tế từ những khách hàng đã sử dụng dịch vụ của bạn</p>
      </div>

      {loading && <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải đánh giá...</div>}
      {error && <div style={{ padding: '16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '12px', fontWeight: '600', marginBottom: '16px' }}>⚠️ {error}</div>}

      {!loading && !error && (
        <>
          {/* Rating Summary */}
          {stats && (
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '56px', fontWeight: '800', color: 'var(--accent-primary)', lineHeight: 1 }}>{avgRating.toFixed(1)}</div>
                <div style={{ fontSize: '24px', color: '#F59E0B', margin: '6px 0' }}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stats.total_reviews} đánh giá</div>
              </div>
              {stats.rating_distribution && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = stats.rating_distribution[star] ?? 0;
                    const pct = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '16px', textAlign: 'right' }}>{star}</span>
                        <span style={{ color: '#F59E0B', fontSize: '12px' }}>★</span>
                        <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#F59E0B', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', width: '20px' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Review List */}
          {reviews.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
              <h3 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Chưa có đánh giá nào</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Hoàn thành thêm đơn hàng để nhận đánh giá từ khách</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reviews.map(review => (
                <div key={review.id} style={{ backgroundColor: 'white', borderRadius: '18px', padding: '20px 24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>👤 {review.customer_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Đơn #{review.job_id} · {new Date(review.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFFBEB', padding: '6px 14px', borderRadius: '20px', border: '1px solid #FDE68A' }}>
                      <span style={{ color: '#F59E0B', fontSize: '14px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span style={{ fontWeight: '700', color: '#D97706', fontSize: '14px' }}>{review.rating}.0</span>
                    </div>
                  </div>
                  {review.comment && (
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', backgroundColor: '#F9FAFB', padding: '12px 16px', borderRadius: '10px', lineHeight: '1.6' }}>
                      "{review.comment}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
