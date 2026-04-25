import './globals.css';

export const metadata = {
  title: 'AppTimTho - Tìm thợ sửa chữa quanh bạn',
  description: 'Nền tảng kết nối thợ sửa chữa gia dụng, điện lạnh, ống nước với khách hàng nhanh chóng, uy tín.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <nav className="glass-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px' }}>
              AppTimTho
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <a href="#services" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px' }}>Dịch vụ</a>
              <a href="#login" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px' }}>Đăng nhập</a>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '15px' }}>Đăng ký</button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
