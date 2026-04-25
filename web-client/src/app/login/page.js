import React from 'react';

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: '24px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)', 
        padding: '48px', 
        width: '100%', 
        maxWidth: '440px',
        border: '1px solid var(--border-color)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            AppTimTho
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Đăng nhập
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</p>
        </div>

        {/* Social Login Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {/* Google */}
          <button style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 8px',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-primary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#EA4335'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234,67,53,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
              <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
              <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
              <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
            </svg>
            Google
          </button>

          {/* Zalo */}
          <button style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 8px',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-primary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0068FF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,104,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="12" fill="#0068FF"/>
              <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="26" fontWeight="800" fontFamily="Arial">Z</text>
            </svg>
            Zalo
          </button>

          {/* Facebook */}
          <button style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 8px',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-primary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1877F2'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(24,119,242,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>hoặc đăng nhập với tài khoản</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Form */}
        <form onSubmit={e => e.preventDefault()}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Tên tài khoản / Email
            </label>
            <input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Mật khẩu
              </label>
              <a href="#" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '500' }}>
                Quên mật khẩu?
              </a>
            </div>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '12px', textAlign: 'center' }}>
            Đăng nhập
          </button>
        </form>

        {/* Sign Up Link */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Chưa có tài khoản?{' '}
          <a href="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
            Đăng ký ngay
          </a>
        </p>
      </div>
    </main>
  );
}
