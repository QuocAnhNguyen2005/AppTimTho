"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: '12px',
  border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' };
const sectionTitleStyle = { fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' };

const SPECIALTIES = ['Điện lạnh', 'Sửa ống nước', 'Sửa PC / Điện tử', 'Điện gia dụng', 'Mộc & Nội thất', 'Vệ sinh công nghiệp', 'Sửa khóa', 'Khác'];
const BANKS = ['Vietcombank', 'MB Bank', 'Techcombank', 'Agribank', 'BIDV', 'VietinBank', 'ACB', 'TPBank', 'SHB', 'VPBank', 'Sacombank'];
const DISTRICTS_HCM = ['Quận 1','Quận 3','Quận 4','Quận 5','Quận 6','Quận 7','Quận 8','Quận 10','Quận 11','Quận 12','Bình Thạnh','Gò Vấp','Phú Nhuận','Tân Bình','Tân Phú','Bình Tân','Thủ Đức','Bình Chánh','Hóc Môn','Nhà Bè','Cần Giờ','Củ Chi'];

export default function WorkerRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '', dateOfBirth: '', phone: '', password: '', confirmPassword: '',
    identityCard: '', bankName: '', bankAccountNumber: '', bankAccountName: '', experienceYears: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const [cccdFront, setCccdFront] = useState('');
  const [cccdBack, setCccdBack] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = 'Vui lòng nhập họ và tên.';
    if (!formData.dateOfBirth) err.dateOfBirth = 'Vui lòng chọn ngày sinh.';
    if (!formData.phone.trim()) err.phone = 'Vui lòng nhập số điện thoại.';
    else if (!/^(0[3|5|7|8|9])\d{8}$/.test(formData.phone.trim())) err.phone = 'Số điện thoại không hợp lệ.';
    if (!formData.password) err.password = 'Vui lòng nhập mật khẩu.';
    else if (formData.password.length < 6) err.password = 'Mật khẩu tối thiểu 6 ký tự.';
    if (formData.password !== formData.confirmPassword) err.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    if (!formData.identityCard.trim()) err.identityCard = 'Vui lòng nhập số CCCD.';
    else if (!/^\d{12}$/.test(formData.identityCard.trim())) err.identityCard = 'CCCD phải gồm đúng 12 chữ số.';
    if (!formData.bankName) err.bankName = 'Vui lòng chọn ngân hàng.';
    if (!formData.bankAccountNumber.trim()) err.bankAccountNumber = 'Vui lòng nhập số tài khoản.';
    if (!formData.bankAccountName.trim()) err.bankAccountName = 'Vui lòng nhập tên chủ tài khoản.';
    if (selectedSpecialties.length === 0) err.specialties = 'Vui lòng chọn ít nhất 1 chuyên môn.';
    if (!formData.experienceYears) err.experienceYears = 'Vui lòng chọn số năm kinh nghiệm.';
    if (selectedDistricts.length === 0) err.districts = 'Vui lòng chọn ít nhất 1 khu vực.';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          phone_number: formData.phone.trim(),
          password: formData.password,
          date_of_birth: formData.dateOfBirth,
          identity_card: formData.identityCard.trim(),
          cccd_front_url: cccdFront,
          cccd_back_url: cccdBack,
          bank_name: formData.bankName,
          bank_account_number: formData.bankAccountNumber.trim(),
          bank_account_name: formData.bankAccountName.trim(),
          specialties: selectedSpecialties,
          experience_years: formData.experienceYears,
          districts_active: selectedDistricts,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đã có lỗi xảy ra.');
      setSuccessMsg('✅ Gửi hồ sơ thành công! Admin sẽ duyệt trong 24 giờ.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  const FieldError = ({ name }) => fieldErrors[name] ? <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '5px', fontWeight: '500' }}>⚠ {fieldErrors[name]}</p> : null;
  const bc = (name) => fieldErrors[name] ? '#DC2626' : 'var(--border-color)';
  const chipStyle = (selected) => ({ padding: '8px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: `2px solid ${selected ? 'var(--accent-primary)' : 'var(--border-color)'}`, backgroundColor: selected ? 'var(--accent-primary)' : 'var(--bg-primary)', color: selected ? 'white' : 'var(--text-primary)', transition: 'all 0.15s' });

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.10)', padding: '48px', width: '100%', maxWidth: '620px', border: '1px solid var(--border-color)', marginTop: '16px' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '44px', marginBottom: '12px' }}>🔧</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>Tạo hồ sơ Thợ</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Điền đầy đủ thông tin để được duyệt hồ sơ nhanh nhất.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errorMsg && <div style={{ padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>❌ {errorMsg}</div>}
          {successMsg && <div style={{ padding: '12px 16px', backgroundColor: '#D1FAE5', color: '#059669', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>{successMsg}</div>}

          {/* PHẦN 1 */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionTitleStyle}><span>👤</span> Thông tin định danh</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nguyễn Văn A"
                  style={{ ...inputStyle, borderColor: bc('fullName') }}
                  onFocus={e => e.target.style.borderColor = bc('fullName') === '#DC2626' ? '#DC2626' : 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = bc('fullName')} />
                <FieldError name="fullName" />
              </div>
              <div>
                <label style={labelStyle}>Ngày sinh <span style={{ color: 'red' }}>*</span></label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                  style={{ ...inputStyle, borderColor: bc('dateOfBirth') }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = bc('dateOfBirth')} />
                <FieldError name="dateOfBirth" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0901234567" maxLength={10}
                style={{ ...inputStyle, borderColor: bc('phone') }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = bc('phone')} />
              <FieldError name="phone" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Tối thiểu 6 ký tự"
                    style={{ ...inputStyle, borderColor: bc('password'), paddingRight: '48px' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={e => e.target.style.borderColor = bc('password')} />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px' }}>{showPass ? '🙈' : '👁'}</button>
                </div>
                <FieldError name="password" />
              </div>
              <div>
                <label style={labelStyle}>Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu"
                    style={{ ...inputStyle, borderColor: bc('confirmPassword'), paddingRight: '48px' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={e => e.target.style.borderColor = bc('confirmPassword')} />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px' }}>{showConfirm ? '🙈' : '👁'}</button>
                </div>
                <FieldError name="confirmPassword" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Số CCCD <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="identityCard" value={formData.identityCard} onChange={handleChange} placeholder="012345678901" maxLength={12}
                style={{ ...inputStyle, borderColor: bc('identityCard') }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = bc('identityCard')} />
              <FieldError name="identityCard" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[{ id: 'cccd-front', label: 'Mặt trước CCCD', val: cccdFront, set: setCccdFront },
                { id: 'cccd-back', label: 'Mặt sau CCCD', val: cccdBack, set: setCccdBack }].map(({ id, label, val, set }) => (
                <div key={id}>
                  <label style={labelStyle}>{label} <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-hover)' }}
                    onClick={() => document.getElementById(id).click()}>
                    <div style={{ fontSize: '24px' }}>📄</div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{val || 'Chọn ảnh'}</p>
                    <input id={id} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => set(e.target.files[0]?.name || '')} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN 2 */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionTitleStyle}><span>💳</span> Thông tin tài chính</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6', backgroundColor: 'var(--bg-hover)', padding: '12px 16px', borderRadius: '10px' }}>
              Hệ thống tự động trích 15,5% hoa hồng và chuyển <strong>84,5%</strong> tiền công vào tài khoản của bạn sau mỗi cuốc hoàn thành.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Ngân hàng <span style={{ color: 'red' }}>*</span></label>
              <select name="bankName" value={formData.bankName} onChange={handleChange}
                style={{ ...inputStyle, appearance: 'none', borderColor: bc('bankName') }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = bc('bankName')}>
                <option value="">-- Chọn ngân hàng --</option>
                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <FieldError name="bankName" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Số tài khoản <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} placeholder="Nhập số tài khoản"
                  style={{ ...inputStyle, borderColor: bc('bankAccountNumber') }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = bc('bankAccountNumber')} />
                <FieldError name="bankAccountNumber" />
              </div>
              <div>
                <label style={labelStyle}>Tên chủ tài khoản <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="bankAccountName" value={formData.bankAccountName} onChange={handleChange} placeholder="Phải khớp tên CCCD"
                  style={{ ...inputStyle, borderColor: bc('bankAccountName') }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = bc('bankAccountName')} />
                <FieldError name="bankAccountName" />
              </div>
            </div>
          </div>

          {/* PHẦN 3 */}
          <div style={{ marginBottom: '32px' }}>
            <div style={sectionTitleStyle}><span>📋</span> Hồ sơ năng lực</div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Ảnh chân dung <span style={{ color: 'red' }}>*</span></label>
              <div style={{ border: '1.5px dashed var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-hover)' }}
                onClick={() => document.getElementById('avatar-worker').click()}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{avatarName || 'Chọn ảnh rõ mặt (JPG, PNG)'}</p>
                <input id="avatar-worker" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setAvatarName(e.target.files[0]?.name || '')} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Chuyên môn <span style={{ color: 'red' }}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {SPECIALTIES.map(s => (
                  <button type="button" key={s} style={chipStyle(selectedSpecialties.includes(s))} onClick={() => toggle(selectedSpecialties, setSelectedSpecialties, s)}>{s}</button>
                ))}
              </div>
              <FieldError name="specialties" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Số năm kinh nghiệm <span style={{ color: 'red' }}>*</span></label>
              <select name="experienceYears" value={formData.experienceYears} onChange={handleChange}
                style={{ ...inputStyle, appearance: 'none', borderColor: bc('experienceYears') }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = bc('experienceYears')}>
                <option value="">-- Chọn --</option>
                <option value="0">Dưới 1 năm</option>
                <option value="1">1 năm</option>
                <option value="2">2 năm</option>
                <option value="3">3 năm</option>
                <option value="5">5 năm</option>
                <option value="7">7 năm</option>
                <option value="10">10+ năm</option>
              </select>
              <FieldError name="experienceYears" />
            </div>

            <div>
              <label style={labelStyle}>Khu vực hoạt động (TP.HCM) <span style={{ color: 'red' }}>*</span></label>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Chọn các quận/huyện bạn muốn nhận việc.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DISTRICTS_HCM.map(d => (
                  <button type="button" key={d} style={chipStyle(selectedDistricts.includes(d))} onClick={() => toggle(selectedDistricts, setSelectedDistricts, d)}>{d}</button>
                ))}
              </div>
              <FieldError name="districts" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMsg}
            className="btn-primary"
            style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '12px', textAlign: 'center', opacity: (isLoading || !!successMsg) ? 0.7 : 1, cursor: (isLoading || !!successMsg) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLoading ? (
              <><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Đang gửi hồ sơ...</>
            ) : 'Gửi hồ sơ đăng ký'}
          </button>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px' }}>
            Hồ sơ sẽ được admin duyệt trong 24 giờ. Chúng tôi liên hệ qua SĐT của bạn.
          </p>
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
