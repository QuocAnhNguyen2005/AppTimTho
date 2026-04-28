"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function WorkerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Tổng quan', path: '/worker/dashboard', icon: '🏠' },
    { name: 'Lịch sử Đơn hàng', path: '/worker/orders', icon: '📋' },
    { name: 'Ví & Thu nhập', path: '/worker/wallet', icon: '💰' },
    { name: 'Uy tín & Hồ sơ', path: '/worker/reviews', icon: '⭐' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
      
      {/* Logo / Brand */}
      <div style={{ marginBottom: '40px', padding: '0 12px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-primary)', margin: 0 }}>
          AppTimTho <span style={{ color: '#10B981', fontSize: '14px' }}>PRO</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                textDecoration: 'none', fontWeight: isActive ? '700' : '600', fontSize: '15px',
                backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                color: isActive ? '#2563EB' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
            border: 'none', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '700', fontSize: '15px',
            cursor: 'pointer', transition: 'background-color 0.2s'
          }}
        >
          <span style={{ fontSize: '18px' }}>🚪</span>
          Đăng xuất
        </button>
      </div>

    </div>
  );
}
