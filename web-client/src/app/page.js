import React from 'react';

export default function Home() {
  return (
    <main style={{ paddingTop: '80px', fontFamily: 'var(--font-sans)' }}>
      {/* Hero Section */}
      <section style={{ padding: '100px 0', textAlign: 'center', backgroundColor: 'var(--bg-hover)' }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: '800', 
            marginBottom: '24px', 
            color: 'var(--text-primary)',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            Gọi Thợ Sửa Chữa <br/> 
            <span style={{ color: 'var(--accent-primary)' }}>Chỉ Trong 5 Phút</span>
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--text-secondary)', 
            marginBottom: '48px', 
            maxWidth: '640px', 
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Nền tảng kết nối thợ sửa chữa gia dụng, điện lạnh, ống nước với khách hàng. 
            Giá cả minh bạch, thợ đã được xác minh danh tính và tay nghề.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>Tìm thợ ngay</button>
            <button className="btn-outline" style={{ padding: '14px 32px', fontSize: '16px' }}>Đăng ký làm thợ</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" style={{ padding: '100px 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '800', 
            textAlign: 'center', 
            marginBottom: '64px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px'
          }}>
            Dịch Vụ Nổi Bật
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {/* Card 1 */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '40px', 
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '24px', lineHeight: '1' }}>⚡</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Sửa Điện Gia Dụng</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '16px' }}>Sửa chữa chập cháy, thay mới đường dây, lắp đặt thiết bị điện an toàn, đúng tiêu chuẩn.</p>
            </div>

            {/* Card 2 */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '40px', 
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '24px', lineHeight: '1' }}>❄️</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Điện Lạnh</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '16px' }}>Bảo dưỡng điều hòa định kỳ, sửa tủ lạnh, máy giặt tận nhà nhanh chóng, chuyên nghiệp.</p>
            </div>

            {/* Card 3 */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '40px', 
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '24px', lineHeight: '1' }}>🚰</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Đường Ống Nước</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '16px' }}>Xử lý rò rỉ nước, thông tắc bồn cầu, chậu rửa, lắp đặt thiết bị vệ sinh cao cấp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 0', textAlign: 'center', backgroundColor: 'var(--accent-primary)', color: 'white' }}>
        <div className="container">
          <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
            Đăng ký để nhận đơn hôm nay
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.85, marginBottom: '48px', maxWidth: '640px', margin: '0 auto 48px auto', lineHeight: '1.6', fontStyle: 'italic' }}>
            (Hệ thống khấu hao 15,5% chi phí cho mỗi giao dịch sửa chữa)
          </p>
          <button style={{ 
            backgroundColor: 'white', 
            color: 'var(--accent-primary)', 
            padding: '16px 40px', 
            borderRadius: '12px', 
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            Tạo Hồ Sơ Thợ
          </button>
        </div>
      </section>
    </main>
  );
}
