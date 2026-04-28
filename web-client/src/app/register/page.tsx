"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'customer' | 'worker' | null;

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleContinue = () => {
    if (selectedRole === 'customer') router.push('/register/customer');
    else if (selectedRole === 'worker') router.push('/register/worker');
  };

  const ROLES = [
    {
      id: 'customer' as Role,
      icon: '🔍',
      title: 'Tôi là Khách hàng',
      desc: 'Tìm thợ sửa chữa uy tín, giá minh bạch, đặt lịch dễ dàng',
      tags: ['Tìm thợ nhanh', 'Đặt lịch hẹn', 'Theo dõi đơn'],
      gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    },
    {
      id: 'worker' as Role,
      icon: '🔧',
      title: 'Tôi là Thợ',
      desc: 'Nhận đơn sửa chữa trong khu vực, tăng thu nhập mỗi ngày',
      tags: ['Nhận đơn gần bạn', 'Thu nhập linh hoạt', 'Xây dựng uy tín'],
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
    },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a href="/" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px', display: 'inline-block', marginBottom: '20px' }}>
            AppTimTho
          </a>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            Bạn muốn đăng ký với vai trò?
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Chọn vai trò phù hợp để chúng tôi cá nhân hóa trải nghiệm cho bạn
          </p>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          {ROLES.map(role => {
            const isSelected = selectedRole === role.id;
            return (
              <button key={role.id} onClick={() => setSelectedRole(role.id)} type="button"
                style={{
                  width: '100%', textAlign: 'left', padding: '24px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  backgroundColor: isSelected ? '#EEF2FF' : 'var(--bg-secondary)',
                  boxShadow: isSelected ? '0 0 0 4px rgba(79,70,229,0.12)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                  {/* Icon */}
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: role.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {role.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>{role.title}</span>
                      {/* Radio indicator */}
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isSelected && <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>{role.desc}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {role.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '11px', fontWeight: '600', backgroundColor: isSelected ? '#C7D2FE' : '#F1F5F9', color: isSelected ? '#4338CA' : 'var(--text-secondary)', padding: '3px 10px', borderRadius: '20px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <button onClick={handleContinue} disabled={!selectedRole} className="btn-primary"
          style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '14px', opacity: selectedRole ? 1 : 0.45, cursor: selectedRole ? 'pointer' : 'not-allowed', transition: 'opacity 0.2s' }}>
          {selectedRole ? 'Tiếp tục →' : 'Chọn vai trò để tiếp tục'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Đã có tài khoản?{' '}
          <a href="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Đăng nhập</a>
        </p>
      </div>
    </main>
  );
}
