/**
 * @file layout.js
 * @description Layout gốc (Root Layout) - bao ngoài tất cả các trang của web-client.
 * Chứa: thẻ <html>, <body>, thanh điều hướng (Navbar) cố định ở trên.
 * Next.js App Router sẽ tự động áp dụng component này cho mọi route.
 */
import './globals.css';

/**
 * @constant metadata
 * @description Metadata SEO cho toàn bộ trang web.
 * Được Next.js inject vào thẻ <head> tự động.
 */
export const metadata = {
  title: 'AppTimTho - Tìm thợ sửa chữa quanh bạn',
  description: 'Nền tảng kết nối thợ sửa chữa gia dụng, điện lạnh, ống nước với khách hàng nhanh chóng, uy tín.',
};

/**
 * @component RootLayout
 * @description Khung giao diện toàn cục.
 * - Navbar (glass-header): cố định trên cùng, hiệu ứng kính mờ.
 *   + Logo "AppTimTho" → dẫn về trang chủ
 *   + Link "Dịch vụ" → cuộn tới section #services
 *   + Link "Đăng nhập" → /login
 *   + Button "Đăng ký" (.btn-primary) → /register (trang chọn vai trò)
 * - {children}: Nơi các trang con (page.js, login/page.js...) được render vào.
 * @param {React.ReactNode} children - Nội dung trang con
 */
export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        {/* Navbar: Cố định trên cùng, hiển thị ở mọi trang */}
        <nav className="glass-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Logo thương hiệu */}
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px' }}>
              AppTimTho
            </div>
            {/* Menu điều hướng */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <a href="/orders" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px' }}>Đơn hàng</a>
              <a href="#services" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px' }}>Dịch vụ</a>
              <a href="/login" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px' }}>Đăng nhập</a>
              {/* Nút đăng ký: dùng .btn-primary, dẫn tới trang chọn vai trò */}
              <a href="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: '15px' }}>Đăng ký</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
