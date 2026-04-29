"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SKILLS_ALL = ['Sửa máy lạnh', 'Sửa tủ lạnh', 'Sửa máy giặt', 'Điện nước', 'Sơn nhà', 'Thông tắc'];

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ width: '44px', height: '24px', borderRadius: '20px', backgroundColor: value ? '#4F46E5' : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}>
      <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: value ? '23px' : '3px', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #E5E7EB', marginBottom: '20px', overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6', fontWeight: '800', fontSize: '16px', color: '#111827' }}>{title}</div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

export default function WorkerAccountPage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [tab, setTab] = useState<'PROFILE' | 'BANK' | 'SETTINGS'>('PROFILE');
  const [skills, setSkills] = useState(['Sửa máy lạnh', 'Điện nước']);
  const [bankInfo, setBankInfo] = useState({ bankName: 'Vietcombank', accountNumber: '1012345678', accountHolder: '' });
  const [settings, setSettings] = useState({ loudAlert: true, vibration: true, promoNotifs: false });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try {
      const w = JSON.parse(saved);
      setWorker(w);
      setBankInfo(b => ({ ...b, accountHolder: w.full_name || '' }));
      const online = localStorage.getItem('workerOnline');
      if (online !== null) setIsOnline(online === 'true');
    } catch { router.push('/login'); }
  }, [router]);

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    localStorage.setItem('workerOnline', String(next));
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (!worker) return null;

  const TABS = [
    { key: 'PROFILE', label: 'Hồ sơ hành nghề', icon: '📋' },
    { key: 'BANK', label: 'Tài khoản ngân hàng', icon: '🏦' },
    { key: 'SETTINGS', label: 'Cài đặt', icon: '⚙️' },
  ] as const;

  const ALERT_SOUNDS = ['Chuẩn (Mặc định)', 'Dồn dập (Khẩn cấp)', 'Nhạc chuông to', 'Rung liên tục'];
  const [selectedSound, setSelectedSound] = useState(0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👷</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '4px' }}>Tài khoản thợ</div>
          <div style={{ color: 'white', fontSize: '22px', fontWeight: '800' }}>{worker.full_name}</div>
          <div style={{ color: '#A5B4FC', fontSize: '13px', marginTop: '3px' }}>⭐ 4.8 · 237 đơn hoàn thành</div>
        </div>
        {/* Quick Online Toggle */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isOnline ? '#34D399' : '#9CA3AF' }}>{isOnline ? '🟢 Nhận đơn' : '⚫ Nghỉ'}</div>
          <div onClick={toggleOnline} style={{ width: '44px', height: '24px', borderRadius: '20px', backgroundColor: isOnline ? '#10B981' : '#6B7280', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
            <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: isOnline ? '23px' : '3px', transition: 'all 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '16px 24px', background: 'none', border: 'none', borderBottom: `3px solid ${tab === t.key ? '#4F46E5' : 'transparent'}`, fontWeight: tab === t.key ? '700' : '600', color: tab === t.key ? '#4F46E5' : '#6B7280', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px' }}>

        {/* ── PROFILE TAB ── */}
        {tab === 'PROFILE' && (
          <>
            <Card title="📢 Thông tin Công khai (Khách hàng xem được)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Năm sinh', val: '1990', placeholder: 'VD: 1990' },
                  { label: 'Quê quán', val: 'TP. Hồ Chí Minh', placeholder: 'Tỉnh/Thành phố' },
                  { label: 'Số năm kinh nghiệm', val: '8 năm', placeholder: 'VD: 5 năm' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>{f.label}</label>
                    <input defaultValue={f.val} placeholder={f.placeholder} style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Giới thiệu bản thân</label>
                  <textarea defaultValue="Thợ điện lạnh 8 năm kinh nghiệm, phục vụ tận tâm, giá hợp lý." style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#111827', minHeight: '80px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button onClick={() => alert('Đã lưu!')} style={{ marginTop: '16px', padding: '12px 24px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>💾 Lưu thay đổi</button>
            </Card>

            <Card title="🔒 Hồ sơ Chứng thực (Chỉ Admin kiểm duyệt)">
              <div style={{ backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', border: '1px solid #FDE68A', fontSize: '13px', color: '#92400E', fontWeight: '600' }}>
                ⚠️ Tài liệu này sẽ được Admin kiểm tra. Đảm bảo ảnh rõ nét, không mờ, không bị che khuất.
              </div>
              {[
                { label: '📷 CCCD mặt trước', status: 'verified' },
                { label: '📷 CCCD mặt sau', status: 'verified' },
                { label: '📋 Giấy xác nhận hạnh kiểm', status: 'pending' },
              ].map(doc => (
                <div key={doc.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{doc.label}</div>
                    <div style={{ fontSize: '12px', marginTop: '3px', color: doc.status === 'verified' ? '#059669' : '#D97706', fontWeight: '700' }}>
                      {doc.status === 'verified' ? '✓ Đã xác minh' : '⏳ Đang chờ duyệt'}
                    </div>
                  </div>
                  <button style={{ padding: '8px 16px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Tải lên lại</button>
                </div>
              ))}

              <div style={{ marginTop: '20px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '12px' }}>📜 Bằng cấp / Chứng chỉ nghề</div>
                <div style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', border: '2px dashed #D1D5DB', padding: '24px', textAlign: 'center', cursor: 'pointer' }} onClick={() => alert('Tính năng tải lên đang phát triển!')}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>📎</div>
                  <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '14px' }}>Nhấn để tải lên chứng chỉ mới</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>JPG, PNG, PDF · Tối đa 5MB</div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '12px' }}>🔧 Chuyên môn đăng ký</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SKILLS_ALL.map(skill => {
                    const active = skills.includes(skill);
                    return (
                      <label key={skill} onClick={() => setSkills(s => active ? s.filter(x => x !== skill) : [...s, skill])} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: `1.5px solid ${active ? '#4F46E5' : '#E5E7EB'}`, backgroundColor: active ? '#EEF2FF' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${active ? '#4F46E5' : '#D1D5DB'}`, backgroundColor: active ? '#4F46E5' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {active && <span style={{ color: 'white', fontSize: '12px', fontWeight: '900' }}>✓</span>}
                        </div>
                        <span style={{ fontWeight: active ? '700' : '500', color: active ? '#3730A3' : '#374151', fontSize: '14px' }}>{skill}</span>
                        {active && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#059669', fontWeight: '700', backgroundColor: '#D1FAE5', padding: '3px 8px', borderRadius: '20px' }}>Đã đăng ký</span>}
                      </label>
                    );
                  })}
                </div>
                <button onClick={() => alert('Đã gửi yêu cầu mở rộng chuyên môn!')} style={{ marginTop: '16px', width: '100%', padding: '13px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Gửi yêu cầu xét duyệt chuyên môn</button>
              </div>
            </Card>
          </>
        )}

        {/* ── BANK TAB ── */}
        {tab === 'BANK' && (
          <Card title="🏦 Tài khoản ngân hàng nhận tiền công">
            <div style={{ backgroundColor: '#EEF2FF', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '1px solid #C7D2FE', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px' }}>🔐</span>
              <div style={{ fontSize: '13px', color: '#4338CA', fontWeight: '600' }}>
                Thông tin ngân hàng được mã hóa và bảo mật tuyệt đối. <strong>Tên chủ tài khoản phải khớp với CCCD</strong> đã đăng ký.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Ngân hàng', key: 'bankName', placeholder: 'VD: Vietcombank, Techcombank...' },
                { label: 'Số tài khoản', key: 'accountNumber', placeholder: 'Nhập số tài khoản' },
                { label: 'Tên chủ tài khoản (Viết hoa không dấu)', key: 'accountHolder', placeholder: 'VD: NGUYEN VAN A' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>{f.label}</label>
                  <input
                    value={(bankInfo as any)[f.key]}
                    onChange={e => setBankInfo(b => ({ ...b, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => alert('Đã lưu thông tin ngân hàng!')} style={{ marginTop: '24px', width: '100%', padding: '14px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16,185,129,0.2)' }}>
              💾 Lưu thông tin ngân hàng
            </button>

            <div style={{ marginTop: '20px', backgroundColor: '#F9FAFB', borderRadius: '14px', padding: '16px 20px', border: '1px solid #E5E7EB' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#374151', marginBottom: '12px' }}>📤 Lịch sử rút tiền gần đây</div>
              {[
                { date: '28/04/2026', amount: '2.500.000đ', bank: 'Vietcombank', status: 'Hoàn thành', color: '#059669' },
                { date: '15/04/2026', amount: '1.800.000đ', bank: 'Vietcombank', status: 'Hoàn thành', color: '#059669' },
                { date: '29/04/2026', amount: '1.000.000đ', bank: 'Vietcombank', status: 'Đang xử lý', color: '#D97706' },
              ].map((tx, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: i > 0 ? '1px solid #F3F4F6' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>Rút về {tx.bank}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{tx.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#EF4444' }}>-{tx.amount}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: tx.color }}>{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'SETTINGS' && (
          <>
            <Card title="🔔 Âm báo nhận đơn (Quan trọng)">
              <div style={{ backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', border: '1px solid #FDE68A', fontSize: '13px', color: '#92400E', fontWeight: '600' }}>
                💡 Chọn âm báo to và rõ để không bỏ lỡ đơn hàng khi bạn đang di chuyển hoặc làm việc ồn ào.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {ALERT_SOUNDS.map((sound, i) => (
                  <div key={i} onClick={() => setSelectedSound(i)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '12px', border: `2px solid ${selectedSound === i ? '#4F46E5' : '#E5E7EB'}`, backgroundColor: selectedSound === i ? '#EEF2FF' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `3px solid ${selectedSound === i ? '#4F46E5' : '#D1D5DB'}`, backgroundColor: selectedSound === i ? '#4F46E5' : 'white', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: selectedSound === i ? '700' : '500', color: selectedSound === i ? '#3730A3' : '#374151', fontSize: '14px' }}>
                        {i === 1 ? '🚨 ' : i === 2 ? '🔊 ' : i === 3 ? '📳 ' : '🔔 '}{sound}
                      </div>
                    </div>
                    {selectedSound === i && <span style={{ marginLeft: 'auto', fontSize: '11px', backgroundColor: '#4F46E5', color: 'white', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>Đang dùng</span>}
                  </div>
                ))}
              </div>
              {[
                { key: 'loudAlert', label: 'Bật chế độ âm lượng tối đa', desc: 'Ghi đè cài đặt âm lượng của điện thoại' },
                { key: 'vibration', label: 'Rung kèm âm báo', desc: 'Hữu ích khi trong môi trường ồn ào' },
              ].map(s => (
                <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #F3F4F6' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827', marginBottom: '2px' }}>{s.label}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{s.desc}</div>
                  </div>
                  <Toggle value={(settings as any)[s.key]} onChange={() => setSettings(p => ({ ...p, [s.key]: !(p as any)[s.key] }))} />
                </div>
              ))}
            </Card>

            <Card title="🔒 Bảo mật">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => alert('Tính năng đổi mật khẩu đang phát triển!')} style={{ padding: '14px 20px', backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', color: '#374151', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🔑 Đổi mật khẩu</span><span style={{ color: '#9CA3AF' }}>→</span>
                </button>
              </div>
            </Card>

            <button onClick={handleLogout} style={{ width: '100%', padding: '16px', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1.5px solid #FECACA', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              🚪 Đăng xuất
            </button>
          </>
        )}
      </div>
    </div>
  );
}
