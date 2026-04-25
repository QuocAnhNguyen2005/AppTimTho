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
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-primary)' }}>
              AppTimTho
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <a href="#services" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Dịch vụ</a>
              <a href="#workers" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Trở thành thợ</a>
              <button className="btn-primary" style={{ padding: '8px 16px' }}>Đăng nhập</button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
