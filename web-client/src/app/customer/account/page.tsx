"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ─── Types ─── */
interface Address { id: number; label: string; address: string; icon: string; }
interface PaymentMethod { id: number; type: string; label: string; icon: string; isDefault: boolean; }

/* ─── Mock data ─── */
const MOCK_ADDRESSES: Address[] = [
  { id: 1, label: 'Nhà riêng', address: '123 Nguyễn Trãi, P.2, Q.5, TP.HCM', icon: '🏠' },
  { id: 2, label: 'Công ty', address: '456 Lê Văn Sỹ, P.14, Q.3, TP.HCM', icon: '🏢' },
  { id: 3, label: 'Căn hộ cho thuê', address: '789 Điện Biên Phủ, P.25, Bình Thạnh', icon: '🏗️' },
];
const MOCK_PAYMENTS: PaymentMethod[] = [
  { id: 1, type: 'CASH', label: 'Tiền mặt', icon: '💵', isDefault: true },
  { id: 2, type: 'MOMO', label: 'Ví Momo ****1234', icon: '🟣', isDefault: false },
  { id: 3, type: 'ZALOPAY', label: 'ZaloPay ****5678', icon: '🔵', isDefault: false },
];
const MEMBERSHIP = { level: 'Bạc', color: '#9CA3AF', bg: '#F3F4F6', nextLevel: 'Vàng', points: 1240, nextPoints: 2000, perks: ['Ưu tiên xếp hàng', 'Giảm 5% mỗi đơn'] };

/* ─── Sub-components ─── */
function Tab({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
      background: 'none', border: 'none', borderBottom: `3px solid ${active ? '#4F46E5' : 'transparent'}`,
      fontWeight: active ? '700' : '600', color: active ? '#4F46E5' : '#6B7280',
      fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
    }}>
      <span>{icon}</span>{label}
    </button>
  );
}

function SectionCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #E5E7EB', overflow: 'hidden', marginBottom: '20px' }}>
      {title && <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', fontWeight: '800', fontSize: '16px', color: '#111827' }}>{title}</div>}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

/* ─── Main ─── */
export default function CustomerAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS' | 'PAYMENT' | 'SETTINGS'>('PROFILE');

  // Profile state
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '' });
  const [editingProfile, setEditingProfile] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', icon: '🏠' });

  // Payment state
  const [payments, setPayments] = useState<PaymentMethod[]>(MOCK_PAYMENTS);

  // Settings state
  const [settings, setSettings] = useState({ promoNotifs: true, orderNotifs: true, smsNotifs: false });

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) { router.push('/login'); return; }
    try {
      const u = JSON.parse(saved);
      setUser(u);
      setProfileForm({ name: u.full_name || '', phone: u.phone || '', email: u.email || '' });
    } catch { router.push('/login'); }
  }, [router]);

  const handleLogout = () => { localStorage.removeItem('user'); localStorage.removeItem('role'); router.push('/login'); };
  const setDefault = (id: number) => setPayments(payments.map(p => ({ ...p, isDefault: p.id === id })));
  const deleteAddress = (id: number) => setAddresses(addresses.filter(a => a.id !== id));
  const addAddress = () => {
    if (!newAddress.label || !newAddress.address) return;
    setAddresses([...addresses, { id: Date.now(), ...newAddress }]);
    setNewAddress({ label: '', address: '', icon: '🏠' });
    setAddingAddress(false);
  };

  if (!user) return null;

  // Membership progress
  const pct = Math.min((MEMBERSHIP.points / MEMBERSHIP.nextPoints) * 100, 100);
  const MEDAL_COLORS: Record<string, string> = { Đồng: '#CD7F32', Bạc: '#9CA3AF', Vàng: '#F59E0B', 'Kim Cương': '#818CF8' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'Outfit, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', padding: '8px 14px', color: 'white', cursor: 'pointer', fontSize: '16px' }}>←</button>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: '2px solid rgba(255,255,255,0.5)', flexShrink: 0 }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '4px' }}>Tài khoản của bạn</div>
            <div style={{ color: 'white', fontSize: '22px', fontWeight: '800' }}>{user.full_name}</div>
          </div>
          {/* Membership Badge */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px 20px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Hạng thành viên</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: MEDAL_COLORS[MEMBERSHIP.level] || 'white', marginTop: '2px' }}>
              {MEMBERSHIP.level === 'Kim Cương' ? '💎' : MEMBERSHIP.level === 'Vàng' ? '🥇' : MEMBERSHIP.level === 'Bạc' ? '🥈' : '🥉'} {MEMBERSHIP.level}
            </div>
            <div style={{ marginTop: '8px', width: '120px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, backgroundColor: MEDAL_COLORS[MEMBERSHIP.level] || 'white', borderRadius: '3px', transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{MEMBERSHIP.points}/{MEMBERSHIP.nextPoints} điểm → {MEMBERSHIP.nextLevel}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', overflowX: 'auto' }}>
          <Tab label="Hồ sơ & Địa chỉ" icon="👤" active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} />
          <Tab label="Lịch sử đơn hàng" icon="📋" active={activeTab === 'ORDERS'} onClick={() => setActiveTab('ORDERS')} />
          <Tab label="Thanh toán" icon="💳" active={activeTab === 'PAYMENT'} onClick={() => setActiveTab('PAYMENT')} />
          <Tab label="Cài đặt" icon="⚙️" active={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} />
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ─── TAB: PROFILE ─── */}
        {activeTab === 'PROFILE' && (
          <>
            <SectionCard title="👤 Thông tin cá nhân">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Họ và tên', key: 'name', type: 'text' },
                  { label: 'Số điện thoại', key: 'phone', type: 'tel' },
                  { label: 'Email', key: 'email', type: 'email' },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.key === 'email' ? '1 / -1' : 'auto' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={(profileForm as any)[f.key]}
                      readOnly={!editingProfile}
                      onChange={e => setProfileForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: `1.5px solid ${editingProfile ? '#4F46E5' : '#E5E7EB'}`, backgroundColor: editingProfile ? 'white' : '#F9FAFB', fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                {editingProfile
                  ? <>
                      <button onClick={() => setEditingProfile(false)} style={{ padding: '10px 20px', background: 'none', border: '1px solid #E5E7EB', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', color: '#6B7280' }}>Hủy</button>
                      <button onClick={() => { setEditingProfile(false); alert('Đã lưu thông tin!'); }} style={{ padding: '10px 20px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>💾 Lưu thay đổi</button>
                    </>
                  : <button onClick={() => setEditingProfile(true)} style={{ padding: '10px 20px', backgroundColor: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>✏️ Chỉnh sửa</button>
                }
              </div>
            </SectionCard>

            {/* Address Book */}
            <SectionCard title="📍 Sổ địa chỉ">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {addresses.map(addr => (
                  <div key={addr.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '14px', border: '1.5px solid #E5E7EB', backgroundColor: '#FAFAFA' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{addr.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '3px' }}>{addr.label}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>{addr.address}</div>
                    </div>
                    <button onClick={() => deleteAddress(addr.id)} style={{ padding: '6px 12px', background: 'none', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#EF4444', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>Xóa</button>
                  </div>
                ))}
              </div>

              {addingAddress ? (
                <div style={{ padding: '20px', borderRadius: '14px', border: '2px dashed #C7D2FE', backgroundColor: '#F5F7FF' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '6px' }}>NHÃN</label>
                      <input value={newAddress.label} onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))} placeholder="VD: Nhà riêng" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #C7D2FE', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280', display: 'block', marginBottom: '6px' }}>ĐỊA CHỈ ĐẦY ĐỦ</label>
                      <input value={newAddress.address} onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))} placeholder="Số nhà, đường, phường, quận..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #C7D2FE', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={addAddress} style={{ flex: 1, padding: '10px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>✓ Thêm địa chỉ</button>
                    <button onClick={() => setAddingAddress(false)} style={{ padding: '10px 16px', background: 'none', border: '1px solid #E5E7EB', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', color: '#6B7280' }}>Hủy</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingAddress(true)} style={{ width: '100%', padding: '14px', backgroundColor: '#EEF2FF', color: '#4F46E5', border: '2px dashed #C7D2FE', borderRadius: '14px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  + Thêm địa chỉ mới
                </button>
              )}
            </SectionCard>
          </>
        )}

        {/* ─── TAB: ORDERS ─── */}
        {activeTab === 'ORDERS' && (
          <SectionCard title="📋 Lịch sử đơn hàng">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { id: '#DH-00123', service: 'Sửa điều hòa', worker: 'Nguyễn Văn Hùng', rating: 4.9, date: '25/04/2026', status: 'Hoàn thành', color: '#10B981', avatar: '👷' },
                { id: '#DH-00118', service: 'Thông tắc bồn cầu', worker: 'Trần Minh Quân', rating: 4.8, date: '22/04/2026', status: 'Hoàn thành', color: '#10B981', avatar: '🔧' },
                { id: '#DH-00097', service: 'Sửa máy giặt', worker: 'Vũ Hải Đăng', rating: 0, date: '18/04/2026', status: 'Đã huỷ', color: '#EF4444', avatar: '❄️' },
              ].map(order => (
                <div key={order.id} style={{ borderRadius: '16px', border: '1.5px solid #E5E7EB', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ fontWeight: '700', color: '#4F46E5', fontSize: '14px' }}>{order.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>{order.date}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: order.color, backgroundColor: order.color + '20', padding: '4px 12px', borderRadius: '20px' }}>{order.status}</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{order.avatar}</div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#111827', marginBottom: '3px' }}>{order.service}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>Thợ: {order.worker}</div>
                        {order.rating > 0 && <div style={{ color: '#F59E0B', fontSize: '13px', marginTop: '3px' }}>{'★'.repeat(Math.round(order.rating))} {order.rating}</div>}
                      </div>
                    </div>
                    {order.status === 'Hoàn thành' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <button style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          📞 Gọi lại thợ này
                        </button>
                        <button onClick={() => router.push('/customer/search')} style={{ padding: '8px 16px', backgroundColor: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          🔁 Đặt lại dịch vụ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ─── TAB: PAYMENT ─── */}
        {activeTab === 'PAYMENT' && (
          <>
            <SectionCard title="💳 Phương thức thanh toán">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {payments.map(pm => (
                  <div key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '14px', border: `2px solid ${pm.isDefault ? '#4F46E5' : '#E5E7EB'}`, backgroundColor: pm.isDefault ? '#F5F7FF' : 'white', transition: 'all 0.2s' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: pm.isDefault ? '#EEF2FF' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{pm.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827' }}>{pm.label}</div>
                      {pm.isDefault && <div style={{ fontSize: '12px', color: '#4F46E5', fontWeight: '700', marginTop: '2px' }}>✓ Mặc định</div>}
                    </div>
                    {!pm.isDefault && (
                      <button onClick={() => setDefault(pm.id)} style={{ padding: '7px 14px', background: 'none', border: '1.5px solid #D1D5DB', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', color: '#6B7280', whiteSpace: 'nowrap' }}>
                        Đặt mặc định
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[{ icon: '🟣', label: 'Thêm Momo' }, { icon: '🔵', label: 'Thêm ZaloPay' }, { icon: '🏦', label: 'Thêm thẻ ngân hàng' }].map(btn => (
                  <button key={btn.label} onClick={() => alert('Tính năng liên kết ví điện tử đang phát triển!')} style={{ flex: 1, padding: '12px', backgroundColor: '#F9FAFB', border: '1.5px dashed #D1D5DB', borderRadius: '12px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>{btn.icon}</span> {btn.label}
                  </button>
                ))}
              </div>
            </SectionCard>
          </>
        )}

        {/* ─── TAB: SETTINGS ─── */}
        {activeTab === 'SETTINGS' && (
          <>
            <SectionCard title="🔔 Thông báo">
              {[
                { key: 'promoNotifs', label: 'Khuyến mãi & Voucher', desc: 'Nhận thông báo về mã giảm giá, ưu đãi mới nhất' },
                { key: 'orderNotifs', label: 'Cập nhật đơn hàng', desc: 'Thông báo khi thợ nhận đơn, đang đến, hoàn thành' },
                { key: 'smsNotifs', label: 'Thông báo qua SMS', desc: 'Nhận tin nhắn điện thoại thay vì thông báo đẩy' },
              ].map(s => (
                <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '3px' }}>{s.label}</div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>{s.desc}</div>
                  </div>
                  <div onClick={() => setSettings(p => ({ ...p, [s.key]: !(p as any)[s.key] }))}
                    style={{ width: '48px', height: '26px', borderRadius: '20px', backgroundColor: (settings as any)[s.key] ? '#4F46E5' : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: (settings as any)[s.key] ? '25px' : '3px', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              ))}
            </SectionCard>

            <SectionCard title="🔒 Bảo mật tài khoản">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => alert('Tính năng đổi mật khẩu đang phát triển!')} style={{ padding: '14px 20px', backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', color: '#374151', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🔑 Đổi mật khẩu</span><span style={{ color: '#9CA3AF' }}>→</span>
                </button>
              </div>
            </SectionCard>

            <button onClick={handleLogout} style={{ width: '100%', padding: '16px', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1.5px solid #FECACA', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              🚪 Đăng xuất khỏi tài khoản
            </button>
          </>
        )}
      </div>
    </div>
  );
}
