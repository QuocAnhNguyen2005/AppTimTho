"use client";

/**
 * @file page.js — Trang Kết Quả Tìm Kiếm
 * @route /search?q=<keyword>&min_rating=<value>&max_price=<value>
 *
 * Bố cục:
 *  - Header (tái sử dụng logic từ customer page)
 *  - Sidebar bộ lọc (Filter): rating, khoảng cách, giá
 *  - Main content: Grid các thẻ thợ từ API
 */

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SPECIALTY_ICONS = {
  'Sửa điều hòa':          '❄️',
  'Điện lạnh':              '❄️',
  'Sửa ống nước':           '🚰',
  'Ống nước':               '🚰',
  'Chống thấm':             '🌊',
  'Sửa điện':               '⚡',
  'Lắp đặt điện':           '⚡',
  'Sửa điện tử':            '🖥️',
  'Sửa PC':                 '💻',
  'Vệ sinh':                '🧹',
  'Sửa khóa':               '🔒',
  'Cửa cuốn':               '🚪',
  'Thợ mộc':                '🪵',
  'Nội thất':               '🛋️',
  'Sơn nhà':                '🎨',
  'Máy giặt':               '🫧',
  'Tủ lạnh':                '🧊',
  'Camera an ninh':         '📷',
};

function getIcon(specialties = []) {
  for (const s of specialties) {
    for (const [key, icon] of Object.entries(SPECIALTY_ICONS)) {
      if (s.toLowerCase().includes(key.toLowerCase())) return icon;
    }
  }
  return '🔧';
}

// ── Filter Sidebar ────────────────────────────────────────────
function FilterSidebar({ filters, onChange }) {
  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  };

  const sectionStyle = {
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
  };

  const ratingOptions = [
    { value: '', label: 'Tất cả' },
    { value: '4.5', label: '⭐ 4.5 trở lên' },
    { value: '4', label: '⭐ 4.0 trở lên' },
    { value: '3', label: '⭐ 3.0 trở lên' },
  ];

  const verifiedOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'true', label: '✓ Đã xác minh' },
  ];

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      padding: '20px',
      height: 'fit-content',
      position: 'sticky',
      top: '90px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>🎛️ Bộ lọc</h3>
        <button
          onClick={() => onChange({ min_rating: '', verified_only: '', sort: 'default' })}
          style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
          Xóa lọc
        </button>
      </div>

      {/* Rating */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Số sao đánh giá</span>
        {ratingOptions.map(opt => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="min_rating"
              value={opt.value}
              checked={filters.min_rating === opt.value}
              onChange={() => onChange({ ...filters, min_rating: opt.value })}
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: filters.min_rating === opt.value ? '700' : '400' }}>{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Xác minh */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Trạng thái thợ</span>
        {verifiedOptions.map(opt => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="verified"
              value={opt.value}
              checked={filters.verified_only === opt.value}
              onChange={() => onChange({ ...filters, verified_only: opt.value })}
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: filters.verified_only === opt.value ? '700' : '400' }}>{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Sắp xếp */}
      <div>
        <span style={labelStyle}>Sắp xếp theo</span>
        {[
          { value: 'default',  label: '🏆 Phù hợp nhất' },
          { value: 'rating',   label: '⭐ Đánh giá cao nhất' },
          { value: 'reviews',  label: '📋 Nhiều đơn nhất' },
          { value: 'newest',   label: '🕒 Mới tham gia nhất' },
        ].map(opt => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="sort"
              value={opt.value}
              checked={filters.sort === opt.value}
              onChange={() => onChange({ ...filters, sort: opt.value })}
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: filters.sort === opt.value ? '700' : '400' }}>{opt.label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}

// ── Worker Card ───────────────────────────────────────────────
function WorkerCard({ worker }) {
  const [hovered, setHovered] = useState(false);
  const icon = getIcon(worker.specialties || []);
  const rating = parseFloat(worker.average_rating) || 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        border: `1.5px solid ${hovered ? 'var(--accent-primary)' : 'var(--border-color)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 30px rgba(79,70,229,0.15)' : 'var(--shadow-sm)',
      }}>

      {/* Avatar */}
      <div style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          backgroundColor: 'white', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '36px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {worker.avatar_url ? (
            <img src={worker.avatar_url} alt={worker.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : icon}
        </div>
        {worker.is_verified && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            backgroundColor: 'var(--accent-primary)', color: 'white',
            fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px',
          }}>✓ ĐÃ XM</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
          {worker.full_name}
        </div>

        {/* Specialties */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
          {(worker.specialties || []).slice(0, 2).map(s => (
            <span key={s} style={{
              fontSize: '10px', fontWeight: '600',
              backgroundColor: '#EEF2FF', color: 'var(--accent-primary)',
              padding: '2px 8px', borderRadius: '20px',
            }}>{s}</span>
          ))}
          {(worker.specialties || []).length > 2 && (
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '2px 0' }}>
              +{(worker.specialties || []).length - 2}
            </span>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {[1,2,3,4,5].map(star => (
              <span key={star} style={{ color: star <= Math.round(rating) ? '#F59E0B' : '#E2E8F0', fontSize: '12px' }}>★</span>
            ))}
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginLeft: '3px' }}>
              {rating.toFixed(1)}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {worker.total_reviews} đơn
          </span>
        </div>

        {/* Districts */}
        {(worker.districts_active || []).length > 0 && (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            📍 {(worker.districts_active || []).slice(0, 2).join(', ')}
            {(worker.districts_active || []).length > 2 && '...'}
          </div>
        )}

        {/* Experience */}
        {worker.experience_years && (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            💼 {worker.experience_years} năm kinh nghiệm
          </div>
        )}

        <button
          style={{
            width: '100%', padding: '9px',
            backgroundColor: hovered ? 'var(--accent-hover)' : 'var(--accent-primary)',
            color: 'white', border: 'none', borderRadius: '8px',
            fontWeight: '700', fontSize: '13px', cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}>
          Đặt ngay
        </button>
      </div>
    </div>
  );
}

// ── Skeleton Loader ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
    }}>
      <div style={{ background: '#EEF2FF', height: '130px' }} />
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ height: '16px', background: 'var(--bg-hover)', borderRadius: '6px', marginBottom: '8px', width: '70%' }} />
        <div style={{ height: '12px', background: 'var(--bg-hover)', borderRadius: '6px', marginBottom: '12px', width: '50%' }} />
        <div style={{ height: '10px', background: 'var(--bg-hover)', borderRadius: '6px', marginBottom: '12px', width: '85%' }} />
        <div style={{ height: '36px', background: 'var(--bg-hover)', borderRadius: '8px' }} />
      </div>
    </div>
  );
}

// ── Main Content ─────────────────────────────────────────────────
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState(initialQ);
  const [workers, setWorkers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [filters, setFilters] = useState({
    min_rating: '',
    verified_only: '',
    sort: 'default',
  });

  // Auth check
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try { setUser(JSON.parse(saved)); } catch { router.push('/login'); }
  }, [router]);

  // Fetch workers từ API
  const fetchWorkers = useCallback(async (q, f) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (f.min_rating) params.set('min_rating', f.min_rating);
      params.set('limit', '24');

      const res = await fetch(`http://localhost:5001/api/workers/search?${params.toString()}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      let result = data.workers || [];

      // Filter bổ sung phía client
      if (f.verified_only === 'true') {
        result = result.filter(w => w.is_verified);
      }

      // Sort phía client
      if (f.sort === 'rating') {
        result = [...result].sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating));
      } else if (f.sort === 'reviews') {
        result = [...result].sort((a, b) => b.total_reviews - a.total_reviews);
      } else if (f.sort === 'newest') {
        result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      setWorkers(result);
      setTotal(data.total || result.length);
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
      setWorkers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chạy khi q hoặc filter thay đổi
  useEffect(() => {
    fetchWorkers(initialQ, filters);
  }, [initialQ, filters, fetchWorkers]);

  // Xử lý submit tìm kiếm
  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchInput.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }}>⚙️</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', fontFamily: 'Outfit, sans-serif' }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ backgroundColor: 'var(--accent-primary)', padding: '5px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            {['Thông báo', 'Hỗ trợ', 'Về chúng tôi'].map(item => (
              <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '500' }}>{item}</a>
            ))}
          </div>
        </div>

        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '12px 24px' }}>
          {/* Logo */}
          <div
            style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
            onClick={() => router.push('/customer')}>
            App<span style={{ color: 'var(--text-primary)' }}>TimTho</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: '680px' }}>
            <input
              id="search-input"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm thợ sửa điện, điều hòa, ống nước..."
              style={{
                flex: 1, padding: '10px 18px',
                border: '2px solid var(--accent-primary)', borderRight: 'none',
                borderRadius: '8px 0 0 8px', fontSize: '14px', outline: 'none',
                backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px', backgroundColor: 'var(--accent-primary)',
                color: 'white', border: 'none', borderRadius: '0 8px 8px 0',
                cursor: 'pointer', fontWeight: '700', fontSize: '14px',
              }}>
              🔍 Tìm
            </button>
          </form>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'none', border: '1.5px solid var(--border-color)',
                  borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                  color: 'var(--text-primary)',
                }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <span style={{ fontSize: '13px', fontWeight: '600', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.full_name || 'Khách hàng'}
                </span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                  minWidth: '180px', overflow: 'hidden', zIndex: 100,
                }}>
                  <a href="/customer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid var(--border-color)' }}>🏠 Trang chủ</a>
                  <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#EF4444', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="container" style={{ paddingTop: '28px', paddingBottom: '60px' }}>

          {/* ── Page Title & Breadcrumb ── */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span onClick={() => router.push('/customer')} style={{ cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: '600' }}>Trang chủ</span>
              <span>›</span>
              <span>Tìm kiếm</span>
              {initialQ && <><span>›</span><span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>"{initialQ}"</span></>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {initialQ ? `Kết quả cho "${initialQ}"` : 'Tất cả thợ'}
                </h1>
                {!loading && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Tìm thấy <strong style={{ color: 'var(--accent-primary)' }}>{workers.length}</strong> thợ phù hợp
                  </p>
                )}
              </div>

              {/* Quick category tags */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Điện lạnh', 'Ống nước', 'Sửa điện', 'Vệ sinh', 'Thợ mộc'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSearchInput(cat); router.push(`/search?q=${encodeURIComponent(cat)}`); }}
                    style={{
                      padding: '5px 12px', borderRadius: '20px',
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: initialQ === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: initialQ === cat ? 'white' : 'var(--text-secondary)',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Layout: Filter + Grid ── */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

            {/* Filter Sidebar */}
            <FilterSidebar filters={filters} onChange={setFilters} />

            {/* Results Grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : workers.length === 0 ? (
                // Empty state
                <div style={{
                  textAlign: 'center', padding: '80px 20px',
                  backgroundColor: 'var(--bg-secondary)', borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Không tìm thấy thợ
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                    Thử tìm với từ khóa khác như "sửa điện", "điều hòa", "ống nước"...
                  </p>
                  <button
                    onClick={() => { setSearchInput(''); router.push('/search'); }}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '14px' }}>
                    Xem tất cả thợ
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                  }}>
                    {workers.map(w => (
                      <WorkerCard key={w.id} worker={w} />
                    ))}
                  </div>

                  {/* Load more hint */}
                  {workers.length >= 24 && (
                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                      <button
                        style={{
                          padding: '12px 32px', border: '2px solid var(--accent-primary)',
                          borderRadius: '10px', color: 'var(--accent-primary)',
                          background: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                        }}>
                        Xem thêm →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải kết quả tìm kiếm...</div>}>
      <SearchContent />
    </Suspense>
  );
}
