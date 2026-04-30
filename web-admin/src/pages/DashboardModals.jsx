import React, { useState, useRef, useEffect } from 'react';
import { XCircle, Download, AlertTriangle, Send, Bell, TrendingUp, MapPin } from 'lucide-react';
import {
  todayTransactions, paymentMethodBreakdown,
  liveOrders, onlineWorkersList, skillDemand,
  newUsersToday, userSourceBreakdown,
  cancelledOrders, serviceSubBreakdown, chartDayInsights,
} from '../utils/mockData';
import { formatVND } from '../utils/format';


// ─── Shared: Modal Shell ──────────────────────────────────────────────────────
const ModalShell = ({ title, subtitle, onClose, wide, children }) => (
  <div className="dm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`dm-box ${wide ? 'dm-wide' : ''}`}>
      <div className="dm-header">
        <div>
          <h3 className="dm-title">{title}</h3>
          {subtitle && <p className="dm-subtitle">{subtitle}</p>}
        </div>
        <button className="dm-close" onClick={onClose}><XCircle size={22} /></button>
      </div>
      <div className="dm-body">{children}</div>
    </div>
  </div>
);

// ─── Shared: Donut Chart (Canvas) ─────────────────────────────────────────────
const DonutChart = ({ slices, size = 120 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr; canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2, cy = size / 2, r = size / 2 - 8, ir = r * 0.55;
    let start = -Math.PI / 2;
    slices.forEach(s => {
      const angle = (s.pct / 100) * 2 * Math.PI;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.closePath(); ctx.fillStyle = s.color; ctx.fill();
      start += angle;
    });
    ctx.beginPath(); ctx.arc(cx, cy, ir, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--bg-secondary)'; ctx.fill();
  }, [slices, size]);
  return <canvas ref={ref} style={{ width: size, height: size, display: 'block' }} />;
};

// ─── 1. Revenue Today Modal ───────────────────────────────────────────────────
export const RevenueTodayModal = ({ onClose }) => {
  const handleExport = () => {
    const headers = ['Giờ', 'Mã đơn', 'Thợ', 'Khách', 'Dịch vụ', 'Tổng tiền', 'Hoa hồng', 'Hình thức'];
    const rows = todayTransactions.map(r => [r.time, r.id, r.worker, r.customer, r.service, r.amount, r.commission, r.payMethod]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `doanh-thu-ngay-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const total = todayTransactions.reduce((s, t) => s + t.amount, 0);
  const totalComm = todayTransactions.reduce((s, t) => s + t.commission, 0);
  return (
    <ModalShell title="💰 Sao kê doanh thu hôm nay" subtitle={`Tổng: ${formatVND(total)} · Hoa hồng: ${formatVND(totalComm)}`} onClose={onClose} wide>
      <div className="dm-two-col">
        {/* Donut + legend */}
        <div className="dm-panel">
          <p className="dm-panel-title">Phương thức thanh toán</p>
          <div className="dm-donut-wrap">
            <DonutChart slices={paymentMethodBreakdown} size={130} />
            <div className="dm-donut-legend">
              {paymentMethodBreakdown.map(m => (
                <div key={m.method} className="dm-legend-row">
                  <span className="dm-legend-dot" style={{ background: m.color }} />
                  <span>{m.method}</span>
                  <strong>{m.pct}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="dm-panel dm-panel-flex">
          <div className="dm-panel-header">
            <p className="dm-panel-title">Giao dịch trong ngày ({todayTransactions.length} đơn)</p>
            <button className="btn btn-sm btn-export" onClick={handleExport}><Download size={13} /> Xuất Excel</button>
          </div>
          <div className="dm-scroll">
            <table className="data-table dm-table">
              <thead><tr><th>Giờ</th><th>Mã đơn</th><th>Thợ</th><th>Dịch vụ</th><th>Tổng</th><th>Hoa hồng</th><th>H/thức</th></tr></thead>
              <tbody>
                {todayTransactions.map(t => (
                  <tr key={t.id}>
                    <td><span className="dm-time">{t.time}</span></td>
                    <td><span className="booking-id">{t.id}</span></td>
                    <td>{t.worker}</td>
                    <td><span className="service-tag">{t.service}</span></td>
                    <td><strong>{formatVND(t.amount)}</strong></td>
                    <td style={{ color: 'var(--accent-primary)' }}>{formatVND(t.commission)}</td>
                    <td><span className="dm-pay-badge">{t.payMethod}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

// ─── 2. Active Orders Modal ───────────────────────────────────────────────────
const STAGE_STEPS = ['Đang di chuyển', 'Đang kiểm tra lỗi', 'Đang sửa chữa'];
const stageIdx = s => STAGE_STEPS.indexOf(s);

export const ActiveOrdersModal = ({ onClose }) => {
  const anomalies = liveOrders.filter(o => o.anomaly);
  const normal = liveOrders.filter(o => !o.anomaly);
  const sorted = [...anomalies, ...normal];
  return (
    <ModalShell title="🚨 Theo dõi đơn hàng thời gian thực" subtitle={`${liveOrders.length} đơn đang chạy · ${anomalies.length} cảnh báo bất thường`} onClose={onClose} wide>
      {/* Fake map */}
      <div className="dm-fakemap">
        <div className="dm-fakemap-label"><MapPin size={14} /> Bản đồ phân bổ đơn hàng (tích hợp Google Maps API)</div>
        {sorted.map((o, i) => (
          <div key={o.id} className={`dm-map-dot ${o.anomaly ? 'dm-map-dot-alert' : ''}`}
            style={{ left: `${8 + i * 14}%`, top: `${25 + (i % 3) * 22}%` }}
            title={`${o.id}: ${o.customer} → ${o.worker}`}>
            <MapPin size={o.anomaly ? 14 : 11} />
          </div>
        ))}
      </div>
      {/* Order rows */}
      <div className="dm-order-list">
        {sorted.map(o => (
          <div key={o.id} className={`dm-order-row ${o.anomaly ? 'dm-order-anomaly' : ''}`}>
            <div className="dm-order-top">
              {o.anomaly && <span className="dm-anomaly-badge"><AlertTriangle size={12} /> {o.anomalyMsg}</span>}
              <div className="dm-order-meta">
                <span className="booking-id">{o.id}</span>
                <span>👤 {o.customer}</span><span>🔧 {o.worker}</span>
                <span className="service-tag">{o.service}</span>
                <span>📍 {o.address}</span>
                <strong>{formatVND(o.amount)}</strong>
              </div>
            </div>
            {/* Progress steps */}
            <div className="dm-steps">
              {STAGE_STEPS.map((step, idx) => (
                <div key={step} className={`dm-step ${idx <= stageIdx(o.stage) ? 'dm-step-done' : ''} ${step === o.stage ? 'dm-step-active' : ''}`}>
                  <div className="dm-step-dot" />
                  <span>{step}</span>
                  {idx < STAGE_STEPS.length - 1 && <div className={`dm-step-line ${idx < stageIdx(o.stage) ? 'dm-step-line-done' : ''}`} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

// ─── 3. Online Workers Modal ──────────────────────────────────────────────────
export const OnlineWorkersModal = ({ onClose }) => {
  const [skillFilter, setSkillFilter] = useState('Tất cả');
  const [notifSkill, setNotifSkill] = useState(null);
  const skills = ['Tất cả', ...skillDemand.map(s => s.skill)];
  const filtered = skillFilter === 'Tất cả' ? onlineWorkersList : onlineWorkersList.filter(w => w.skill === skillFilter);
  const MIN_WALLET = 500000;
  return (
    <ModalShell title="⚡ Thợ đang Online" subtitle={`${onlineWorkersList.length} thợ online · Phân bổ theo kỹ năng`} onClose={onClose} wide>
      {/* Demand bars */}
      <div className="dm-demand-grid">
        {skillDemand.map(s => {
          const gap = s.needed - s.online;
          return (
            <div key={s.skill} className={`dm-demand-card ${gap >= 5 ? 'dm-demand-critical' : ''}`}>
              <div className="dm-demand-top">
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.skill}</span>
                {gap >= 5 && <span className="dm-critical-badge">Thiếu trầm trọng</span>}
              </div>
              <div className="dm-demand-bar-track">
                <div className="dm-demand-bar-fill" style={{ width: `${(s.online / s.needed) * 100}%`, background: s.color }} />
              </div>
              <div className="dm-demand-nums">
                <span style={{ color: s.color }}>{s.online} online</span>
                <span>/ {s.needed} cần</span>
                <button className="dm-push-btn" onClick={() => setNotifSkill(s.skill)}><Bell size={12} /> Push</button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Skill filter tabs */}
      <div className="dm-skill-tabs">
        {skills.map(s => (
          <button key={s} className={`dm-skill-tab ${skillFilter === s ? 'active' : ''}`} onClick={() => setSkillFilter(s)}>{s}</button>
        ))}
      </div>
      {/* Worker table */}
      <div className="dm-scroll">
        <table className="data-table dm-table">
          <thead><tr><th>Thợ</th><th>Kỹ năng</th><th>Khu vực</th><th>Số dư ví</th><th>Đánh giá</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {filtered.map(w => {
              const lowWallet = w.walletBalance < MIN_WALLET;
              return (
                <tr key={w.id} className={lowWallet ? 'dm-row-warn' : ''}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=6366F1&color=fff&size=40`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <span style={{ fontWeight: 500 }}>{w.name}</span>
                    </div>
                  </td>
                  <td><span className="service-tag">{w.skill}</span></td>
                  <td>{w.district}</td>
                  <td>
                    <span style={{ color: lowWallet ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{formatVND(w.walletBalance)}</span>
                    {lowWallet && <span className="dm-wallet-warn"> ⚠ Dưới mức tối thiểu</span>}
                  </td>
                  <td>⭐ {w.rating}</td>
                  <td>
                    <span className="status-badge" style={{
                      background: w.status === 'online' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                      color: w.status === 'online' ? 'var(--success)' : 'var(--warning)',
                    }}>{w.status === 'online' ? 'Online' : 'Bận'}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Push notif confirm */}
      {notifSkill && (
        <div className="dm-push-confirm">
          <Bell size={16} />
          <span>Gửi Push Notification kêu gọi thợ <strong>{notifSkill}</strong> bật app?</span>
          <button className="btn btn-sm btn-success" onClick={() => setNotifSkill(null)}><Send size={12} /> Gửi ngay</button>
          <button className="btn btn-sm btn-ghost" onClick={() => setNotifSkill(null)}>Huỷ</button>
        </div>
      )}
    </ModalShell>
  );
};

// ─── 4. New Users Modal ───────────────────────────────────────────────────────
export const NewUsersModal = ({ onClose }) => {
  const fraudCount = newUsersToday.filter(u => u.suspicious).length;
  return (
    <ModalShell title="👥 Người dùng đăng ký hôm nay" subtitle={`${newUsersToday.length} tài khoản · ${fraudCount} nghi vấn gian lận`} onClose={onClose} wide>
      <div className="dm-two-col">
        {/* Donut source */}
        <div className="dm-panel">
          <p className="dm-panel-title">Nguồn truy cập</p>
          <div className="dm-donut-wrap">
            <DonutChart slices={userSourceBreakdown.map(s => ({ pct: s.pct, color: s.color }))} size={120} />
            <div className="dm-donut-legend">
              {userSourceBreakdown.map(s => (
                <div key={s.source} className="dm-legend-row">
                  <span className="dm-legend-dot" style={{ background: s.color }} />
                  <span>{s.source}</span><strong>{s.count} người</strong>
                </div>
              ))}
            </div>
          </div>
          {fraudCount > 0 && (
            <div className="alert-item alert-danger" style={{ marginTop: 16 }}>
              <AlertTriangle size={14} className="alert-icon" />
              <span><strong>{fraudCount} tài khoản</strong> nghi ngờ gian lận – cùng IP/thiết bị</span>
            </div>
          )}
        </div>
        {/* User list */}
        <div className="dm-panel dm-panel-flex">
          <p className="dm-panel-title">Danh sách đăng ký</p>
          <div className="dm-scroll">
            <table className="data-table dm-table">
              <thead><tr><th>Tên</th><th>Nguồn</th><th>Thiết bị</th><th>IP</th><th>Giờ</th></tr></thead>
              <tbody>
                {newUsersToday.map(u => (
                  <tr key={u.id} className={u.suspicious ? 'dm-row-fraud' : ''}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                        {u.suspicious && <div className="dm-fraud-note"><AlertTriangle size={11} /> {u.fraudNote}</div>}
                      </div>
                    </td>
                    <td><span className="dm-source-badge">{u.source}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.device}</td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: u.suspicious ? 'var(--danger)' : 'inherit' }}>{u.ip}</td>
                    <td>{u.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

// ─── 5. Chart Day Insight Modal ───────────────────────────────────────────────
export const ChartInsightModal = ({ day, value, commission, onClose }) => {
  const info = chartDayInsights[day] || { note: 'Không có ghi chú.', topWorkers: [] };
  return (
    <div className="dm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dm-box dm-insight-box">
        <div className="dm-header">
          <div><h3 className="dm-title">📊 Phân tích ngày {day}</h3></div>
          <button className="dm-close" onClick={onClose}><XCircle size={20} /></button>
        </div>
        <div className="dm-body">
          <div className="dm-insight-metrics">
            <div className="dm-insight-stat"><span>Khách trả</span><strong style={{ color: '#6366F1' }}>{formatVND(value)}</strong></div>
            <div className="dm-insight-stat"><span>Hoa hồng</span><strong style={{ color: '#10B981' }}>{formatVND(commission)}</strong></div>
          </div>
          <div className="dm-insight-note">{info.note}</div>
          {info.topWorkers.length > 0 && (
            <div className="dm-top-workers">
              <p className="dm-panel-title">🏆 Top thợ kiếm nhiều nhất ngày {day}</p>
              {info.topWorkers.map((w, i) => (
                <div key={w} className="dm-top-worker-row">
                  <span className="dm-top-rank">#{i + 1}</span>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w)}&background=6366F1&color=fff&size=40`} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                  <span>{w}</span>
                  <TrendingUp size={14} style={{ color: 'var(--success)', marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── 6. Cancelled Orders Modal ────────────────────────────────────────────────
export const CancelledOrdersModal = ({ onClose }) => {
  const byReason = cancelledOrders.reduce((acc, o) => { acc[o.reason] = (acc[o.reason] || 0) + 1; return acc; }, {});
  return (
    <ModalShell title="❌ Đơn bị hủy tháng này" subtitle={`${cancelledOrders.length} đơn · Phân tích lý do hủy`} onClose={onClose} wide>
      <div className="dm-cancel-summary">
        {Object.entries(byReason).map(([r, c]) => (
          <div key={r} className="dm-cancel-chip">
            <span>{r}</span><strong>{c} đơn</strong>
          </div>
        ))}
      </div>
      <div className="dm-scroll" style={{ marginTop: 12 }}>
        <table className="data-table dm-table">
          <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Thợ</th><th>Dịch vụ</th><th>Lý do hủy</th><th>Bên hủy</th><th>Thời gian</th></tr></thead>
          <tbody>
            {cancelledOrders.map(o => (
              <tr key={o.id}>
                <td><span className="booking-id">{o.id}</span></td>
                <td>{o.customer}</td><td>{o.worker}</td>
                <td><span className="service-tag">{o.service}</span></td>
                <td>{o.reason}</td>
                <td>
                  <span className="status-badge" style={{
                    background: o.cancelledBy === 'Thợ' ? 'rgba(239,68,68,0.12)' : o.cancelledBy === 'Khách' ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.12)',
                    color: o.cancelledBy === 'Thợ' ? 'var(--danger)' : o.cancelledBy === 'Khách' ? 'var(--warning)' : 'var(--text-secondary)',
                  }}>{o.cancelledBy}</span>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.cancelledAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalShell>
  );
};

// ─── 7. Service Detail Modal ──────────────────────────────────────────────────
export const ServiceDetailModal = ({ serviceName, totalCount, onClose }) => {
  const subs = serviceSubBreakdown[serviceName] || [];
  return (
    <ModalShell title={`📂 Chi tiết: ${serviceName}`} subtitle={`${totalCount} đơn tổng · Phân tích hạng mục chi tiết`} onClose={onClose}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
        💡 Chạy quảng cáo nhắm vào hạng mục chiếm tỷ lệ cao nhất để tối ưu ROI.
      </p>
      <div className="dm-sub-list">
        {subs.map(s => (
          <div key={s.name} className="dm-sub-item">
            <div className="dm-sub-info">
              <span className="dm-sub-name">{s.name}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong>{s.count} đơn</strong>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.pct}%</span>
              </div>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="dm-ad-hint">
        <TrendingUp size={16} />
        <span>Gợi ý chạy Facebook Ads: <strong>"{subs[0]?.name}"</strong> – chiếm {subs[0]?.pct}% đơn hàng</span>
      </div>
    </ModalShell>
  );
};
