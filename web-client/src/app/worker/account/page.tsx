"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SKILLS_ALL = ['Sửa máy lạnh','Sửa tủ lạnh','Sửa máy giặt','Điện nước','Sơn nhà','Thông tắc'];
const ALERT_SOUNDS = ['Chuẩn (Mặc định)','Dồn dập (Khẩn cấp)','Nhạc chuông to','Rung liên tục'];

export default function WorkerAccountPage() {
  const router = useRouter();
  // ALL hooks at top level - no conditional hooks
  const [worker, setWorker] = useState<any>(null);
  const [tab, setTab] = useState<'PROFILE'|'BANK'|'SETTINGS'>('PROFILE');
  const [skills, setSkills] = useState(['Sửa máy lạnh','Điện nước']);
  const [bankInfo, setBankInfo] = useState({ bankName:'Vietcombank', accountNumber:'1012345678', accountHolder:'' });
  const [settings, setSettings] = useState({ loudAlert:true, vibration:true });
  const [isOnline, setIsOnline] = useState(true);
  const [selectedSound, setSelectedSound] = useState(0);
  const [profileForm, setProfileForm] = useState({ birthYear:'1990', hometown:'TP. Hồ Chí Minh', experience:'8 năm', bio:'Thợ điện lạnh 8 năm kinh nghiệm, phục vụ tận tâm.' });

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

  const handleLogout = () => { localStorage.clear(); router.push('/login'); };

  if (!worker) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Đang tải...</div>;

  const TABS = [
    { key:'PROFILE' as const, label:'Hồ sơ hành nghề', icon:'📋' },
    { key:'BANK' as const, label:'Tài khoản ngân hàng', icon:'🏦' },
    { key:'SETTINGS' as const, label:'Cài đặt', icon:'⚙️' },
  ];

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F9FAFB' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)', padding:'28px 32px', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'16px', backgroundColor:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', flexShrink:0 }}>👷</div>
        <div style={{ flex:1 }}>
          <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', marginBottom:'4px' }}>Tài khoản thợ</div>
          <div style={{ color:'white', fontSize:'22px', fontWeight:'800' }}>{worker.full_name}</div>
          <div style={{ color:'#A5B4FC', fontSize:'13px', marginTop:'3px' }}>⭐ 4.8 · 237 đơn hoàn thành</div>
        </div>
        <div style={{ backgroundColor:'rgba(255,255,255,0.1)', borderRadius:'14px', padding:'12px 18px', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ fontSize:'13px', fontWeight:'700', color: isOnline ? '#34D399':'#9CA3AF' }}>{isOnline ? '🟢 Nhận đơn':'⚫ Nghỉ'}</div>
          <div onClick={toggleOnline} style={{ width:'44px', height:'24px', borderRadius:'20px', backgroundColor: isOnline ? '#10B981':'#6B7280', position:'relative', cursor:'pointer', transition:'all 0.3s' }}>
            <div style={{ width:'18px', height:'18px', backgroundColor:'white', borderRadius:'50%', position:'absolute', top:'3px', left: isOnline ? '23px':'3px', transition:'all 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor:'white', borderBottom:'1px solid #E5E7EB', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding:'16px 24px', background:'none', border:'none', borderBottom:`3px solid ${tab===t.key ? '#4F46E5':'transparent'}`, fontWeight: tab===t.key ? '700':'600', color: tab===t.key ? '#4F46E5':'#6B7280', fontSize:'14px', cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'32px', maxWidth:'900px', margin:'0 auto' }}>

        {/* PROFILE TAB */}
        {tab === 'PROFILE' && (
          <div>
            {/* Public Info */}
            <div style={{ backgroundColor:'white', borderRadius:'20px', border:'1px solid #E5E7EB', marginBottom:'20px', overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid #F3F4F6', fontWeight:'800', fontSize:'16px', color:'#111827' }}>📢 Thông tin Công khai</div>
              <div style={{ padding:'24px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  {[
                    { label:'Họ và tên', val:worker.full_name, key:'name', readOnly:true },
                    { label:'Số điện thoại', val:worker.phone||'Chưa cập nhật', key:'phone', readOnly:true },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#6B7280', textTransform:'uppercase', marginBottom:'8px' }}>{f.label}</label>
                      <input defaultValue={f.val} readOnly={f.readOnly} style={{ width:'100%', padding:'12px 14px', borderRadius:'10px', border:'1.5px solid #E5E7EB', backgroundColor:'#F9FAFB', fontSize:'14px', color:'#374151', boxSizing:'border-box' }} />
                    </div>
                  ))}
                  {[
                    { label:'Năm sinh', key:'birthYear' },
                    { label:'Quê quán', key:'hometown' },
                    { label:'Số năm kinh nghiệm', key:'experience' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#6B7280', textTransform:'uppercase', marginBottom:'8px' }}>{f.label}</label>
                      <input value={(profileForm as any)[f.key]} onChange={e => setProfileForm(p => ({...p, [f.key]: e.target.value}))} style={{ width:'100%', padding:'12px 14px', borderRadius:'10px', border:'1.5px solid #E5E7EB', fontSize:'14px', color:'#111827', outline:'none', boxSizing:'border-box' }} />
                    </div>
                  ))}
                  <div style={{ gridColumn:'1 / -1' }}>
                    <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#6B7280', textTransform:'uppercase', marginBottom:'8px' }}>Giới thiệu bản thân</label>
                    <textarea value={profileForm.bio} onChange={e => setProfileForm(p => ({...p, bio: e.target.value}))} style={{ width:'100%', padding:'12px 14px', borderRadius:'10px', border:'1.5px solid #E5E7EB', fontSize:'14px', color:'#111827', minHeight:'100px', resize:'vertical', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
                  </div>
                </div>
                <button onClick={() => alert('Đã lưu!')} style={{ marginTop:'16px', padding:'12px 24px', backgroundColor:'#4F46E5', color:'white', border:'none', borderRadius:'10px', fontWeight:'700', cursor:'pointer' }}>💾 Lưu thông tin</button>
              </div>
            </div>

            {/* Verified Docs (eKYC) */}
            <div style={{ backgroundColor:'white', borderRadius:'20px', border:'1px solid #E5E7EB', marginBottom:'20px', overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid #F3F4F6', fontWeight:'800', fontSize:'16px', color:'#111827', display: 'flex', justifyContent: 'space-between' }}>
                <span>🔒 Xác thực danh tính (eKYC)</span>
                <span style={{ fontSize: '12px', color: '#10B981', backgroundColor: '#D1FAE5', padding: '4px 10px', borderRadius: '12px' }}>Đã phê duyệt</span>
              </div>
              <div style={{ padding:'24px' }}>
                <div style={{ backgroundColor:'#FEF3C7', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', border:'1px solid #FDE68A', fontSize:'13px', color:'#92400E', fontWeight:'600' }}>
                  ⚠️ Tài liệu cần rõ nét, không bị lóa. Admin sử dụng căn cứ này để xét duyệt cho phép bạn nhận đơn trên ứng dụng.
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { label:'Mặt trước CCCD', img: 'https://placehold.co/300x190?text=CCCD+Mat+Truoc' },
                    { label:'Mặt sau CCCD', img: 'https://placehold.co/300x190?text=CCCD+Mat+Sau' },
                    { label:'Ảnh chân dung (Selfie)', img: 'https://placehold.co/300x300?text=Selfie' },
                  ].map(doc => (
                    <div key={doc.label} style={{ display:'flex', flexDirection:'column', gap: '8px', padding:'16px', border: '1px solid #E5E7EB', borderRadius: '16px', backgroundColor: '#F9FAFB' }}>
                      <div style={{ fontWeight:'700', fontSize:'14px', color:'#111827', textAlign: 'center' }}>{doc.label}</div>
                      <img src={doc.img} alt={doc.label} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #D1D5DB' }} />
                      <button style={{ marginTop: '8px', padding:'8px', width: '100%', backgroundColor:'white', border:'1px solid #D1D5DB', borderRadius:'8px', fontWeight:'600', fontSize:'13px', cursor:'pointer', color:'#374151' }}>
                        Tải ảnh khác
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:'20px' }}>
                  <div style={{ fontWeight:'700', fontSize:'15px', color:'#111827', marginBottom:'12px' }}>📜 Bằng cấp / Chứng chỉ nghề</div>
                  <div style={{ backgroundColor:'#F9FAFB', borderRadius:'12px', border:'2px dashed #D1D5DB', padding:'24px', textAlign:'center', cursor:'pointer' }} onClick={() => alert('Tính năng tải lên đang phát triển!')}>
                    <div style={{ fontSize:'28px', marginBottom:'8px' }}>📎</div>
                    <div style={{ fontWeight:'600', color:'#6B7280', fontSize:'14px' }}>Nhấn để tải lên chứng chỉ</div>
                    <div style={{ fontSize:'12px', color:'#9CA3AF', marginTop:'4px' }}>JPG, PNG, PDF · Tối đa 5MB</div>
                  </div>
                </div>

                <div style={{ marginTop:'20px' }}>
                  <div style={{ fontWeight:'700', fontSize:'15px', color:'#111827', marginBottom:'8px' }}>🔧 Chuyên môn đăng ký nhận đơn</div>
                  <div style={{ fontSize:'13px', color:'#6B7280', marginBottom:'14px' }}>Muốn mở rộng hạng mục mới cần nộp chứng chỉ để Admin xét duyệt.</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {SKILLS_ALL.map(skill => {
                      const active = skills.includes(skill);
                      return (
                        <div key={skill} onClick={() => setSkills(s => active ? s.filter(x => x!==skill) : [...s, skill])} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', borderRadius:'12px', border:`1.5px solid ${active ? '#4F46E5':'#E5E7EB'}`, backgroundColor: active ? '#EEF2FF':'white', cursor:'pointer', transition:'all 0.2s' }}>
                          <div style={{ width:'20px', height:'20px', borderRadius:'5px', border:`2px solid ${active ? '#4F46E5':'#D1D5DB'}`, backgroundColor: active ? '#4F46E5':'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            {active && <span style={{ color:'white', fontSize:'12px', fontWeight:'900' }}>✓</span>}
                          </div>
                          <span style={{ fontWeight: active ? '700':'500', color: active ? '#3730A3':'#374151', fontSize:'14px' }}>{skill}</span>
                          {active && <span style={{ marginLeft:'auto', fontSize:'11px', color:'#059669', fontWeight:'700', backgroundColor:'#D1FAE5', padding:'3px 8px', borderRadius:'20px' }}>Đang nhận</span>}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => alert('Đã gửi yêu cầu!')} style={{ marginTop:'16px', width:'100%', padding:'13px', backgroundColor:'#4F46E5', color:'white', border:'none', borderRadius:'12px', fontWeight:'700', cursor:'pointer' }}>Gửi yêu cầu mở rộng chuyên môn</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANK TAB */}
        {tab === 'BANK' && (
          <div style={{ backgroundColor:'white', borderRadius:'20px', border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #F3F4F6', fontWeight:'800', fontSize:'16px', color:'#111827' }}>🏦 Tài khoản ngân hàng nhận tiền công</div>
            <div style={{ padding:'24px' }}>
              <div style={{ backgroundColor:'#EEF2FF', borderRadius:'14px', padding:'16px 20px', marginBottom:'24px', border:'1px solid #C7D2FE', display:'flex', gap:'12px' }}>
                <span style={{ fontSize:'20px' }}>🔐</span>
                <div style={{ fontSize:'13px', color:'#4338CA', fontWeight:'600' }}>Thông tin được mã hóa bảo mật. <strong>Tên chủ tài khoản phải khớp với CCCD</strong> đã đăng ký.</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {[
                  { label:'Ngân hàng', key:'bankName', placeholder:'VD: Vietcombank, Techcombank...' },
                  { label:'Số tài khoản', key:'accountNumber', placeholder:'Nhập số tài khoản' },
                  { label:'Tên chủ tài khoản (viết hoa, không dấu)', key:'accountHolder', placeholder:'VD: NGUYEN VAN A' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#6B7280', textTransform:'uppercase', marginBottom:'8px' }}>{f.label}</label>
                    <input value={(bankInfo as any)[f.key]} onChange={e => setBankInfo(b => ({...b, [f.key]: e.target.value}))} placeholder={f.placeholder} style={{ width:'100%', padding:'14px 16px', borderRadius:'12px', border:'1.5px solid #E5E7EB', fontSize:'15px', fontWeight:'600', color:'#111827', outline:'none', boxSizing:'border-box' }} />
                  </div>
                ))}
              </div>
              <button onClick={() => alert('Đã lưu!')} style={{ marginTop:'24px', width:'100%', padding:'14px', backgroundColor:'#10B981', color:'white', border:'none', borderRadius:'12px', fontWeight:'700', fontSize:'15px', cursor:'pointer' }}>💾 Lưu thông tin ngân hàng</button>

              <div style={{ marginTop:'24px', backgroundColor:'#F9FAFB', borderRadius:'14px', padding:'20px', border:'1px solid #E5E7EB' }}>
                <div style={{ fontWeight:'700', fontSize:'14px', color:'#374151', marginBottom:'14px' }}>📤 Lịch sử rút tiền</div>
                {[
                  { date:'28/04/2026', amount:'2.500.000đ', status:'Hoàn thành', color:'#059669' },
                  { date:'15/04/2026', amount:'1.800.000đ', status:'Hoàn thành', color:'#059669' },
                  { date:'29/04/2026', amount:'1.000.000đ', status:'Đang xử lý', color:'#D97706' },
                ].map((tx, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderTop: i>0 ? '1px solid #F3F4F6':'none' }}>
                    <div>
                      <div style={{ fontWeight:'600', fontSize:'14px', color:'#111827' }}>Rút về {bankInfo.bankName}</div>
                      <div style={{ fontSize:'12px', color:'#9CA3AF' }}>{tx.date}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:'800', fontSize:'15px', color:'#EF4444' }}>-{tx.amount}</div>
                      <div style={{ fontSize:'12px', fontWeight:'700', color:tx.color }}>{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'SETTINGS' && (
          <div>
            <div style={{ backgroundColor:'white', borderRadius:'20px', border:'1px solid #E5E7EB', marginBottom:'20px', overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid #F3F4F6', fontWeight:'800', fontSize:'16px', color:'#111827' }}>🔔 Âm báo nhận đơn</div>
              <div style={{ padding:'24px' }}>
                <div style={{ backgroundColor:'#FFFBEB', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', border:'1px solid #FDE68A', fontSize:'13px', color:'#92400E', fontWeight:'600' }}>
                  💡 Chọn âm báo to và rõ để không bỏ lỡ đơn hàng khi đang di chuyển hoặc làm việc ồn ào.
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }}>
                  {ALERT_SOUNDS.map((sound, i) => (
                    <div key={i} onClick={() => setSelectedSound(i)} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 18px', borderRadius:'12px', border:`2px solid ${selectedSound===i ? '#4F46E5':'#E5E7EB'}`, backgroundColor: selectedSound===i ? '#EEF2FF':'white', cursor:'pointer', transition:'all 0.2s' }}>
                      <div style={{ width:'20px', height:'20px', borderRadius:'50%', border:`3px solid ${selectedSound===i ? '#4F46E5':'#D1D5DB'}`, backgroundColor: selectedSound===i ? '#4F46E5':'white', flexShrink:0 }} />
                      <span style={{ fontWeight: selectedSound===i ? '700':'500', color: selectedSound===i ? '#3730A3':'#374151', fontSize:'14px' }}>
                        {['🔔 ','🚨 ','🔊 ','📳 '][i]}{sound}
                      </span>
                      {selectedSound===i && <span style={{ marginLeft:'auto', fontSize:'11px', backgroundColor:'#4F46E5', color:'white', padding:'3px 10px', borderRadius:'20px', fontWeight:'700' }}>Đang dùng</span>}
                    </div>
                  ))}
                </div>
                {[
                  { key:'loudAlert', label:'Âm lượng tối đa', desc:'Ghi đè cài đặt âm lượng điện thoại' },
                  { key:'vibration', label:'Rung kèm âm báo', desc:'Hữu ích khi trong môi trường ồn ào' },
                ].map(s => (
                  <div key={s.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderTop:'1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontWeight:'700', fontSize:'14px', color:'#111827', marginBottom:'2px' }}>{s.label}</div>
                      <div style={{ fontSize:'12px', color:'#6B7280' }}>{s.desc}</div>
                    </div>
                    <div onClick={() => setSettings(p => ({...p, [s.key]:!(p as any)[s.key]}))} style={{ width:'44px', height:'24px', borderRadius:'20px', backgroundColor:(settings as any)[s.key] ? '#4F46E5':'#D1D5DB', position:'relative', cursor:'pointer', transition:'all 0.3s', flexShrink:0 }}>
                      <div style={{ width:'18px', height:'18px', backgroundColor:'white', borderRadius:'50%', position:'absolute', top:'3px', left:(settings as any)[s.key] ? '23px':'3px', transition:'all 0.3s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor:'white', borderRadius:'20px', border:'1px solid #E5E7EB', marginBottom:'20px', overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid #F3F4F6', fontWeight:'800', fontSize:'16px', color:'#111827' }}>🔒 Bảo mật</div>
              <div style={{ padding:'24px' }}>
                <button onClick={() => alert('Tính năng đang phát triển!')} style={{ width:'100%', padding:'14px 20px', backgroundColor:'#F9FAFB', border:'1.5px solid #E5E7EB', borderRadius:'12px', fontWeight:'600', fontSize:'15px', cursor:'pointer', color:'#374151', textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span>🔑 Đổi mật khẩu</span><span style={{ color:'#9CA3AF' }}>→</span>
                </button>
              </div>
            </div>

            <button onClick={handleLogout} style={{ width:'100%', padding:'16px', backgroundColor:'#FEF2F2', color:'#EF4444', border:'1.5px solid #FECACA', borderRadius:'16px', fontWeight:'700', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
              🚪 Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
