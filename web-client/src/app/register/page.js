/**
 * @file register/page.js - Trang chọn vai trò đăng ký
 * @route /register
 * @directive "use client" - Cần thiết vì dùng useRouter() để điều hướng khi bấm nút
 * @description Trang trung gian đầu tiên trong luồng đăng ký.
 * Hiển thị 2 card lựa chọn vai trò:
 *  - "Bạn là thợ?" (tím - accent-primary) → router.push('/register/worker')
 *  - "Bạn là khách hàng?" (xanh #0EA5E9) → router.push('/register/customer')
 * Hover vào card sẽ nâng lên + đổi màu viền theo màu đặc trưng của từng vai trò.
 */
"use client";

import { useRouter } from 'next/navigation';

/**
 * @component RegisterPage
 * @description Trang chọn vai trò - điểm vào của luồng đăng ký.
 * Dùng useRouter() để điều hướng client-side (không reload trang).
 */
export default function RegisterPage() {
  /** @type {import('next/navigation').AppRouterInstance} - Hook điều hướng của Next.js App Router */
  const router = useRouter();

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '12px' }}>
          AppTimTho
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.5px' }}>
          Bạn là ai?
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '440px' }}>
          Chọn đúng vai trò để chúng tôi chuẩn bị tài khoản phù hợp nhất cho bạn.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '800px' }}>
        {/* Worker Card */}
        <button
          onClick={() => router.push('/register/worker')}
          style={{
            flex: '1 1 320px',
            minHeight: '280px',
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: '24px',
            padding: '48px 32px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(79,70,229,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
          }}
        >
          <div style={{ fontSize: '64px', lineHeight: '1' }}>🔧</div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Bạn là thợ?
            </div>
            <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Đăng ký làm đối tác, nhận đơn hàng hàng ngày và tăng thu nhập của bạn.
            </div>
          </div>
          <div style={{
            marginTop: '8px',
            padding: '12px 28px',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '15px'
          }}>
            Đăng ký tài khoản Thợ
          </div>
        </button>

        {/* Customer Card */}
        <button
          onClick={() => router.push('/register/customer')}
          style={{
            flex: '1 1 320px',
            minHeight: '280px',
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: '24px',
            padding: '48px 32px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#0EA5E9';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(14,165,233,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
          }}
        >
          <div style={{ fontSize: '64px', lineHeight: '1' }}>🏠</div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Bạn là khách hàng?
            </div>
            <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Tìm thợ sửa chữa uy tín, nhanh chóng ngay trong khu vực của bạn.
            </div>
          </div>
          <div style={{
            marginTop: '8px',
            padding: '12px 28px',
            backgroundColor: '#0EA5E9',
            color: 'white',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '15px'
          }}>
            Đăng ký tài khoản Khách hàng
          </div>
        </button>
      </div>

      <p style={{ marginTop: '36px', fontSize: '14px', color: 'var(--text-secondary)' }}>
        Đã có tài khoản?{' '}
        <a href="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Đăng nhập ngay</a>
      </p>
    </main>
  );
}
