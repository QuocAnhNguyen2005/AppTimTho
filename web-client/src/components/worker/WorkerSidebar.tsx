"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function WorkerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) setWorker(JSON.parse(saved));
      const onlineStatus = localStorage.getItem('workerOnline');
      if (onlineStatus !== null) setIsOnline(onlineStatus === 'true');
    } catch {}
  }, []);

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    localStorage.setItem('workerOnline', String(next));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('workerOnline');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Tổng quan', path: '/worker/dashboard', icon: '🏠' },
    { name: 'Lịch sử Đơn hàng', path: '/worker/orders', icon: '📋' },
    { name: 'Ví & Thu nhập', path: '/worker/wallet', icon: '💰' },
    { name: 'Uy tín & Hồ sơ', path: '/worker/reviews', icon: '⭐' },
    { name: 'Tài khoản của tôi', path: '/worker/account', icon: '👤' },
  ];

  const avgRating = 4.8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>

      {/* Brand */}
      <div style={{ marginBottom: '28px', padding: '0 4px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent-primary)', margin: 0 }}>
          AppTimTho <span style={{ color: '#10B981', fontSize: '12px' }}>PRO</span>
        </h2>
      </div>

      {/* Worker Info Card */}
      {worker && (
        <div style={{ backgroundColor: '#EEF2FF', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>👷</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '800', fontSize: '14px', color: '#1E1B4B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worker.full_name}</div>
              <div style={{ fontSize: '12px', color: '#4F46E5', fontWeight: '600', marginTop: '2px' }}>⭐ {avgRating} · Thợ chuyên nghiệp</div>
            </div>
          </div>

          {/* Online Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', padding: '10px 14px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: isOnline ? '#059669' : '#6B7280' }}>{isOnline ? '🟢 Đang nhận đơn' : '⚫ Đang nghỉ'}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{isOnline ? 'Khách hàng thấy bạn' : 'Khách không thấy bạn'}</div>
            </div>
            <div onClick={toggleOnline} style={{ width: '44px', height: '24px', borderRadius: '20px', backgroundColor: isOnline ? '#10B981' : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}>
              <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: isOnline ? '23px' : '3px', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: isActive ? '700' : '600', fontSize: '14px',
              backgroundColor: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F46E5' : 'var(--text-secondary)', transition: 'all 0.2s',
              borderLeft: isActive ? '3px solid #4F46E5' : '3px solid transparent',
            }}>
              <span style={{ fontSize: '17px' }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', border: 'none', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          <span style={{ fontSize: '17px' }}>🚪</span> Đăng xuất
        </button>
      </div>
    </div>
  );
}
