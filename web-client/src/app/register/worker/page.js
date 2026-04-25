"use client";

import { useState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: '12px',
  border: '1.5px solid var(--border-color)',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '8px',
};

const sectionTitleStyle = {
  fontSize: '17px',
  fontWeight: '800',
  color: 'var(--text-primary)',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '2px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const SPECIALTIES = ['Điện lạnh', 'Sửa ống nước', 'Sửa PC / Điện tử', 'Điện gia dụng', 'Mộc & Nội thất', 'Vệ sinh công nghiệp', 'Sửa khóa', 'Khác'];

const BANKS = ['Vietcombank', 'MB Bank', 'Techcombank', 'Agribank', 'BIDV', 'VietinBank', 'ACB', 'TPBank', 'SHB', 'VPBank', 'Sacombank', 'MSB', 'HDBank'];

const DISTRICTS_HCM = [
  'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7',
  'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12', 'Bình Thạnh', 'Gò Vấp',
  'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Bình Tân', 'Thủ Đức',
  'Bình Chánh', 'Hóc Môn', 'Nhà Bè', 'Cần Giờ', 'Củ Chi'
];

export default function WorkerRegisterPage() {
  const [avatarName, setAvatarName] = useState('');
  const [cccdFrontName, setCccdFrontName] = useState('');
  const [cccdBackName, setCccdBackName] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const toggleSpecialty = (s) => setSelectedSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleDistrict = (d) => setSelectedDistricts(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const chipSelected = { padding: '8px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '2px solid var(--accent-primary)', backgroundColor: 'var(--accent-primary)', color: 'white', transition: 'all 0.15s' };
  const chipDefault = { padding: '8px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'all 0.15s' };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        padding: '48px',
        width: '100%',
        maxWidth: '600px',
        border: '1px solid var(--border-color)',
        marginTop: '16px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔧</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Tạo hồ sơ Thợ
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Điền đầy đủ thông tin để được duyệt hồ sơ nhanh nhất.
          </p>
        </div>

        <form onSubmit={e => e.preventDefault()}>

          {/* === PHẦN 1: Thông tin định danh === */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionTitleStyle}><span>👤</span> Thông tin định danh</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                <input type="text" placeholder="Nguyễn Văn A" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
              <div>
                <label style={labelStyle}>Ngày sinh <span style={{ color: 'red' }}>*</span></label>
                <input type="date" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
              <input type="tel" placeholder="0909 xxx xxx" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                <input type="password" placeholder="Tối thiểu 8 ký tự" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
              <div>
                <label style={labelStyle}>Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span></label>
                <input type="password" placeholder="Nhập lại mật khẩu" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Số CCCD <span style={{ color: 'red' }}>*</span></label>
              <input type="text" placeholder="012345678901" maxLength={12} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            </div>

            {/* Upload CCCD */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Mặt trước CCCD <span style={{ color: 'red' }}>*</span></label>
                <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-hover)' }}
                  onClick={() => document.getElementById('cccd-front').click()}>
                  <div style={{ fontSize: '24px' }}>📄</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{cccdFrontName || 'Chọn ảnh'}</p>
                  <input id="cccd-front" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => setCccdFrontName(e.target.files[0]?.name || '')} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mặt sau CCCD <span style={{ color: 'red' }}>*</span></label>
                <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-hover)' }}
                  onClick={() => document.getElementById('cccd-back').click()}>
                  <div style={{ fontSize: '24px' }}>📄</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{cccdBackName || 'Chọn ảnh'}</p>
                  <input id="cccd-back" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => setCccdBackName(e.target.files[0]?.name || '')} />
                </div>
              </div>
            </div>
          </div>

          {/* === PHẦN 2: Thông tin tài chính === */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionTitleStyle}><span>💳</span> Thông tin tài chính</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6', backgroundColor: 'var(--bg-hover)', padding: '12px 16px', borderRadius: '10px' }}>
              Hệ thống tự động trích 15,5% hoa hồng và chuyển <strong>84,5%</strong> tiền công vào tài khoản của bạn sau mỗi cuốc hoàn thành.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Ngân hàng <span style={{ color: 'red' }}>*</span></label>
              <select style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}>
                <option value="">-- Chọn ngân hàng --</option>
                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Số tài khoản <span style={{ color: 'red' }}>*</span></label>
              <input type="text" placeholder="Nhập số tài khoản" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            </div>

            <div>
              <label style={labelStyle}>Tên chủ tài khoản <span style={{ color: 'red' }}>*</span></label>
              <input type="text" placeholder="Phải khớp với tên trên CCCD" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            </div>
          </div>

          {/* === PHẦN 3: Hồ sơ năng lực === */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionTitleStyle}><span>📋</span> Hồ sơ năng lực</div>

            {/* Avatar */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Ảnh chân dung <span style={{ color: 'red' }}>*</span></label>
              <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-hover)' }}
                onClick={() => document.getElementById('avatar-worker').click()}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{avatarName || 'Chọn ảnh rõ mặt (JPG, PNG)'}</p>
                <input id="avatar-worker" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => setAvatarName(e.target.files[0]?.name || '')} />
              </div>
            </div>

            {/* Chuyên môn */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Danh mục chuyên môn <span style={{ color: 'red' }}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {SPECIALTIES.map(s => (
                  <button type="button" key={s}
                    style={selectedSpecialties.includes(s) ? chipSelected : chipDefault}
                    onClick={() => toggleSpecialty(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Số năm kinh nghiệm */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Số năm kinh nghiệm <span style={{ color: 'red' }}>*</span></label>
              <select style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}>
                <option value="">-- Chọn --</option>
                <option value="1">Dưới 1 năm</option>
                <option value="1">1 năm</option>
                <option value="2">2 năm</option>
                <option value="3">3 năm</option>
                <option value="5">5 năm</option>
                <option value="7">7 năm</option>
                <option value="10">10+ năm</option>
              </select>
            </div>

            {/* Khu vực hoạt động */}
            <div>
              <label style={labelStyle}>Khu vực hoạt động (TP.HCM) <span style={{ color: 'red' }}>*</span></label>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Chọn các quận/huyện bạn muốn nhận việc.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DISTRICTS_HCM.map(d => (
                  <button type="button" key={d}
                    style={selectedDistricts.includes(d) ? chipSelected : chipDefault}
                    onClick={() => toggleDistrict(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '12px', textAlign: 'center' }}>
            Gửi hồ sơ đăng ký
          </button>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px' }}>
            Hồ sơ sẽ được admin duyệt trong vòng 24 giờ. Chúng tôi sẽ liên hệ qua số điện thoại của bạn.
          </p>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Đã có tài khoản?{' '}
          <a href="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Đăng nhập</a>
          {' · '}
          <a href="/register" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Quay lại</a>
        </p>
      </div>
    </main>
  );
}
