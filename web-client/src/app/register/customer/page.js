/**
 * @file register/customer/page.js - Form đăng ký Khách hàng
 * @route /register/customer
 * @directive "use client" - Cần thiết vì dùng useState để lưu tên file ảnh đại diện
 * @description Form đăng ký tài khoản dành riêng cho Khách hàng (người có nhu cầu tìm thợ).
 * Các trường thông tin:
 *  - Họ và tên (bắt buộc)
 *  - Số điện thoại (bắt buộc) - dùng làm username + nhận OTP
 *  - Mật khẩu + Xác nhận mật khẩu (bắt buộc)
 *  - Địa chỉ mặc định (tùy chọn) - lưu để tái sử dụng khi gọi thợ
 *  - Ảnh đại diện (tùy chọn) - upload file ảnh
 * @note Đã kết nối API `POST /api/auth/register/customer`.
 */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @constant inputStyle
 * @description Style dùng chung cho tất cả thẻ <input> và <select> trong form.
 * Border sẽ đổi màu accent-primary khi focus (xử lý qua onFocus/onBlur).
 */
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

/**
 * @constant labelStyle
 * @description Style dùng chung cho các thẻ <label> trong form.
 */
const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '8px',
};

/**
 * @component CustomerRegisterPage
 * @description Form đăng ký cho Khách hàng với các trường thông tin cá nhân.
 * State avatarName: lưu tên file ảnh vừa chọn để hiển thị trong vùng upload.
 */
export default function CustomerRegisterPage() {
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /** @type {string} avatarName - Tên file ảnh đại diện đã chọn (chỉ để hiển thị UI, chưa upload thật) */
  const [avatarName, setAvatarName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    if (!password || password.length < 8 || password.length > 16) return false;
    if (!/[A-Z]/.test(password)) return false;
    const digitCount = (password.match(/\d/g) || []).length;
    if (digitCount < 4) return false;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMsg('Mật khẩu phải từ 8-16 ký tự, gồm ít nhất 1 chữ hoa, 4 chữ số và 1 ký tự đặc biệt.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone_number: formData.phone,
          password: formData.password,
          address: formData.address
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đã có lỗi xảy ra');
      }

      setSuccessMsg('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        padding: '48px',
        width: '100%',
        maxWidth: '520px',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Tạo tài khoản Khách hàng
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Điền thông tin để bắt đầu tìm thợ sửa chữa uy tín.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#059669', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>
              {successMsg}
            </div>
          )}

          {/* Họ và tên */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>

          {/* Số điện thoại */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0909 xxx xxx" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Dùng làm tên đăng nhập và nhận mã OTP xác thực.
            </p>
          </div>

          {/* Mật khẩu */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Tối thiểu 8 ký tự" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>

          {/* Xác nhận mật khẩu */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span></label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Nhập lại mật khẩu" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>

          {/* Địa chỉ */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Địa chỉ mặc định <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' }}>(Tùy chọn)</span></label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              📍 Lần sau gọi thợ bạn không cần gõ lại địa chỉ.
            </p>
          </div>

          {/* Avatar */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Ảnh đại diện <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' }}>(Tùy chọn)</span></label>
            <div style={{
              border: '1.5px dashed var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-hover)',
              transition: 'border-color 0.2s'
            }}
              onClick={() => document.getElementById('avatar-upload-customer').click()}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {avatarName || 'Nhấn để chọn ảnh (JPG, PNG)'}
              </p>
              <input id="avatar-upload-customer" type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => setAvatarName(e.target.files[0]?.name || '')} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '12px', textAlign: 'center' }}>
            Tạo tài khoản
          </button>
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
