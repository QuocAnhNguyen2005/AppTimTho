"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function CustomerHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredWorker, setHoveredWorker] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try { setUser(JSON.parse(saved)); } catch { router.push('/login'); }
  }, [router]);

  useEffect(() => {
    const t = setInterval(() => setBannerIndex(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = search.trim();
    if (q) router.push(`/customer/search?q=${encodeURIComponent(q)}`);
    else router.push('/customer/search');
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }}>⚙️</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const banner = BANNERS[bannerIndex];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', fontFamily: 'Outfit, sans-serif' }}>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ backgroundColor: 'var(--accent-primary)', padding: '5px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            {['Thông báo', 'Hỗ trợ', 'Về chúng tôi'].map(item => (
              <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '500' }}>{item}</a>
            ))}
          </div>
        </div>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '12px 24px' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
            onClick={() => router.push('/customer/home')}>
            App<span style={{ color: 'var(--text-primary)' }}>TimTho</span>
          </div>
          <div style={{ flex: 1, display: 'flex', maxWidth: '680px' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm thợ sửa điện, điều hòa, ống nước..."
              style={{ flex: 1, padding: '10px 18px', border: '2px solid var(--accent-primary)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px', outline: 'none', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
            <button onClick={() => handleSearch()} style={{ padding: '10px 20px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
              🔍 Tìm
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', position: 'relative' }}>
              🔔
              <span style={{ position: 'absolute', top: '-4px', right: '-6px', width: '16px', height: '16px', backgroundColor: '#EF4444', borderRadius: '50%', fontSize: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>3</span>
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowUserMenu(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1.5px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <span style={{ fontSize: '13px', fontWeight: '600', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name || 'Khách hàng'}</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>
              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', minWidth: '180px', overflow: 'hidden', zIndex: 100 }}>
                  {[
                    { icon: '👤', label: 'Tài khoản của tôi', href: '/customer/account' },
                    { icon: '📋', label: 'Lịch sử đơn hàng', href: '/customer/orders' },
                    { icon: '💳', label: 'Thanh toán', href: '/customer/account' },
                    { icon: '⚙️', label: 'Cài đặt', href: '/customer/account' },
                  ].map(item => (
                    <a key={item.label} href={item.href}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid var(--border-color)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      {item.icon} {item.label}
                    </a>
                  ))}
                  <button onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#EF4444', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* BANNER */}
        <section style={{ backgroundColor: 'var(--bg-hover)', padding: '20px 0' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div style={{ borderRadius: '16px', background: banner.gradient, minHeight: '220px', display: 'flex', alignItems: 'center', padding: '36px 44px', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginBottom: '8px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>🔥 Ưu đãi hôm nay</div>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginBottom: '8px', lineHeight: '1.25' }}>{banner.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>{banner.sub}</p>
                <button style={{ backgroundColor: 'white', color: 'var(--accent-primary)', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>{banner.cta} →</button>
              </div>
              <div style={{ fontSize: '120px', opacity: 0.08, position: 'absolute', right: '20px', bottom: '-10px', lineHeight: 1 }}>🔧</div>
              <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                {BANNERS.map((_, i) => (
                  <button key={i} onClick={() => setBannerIndex(i)}
                    style={{ width: i === bannerIndex ? '20px' : '7px', height: '7px', borderRadius: '4px', backgroundColor: 'white', opacity: i === bannerIndex ? 1 : 0.45, border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>⭐ Thợ nổi bật</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>Top thợ trong tuần</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '3px' }}>Đánh giá 4.9★ trở lên</div>
              </div>
              <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)', padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>🎁 Khuyến mãi</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>Đặt thợ lần đầu</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '3px' }}>Giảm ngay 50.000₫</div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '18px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
              {SERVICES.map(s => (
                <button key={s.label} onClick={() => router.push(`/customer/search?q=${encodeURIComponent(s.label)}`)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', padding: '10px 6px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '10px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px' }}>{s.icon}</div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'center', lineHeight: '1.3' }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section style={{ padding: '24px 0 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>📋 Đơn hàng gần đây</h2>
              <a href="/customer/orders" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }}>Xem tất cả →</a>
            </div>
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              {RECENT_ORDERS.map((order, i) => (
                <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 120px 100px', alignItems: 'center', padding: '13px 20px', borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)' }}>{order.id}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{order.service}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>👷 {order.worker}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{order.date}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: order.statusColor, backgroundColor: order.statusColor + '20', padding: '4px 10px', borderRadius: '20px', textAlign: 'center' }}>{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKER GRID */}
        <section style={{ padding: '24px 0 40px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>🏆 Thợ uy tín gần bạn</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>Đã được xác minh danh tính và tay nghề</p>
              </div>
              <a href="/customer/search" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }}>Xem tất cả →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {WORKERS.map((w, i) => (
                <div key={i} onMouseEnter={() => setHoveredWorker(i)} onMouseLeave={() => setHoveredWorker(null)}
                  style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '14px', border: `1.5px solid ${hoveredWorker === i ? 'var(--accent-primary)' : 'var(--border-color)'}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', transform: hoveredWorker === i ? 'translateY(-4px)' : 'none', boxShadow: hoveredWorker === i ? '0 12px 30px rgba(79,70,229,0.15)' : 'var(--shadow-sm)' }}>
                  <div style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{w.avatar}</div>
                    {w.verified && <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--accent-primary)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' }}>✓ XM</div>}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>{w.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{w.specialty}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ color: '#F59E0B', fontSize: '13px', fontWeight: '600' }}>★ {w.rating.toFixed(1)}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{w.jobs} đơn</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>📍 {w.distance}</span>
                    </div>
                    <button onClick={() => router.push('/customer/search')}
                      style={{ width: '100%', padding: '8px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}>
                      Đặt ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section style={{ backgroundColor: 'var(--accent-primary)', padding: '36px 0', textAlign: 'center' }}>
          <div className="container">
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>Bạn là thợ lành nghề?</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '18px' }}>Đăng ký nhận đơn và tăng thu nhập hàng ngày</p>
            <a href="/register/worker" style={{ backgroundColor: 'white', color: 'var(--accent-primary)', padding: '11px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', display: 'inline-block' }}>
              Tạo hồ sơ Thợ →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
