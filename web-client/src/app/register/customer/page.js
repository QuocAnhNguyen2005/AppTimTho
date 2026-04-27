"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarName, setAvatarName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on type
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên.';
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^(0[3|5|7|8|9])\d{8}$/.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại không hợp lệ (VD: 0901234567).';
    }
    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          phone_number: formData.phone.trim(),
          password: formData.password,
          address: formData.address.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đã có lỗi xảy ra.');

      setSuccessMsg('🎉 Đăng ký thành công! Đang chuyển về trang đăng nhập...');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '5px', fontWeight: '500' }}>
        ⚠ {fieldErrors[name]}
      </p>
    ) : null;

  const borderColor = (name) =>
    fieldErrors[name] ? '#DC2626' : 'var(--border-color)';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        padding: '48px',
        width: '100%',
        maxWidth: '520px',
        border: '1px solid var(--border-color)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '44px', marginBottom: '12px' }}>🏠</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Tạo tài khoản Khách hàng
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Điền thông tin để bắt đầu tìm thợ sửa chữa uy tín.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errorMsg && (
            <div style={{ padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ❌ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ padding: '12px 16px', backgroundColor: '#D1FAE5', color: '#059669', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
              {successMsg}
            </div>
          )}

          {/* Họ và tên */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nguyễn Văn A"
              style={{ ...inputStyle, borderColor: borderColor('fullName') }}
              onFocus={e => e.target.style.borderColor = fieldErrors.fullName ? '#DC2626' : 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = borderColor('fullName')}
            />
            <FieldError name="fullName" />
          </div>

          {/* Số điện thoại */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="0901234567"
              maxLength={10}
              style={{ ...inputStyle, borderColor: borderColor('phone') }}
              onFocus={e => e.target.style.borderColor = fieldErrors.phone ? '#DC2626' : 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = borderColor('phone')}
            />
            <FieldError name="phone" />
            {!fieldErrors.phone && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
                Dùng làm tên đăng nhập.
              </p>
            )}
          </div>

          {/* Mật khẩu */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tối thiểu 6 ký tự"
                style={{ ...inputStyle, borderColor: borderColor('password'), paddingRight: '48px' }}
                onFocus={e => e.target.style.borderColor = fieldErrors.password ? '#DC2626' : 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = borderColor('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            <FieldError name="password" />
          </div>

          {/* Xác nhận mật khẩu */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                style={{ ...inputStyle, borderColor: borderColor('confirmPassword'), paddingRight: '48px' }}
                onFocus={e => e.target.style.borderColor = fieldErrors.confirmPassword ? '#DC2626' : 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = borderColor('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
              >
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
            <FieldError name="confirmPassword" />
          </div>

          {/* Địa chỉ */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Địa chỉ mặc định{' '}
              <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' }}>(Tùy chọn)</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              📍 Lần sau gọi thợ bạn không cần gõ lại địa chỉ.
            </p>
          </div>

          {/* Avatar */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>
              Ảnh đại diện{' '}
              <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' }}>(Tùy chọn)</span>
            </label>
            <div
              style={{ border: '1.5px dashed var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-hover)', transition: 'border-color 0.2s' }}
              onClick={() => document.getElementById('avatar-upload-customer').click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {avatarName || 'Nhấn để chọn ảnh (JPG, PNG)'}
              </p>
              <input
                id="avatar-upload-customer"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => setAvatarName(e.target.files[0]?.name || '')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMsg}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              borderRadius: '12px',
              textAlign: 'center',
              opacity: (isLoading || !!successMsg) ? 0.7 : 1,
              cursor: (isLoading || !!successMsg) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isLoading ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Đang tạo tài khoản...
              </>
            ) : 'Tạo tài khoản'}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
