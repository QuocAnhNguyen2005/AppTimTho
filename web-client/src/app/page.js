import React from 'react';

export default function Home() {
  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 0', textAlign: 'center', backgroundColor: 'var(--bg-hover)' }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>
            Gọi Thợ Sửa Chữa <br/> 
            <span style={{ color: 'var(--accent-primary)' }}>Chỉ Trong 5 Phút</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            Nền tảng kết nối thợ sửa chữa gia dụng, điện lạnh, ống nước với khách hàng. 
            Giá cả minh bạch, thợ đã được xác minh danh tính.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-primary">Tìm thợ ngay</button>
            <button className="btn-outline">Đăng ký làm thợ</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
            Dịch Vụ Nổi Bật
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Card 1 */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚡</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Sửa Điện Gia Dụng</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Sửa chữa chập cháy, thay mới đường dây, lắp đặt thiết bị điện an toàn.</p>
            </div>

            {/* Card 2 */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>❄️</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Điện Lạnh</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Bảo dưỡng điều hòa, sửa tủ lạnh, máy giặt tận nhà nhanh chóng.</p>
            </div>

            {/* Card 3 */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚰</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Đường Ống Nước</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Xử lý rò rỉ, thông tắc bồn cầu, lắp đặt thiết bị vệ sinh chuyên nghiệp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', textAlign: 'center', backgroundColor: 'var(--accent-primary)', color: 'white' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px' }}>
            Bạn là thợ sửa chữa lành nghề?
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            Đăng ký để nhận đơn hàng ngay hôm nay. Hệ thống chỉ lấy hoa hồng 15.5%, giúp bạn tối đa hóa thu nhập.
          </p>
          <button style={{ 
            backgroundColor: 'white', 
            color: 'var(--accent-primary)', 
            padding: '12px 32px', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Tạo Hồ Sơ Thợ
          </button>
        </div>
      </section>
    </main>
  );
}
