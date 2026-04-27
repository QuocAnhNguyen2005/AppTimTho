"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ── Dữ liệu tĩnh ──────────────────────────────────────────────
const SERVICES = [
  { icon: '⚡', label: 'Sửa điện' },
  { icon: '❄️', label: 'Điện lạnh' },
  { icon: '🚰', label: 'Ống nước' },
  { icon: '🔧', label: 'Cơ khí' },
  { icon: '🪵', label: 'Mộc/Nội thất' },
  { icon: '🧹', label: 'Vệ sinh' },
  { icon: '🔒', label: 'Sửa khóa' },
  { icon: '💡', label: 'Lắp đèn' },
  { icon: '🖥️', label: 'Điện tử' },
  { icon: '🏠', label: 'Xem thêm' },
];

const BANNERS = [
  { gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', title: 'Gọi thợ chỉ trong 5 phút', sub: 'Thợ đã xác minh · Giá minh bạch', cta: 'Đặt ngay' },
  { gradient: 'linear-gradient(135deg, #0EA5E9 0%, #4F46E5 100%)', title: 'Giảm 20% vệ sinh điều hòa', sub: 'Áp dụng đến 30/04/2026', cta: 'Xem ưu đãi' },
  { gradient: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)', title: 'Bảo dưỡng định kỳ', sub: 'Đăng ký gói tháng tiết kiệm 35%', cta: 'Tìm hiểu' },
];

const WORKERS = [
  { name: 'Nguyễn Văn Hùng', specialty: 'Điện lạnh · Điện gia dụng', rating: 4.9, jobs: 237, distance: '0.8 km', verified: true, avatar: '👷' },
  { name: 'Trần Minh Quân', specialty: 'Ống nước · Chống thấm', rating: 4.8, jobs: 184, distance: '1.2 km', verified: true, avatar: '🔧' },
  { name: 'Lê Văn Đức', specialty: 'Điện tử · Sửa PC', rating: 4.7, jobs: 312, distance: '2.1 km', verified: true, avatar: '💡' },
  { name: 'Phạm Thị Lan', specialty: 'Vệ sinh công nghiệp', rating: 4.9, jobs: 95, distance: '1.5 km', verified: false, avatar: '🧹' },
  { name: 'Hoàng Văn Nam', specialty: 'Mộc · Nội thất', rating: 4.6, jobs: 156, distance: '3.0 km', verified: true, avatar: '🪵' },
  { name: 'Đỗ Quốc Bảo', specialty: 'Sửa khóa · Cửa cuốn', rating: 4.8, jobs: 201, distance: '0.5 km', verified: true, avatar: '🔒' },
  { name: 'Vũ Hải Đăng', specialty: 'Điện lạnh · Máy giặt', rating: 4.7, jobs: 143, distance: '1.9 km', verified: true, avatar: '❄️' },
  { name: 'Ngô Thành Tâm', specialty: 'Lắp đặt điện · Đèn', rating: 4.5, jobs: 88, distance: '2.4 km', verified: false, avatar: '⚡' },
];

const RECENT_ORDERS = [
  { id: '#DH001', service: 'Sửa điều hòa', worker: 'Nguyễn Văn Hùng', date: '25/04/2026', status: 'Hoàn thành', statusColor: '#10B981' },
  { id: '#DH002', service: 'Thông tắc bồn cầu', worker: 'Trần Minh Quân', date: '22/04/2026', status: 'Hoàn thành', statusColor: '#10B981' },
  { id: '#DH003', service: 'Sửa máy giặt', worker: 'Vũ Hải Đăng', date: '18/04/2026', status: 'Đã huỷ', statusColor: '#EF4444' },
];

// ── Component phụ ─────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: '13px', fontWeight: '600' }}>
      ★ {rating.toFixed(1)}
    </span>
  );
}

// ── Component chính ───────────────────────────────────────────
export default function CustomerHomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredWorker, setHoveredWorker] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try { setUser(JSON.parse(saved)); } catch { router.push('/login'); }
  }, [router]);

  // Auto-rotate banner
  useEffect(() => {
    const t = setInterval(() => setBannerIndex(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  const banner = BANNERS[bannerIndex];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', fontFamily: 'Outfit, sans-serif' }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        {/* Top bar */}
        <div style={{ backgroundColor: 'var(--accent-primary)', padding: '6px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            {['Thông báo', 'Hỗ trợ', 'Về chúng tôi'].map(item => (
              <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '500' }}>{item}</a>
            ))}
          </div>
        </div>

        {/* Main header */}
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '14px 24px' }}>
          {/* Logo */}
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
            onClick={() => router.push('/home')}>
            App<span style={{ color: 'var(--text-primary)' }}>TimTho</span>
          </div>

          {/* Search bar */}
          <div style={{ flex: 1, display: 'flex', maxWidth: '680px' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm thợ sửa điện, điều hòa, ống nước..."
              style={{ flex: 1, padding: '11px 18px', border: '2px solid var(--accent-primary)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px', outline: 'none', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
            <button style={{ padding: '11px 20px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
              🔍 Tìm
            </button>
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', position: 'relative' }}>
              🔔
              <span style={{ position: 'absolute', top: '-4px', right: '-6px', width: '16px', height: '16px', backgroundColor: '#EF4444', borderRadius: '50%', fontSize: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>3</span>
            </button>

            {/* User menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1.5px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '22px' }}>👤</span>
                <span style={{ fontSize: '13px', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name || 'Khách hàng'}</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>

              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', minWidth: '180px', overflow: 'hidden', zIndex: 100 }}>
                  {[{ icon: '👤', label: 'Hồ sơ cá nhân', href: '/profile' }, { icon: '📋', label: 'Lịch sử đơn hàng', href: '/orders' }, { icon: '⚙️', label: 'Cài đặt', href: '/settings' }].map(item => (
                    <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid var(--border-color)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <span>{item.icon}</span> {item.label}
                    </a>
                  ))}
                  <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#EF4444', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <main>

        {/* ── BANNER + SIDE BANNERS (layout Shopee) ─────── */}
        <section style={{ backgroundColor: 'var(--bg-hover)', padding: '20px 0' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>

            {/* Main carousel */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: banner.gradient, minHeight: '240px', display: 'flex', alignItems: 'center', padding: '40px 48px', position: 'relative', cursor: 'pointer', transition: 'all 0.5s ease' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '10px', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }}>🔥 Ưu đãi hôm nay</div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '10px', lineHeight: '1.2' }}>{banner.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', marginBottom: '24px' }}>{banner.sub}</p>
                <button style={{ backgroundColor: 'white', color: 'var(--accent-primary)', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>{banner.cta} →</button>
              </div>
              <div style={{ fontSize: '100px', opacity: 0.15, position: 'absolute', right: '40px' }}>🔧</div>

              {/* Dots */}
              <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                {BANNERS.map((_, i) => (
                  <button key={i} onClick={() => setBannerIndex(i)} style={{ width: i === bannerIndex ? '20px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: 'white', opacity: i === bannerIndex ? 1 : 0.5, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            </div>

            {/* Side banners */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>⭐ Thợ nổi bật</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Top thợ trong tuần</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>Đánh giá 4.9★ trở lên</div>
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)', padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>🎁 Khuyến mãi</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Đặt thợ lần đầu</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>Giảm ngay 50.000₫</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK SERVICE ICONS ────────────────────────── */}
        <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
              {SERVICES.map(s => (
                <button key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'center', lineHeight: '1.3' }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECENT ORDERS (nếu có) ─────────────────────── */}
        {RECENT_ORDERS.length > 0 && (
          <section style={{ padding: '28px 0' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>📋 Đơn hàng gần đây</h2>
                <a href="/orders" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }}>Xem tất cả →</a>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                {RECENT_ORDERS.map((order, i) => (
                  <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 120px 100px', alignItems: 'center', padding: '14px 20px', borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)' }}>{order.id}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{order.service}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>👷 {order.worker}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{order.date}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: order.statusColor, backgroundColor: order.statusColor + '18', padding: '4px 10px', borderRadius: '20px', textAlign: 'center' }}>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── WORKER GRID (layout giống product grid Shopee) */}
        <section style={{ padding: '8px 0 40px' }}>
          <div className="container">
            {/* Section header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>🏆 Thợ uy tín gần bạn</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Đã được xác minh danh tính và tay nghề</p>
              </div>
              <a href="/workers" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }}>Xem tất cả →</a>
            </div>

            {/* Worker cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {WORKERS.map((w, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredWorker(i)}
                  onMouseLeave={() => setHoveredWorker(null)}
                  style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '14px', border: `1.5px solid ${hoveredWorker === i ? 'var(--accent-primary)' : 'var(--border-color)'}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', transform: hoveredWorker === i ? 'translateY(-4px)' : 'none', boxShadow: hoveredWorker === i ? '0 12px 30px rgba(79,70,229,0.15)' : 'var(--shadow-sm)' }}>

                  {/* Avatar area */}
                  <div style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{w.avatar}</div>
                    {w.verified && (
                      <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--accent-primary)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px' }}>✓ Xác minh</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{w.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{w.specialty}</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <StarRating rating={w.rating} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{w.jobs} đơn</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📍 {w.distance}</span>
                    </div>

                    <button style={{ width: '100%', padding: '9px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}>
                      Đặt ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA ────────────────────────────────── */}
        <section style={{ backgroundColor: 'var(--accent-primary)', padding: '40px 0', textAlign: 'center' }}>
          <div className="container">
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Bạn là thợ lành nghề?</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>Đăng ký nhận đơn và tăng thu nhập hàng ngày</p>
            <a href="/register/worker" style={{ backgroundColor: 'white', color: 'var(--accent-primary)', padding: '12px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
              Tạo hồ sơ Thợ →
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
