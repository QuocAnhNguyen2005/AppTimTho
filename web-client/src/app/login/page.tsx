"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!phoneNumber || !password) {
      setErrorMsg('Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sai thông tin đăng nhập');

      localStorage.setItem('user', JSON.stringify(data.user || {}));
      localStorage.setItem('role', data.role || '');

      const roleLabel = data.role === 'customer' ? 'Khách hàng' : data.role === 'worker' ? 'Thợ' : 'Admin';
      setSuccessMsg(`✅ Đăng nhập thành công (${roleLabel})! Đang chuyển hướng...`);

      setTimeout(() => {
        if (data.role === 'admin') router.push('/admin');
        else if (data.role === 'worker') router.push('/worker/dashboard');
        else router.push('/customer/home');
      }, 800);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', padding: '48px', width: '100%', maxWidth: '440px', border: '1px solid var(--border-color)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>AppTimTho</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>Đăng nhập</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</p>
        </div>

        {/* Social Login */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Google', color: '#EA4335', shadow: 'rgba(234,67,53,0.15)' },
            { label: 'Zalo', color: '#0068FF', shadow: 'rgba(0,104,255,0.15)' },
            { label: 'Facebook', color: '#1877F2', shadow: 'rgba(24,119,242,0.15)' },
          ].map(s => (
            <button key={s.label} type="button"
              style={{ flex: 1, padding: '11px 8px', border: '1.5px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor = s.color); (e.currentTarget.style.boxShadow = `0 0 0 3px ${s.shadow}`); }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border-color)'); (e.currentTarget.style.boxShadow = 'none'); }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>hoặc đăng nhập với tài khoản</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {errorMsg && (
            <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#059669', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>
              {successMsg}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Số điện thoại</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại"
              autoComplete="tel"
              style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Mật khẩu</label>
              <a href="#" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '500' }}>Quên mật khẩu?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                style={{ width: '100%', padding: '13px 48px 13px 16px', borderRadius: '12px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--text-secondary)' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '12px', textAlign: 'center', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            {isLoading ? '⏳ Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Chưa có tài khoản?{' '}
          <a href="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Đăng ký ngay</a>
        </p>
      </div>
    </main>
  );
}
