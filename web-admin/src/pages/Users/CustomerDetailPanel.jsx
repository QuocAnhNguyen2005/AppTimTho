import React, { useState } from 'react';
import {
  X, CreditCard, FileText, Tag, BarChart2,
  AlertTriangle, CheckCircle, Clock, RotateCcw,
  Shield, ShieldOff, Wallet, MapPin, MessageSquare,
  Lock, Unlock, Copy, ExternalLink
} from 'lucide-react';
import { customerDetailData } from '../../utils/mockData';
import { formatVND, getTierConfig } from '../../utils/format';

// ─── Payment Status Badge ─────────────────────────────────────────────────────
const PayStatusBadge = ({ status }) => {
  const map = {
    success:  { label: 'Thành công',  color: 'var(--success)',  bg: 'rgba(16,185,129,0.12)', Icon: CheckCircle },
    refunded: { label: 'Đã hoàn',     color: '#8B5CF6',         bg: 'rgba(139,92,246,0.12)', Icon: RotateCcw },
    pending:  { label: 'Đang treo',   color: 'var(--warning)',  bg: 'rgba(245,158,11,0.12)', Icon: Clock },
    timeout:  { label: 'Lỗi Timeout', color: 'var(--danger)',   bg: 'rgba(239,68,68,0.12)',  Icon: AlertTriangle },
  };
  const cfg = map[status] || map.pending;
  return (
    <span className="cdp-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
      <cfg.Icon size={11} /> {cfg.label}
    </span>
  );
};

// ─── Gateway Badge ────────────────────────────────────────────────────────────
const GatewayBadge = ({ name }) => {
  const colors = { ZaloPay: '#0068FF', VNPay: '#E30613', MoMo: '#A50064' };
  return (
    <span className="cdp-gw-badge" style={{ background: colors[name] || '#6366F1' }}>{name}</span>
  );
};

// ─── Tab 1: Payment Log ───────────────────────────────────────────────────────
const TabPayment = ({ data, customerName }) => {
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const hasPending = data.paymentLogs.some(p => p.status === 'pending' || p.status === 'timeout');

  return (
    <div className="cdp-tab-content">
      {toast && <div className="cdp-toast">{toast}</div>}
      {hasPending && (
        <div className="cdp-alert-box cdp-alert-danger">
          <AlertTriangle size={15} />
          <div>
            <strong>Phát hiện giao dịch bất thường!</strong>
            <p>Có giao dịch đang treo hoặc timeout – khách có thể đã bị trừ tiền mà chưa nhận dịch vụ.</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="cdp-action-row">
        <button className="cdp-action-btn cdp-btn-danger" onClick={() => showToast('✅ Đã khởi tạo Force Refund – hoàn tiền trong 2-5 phút')}>
          <RotateCcw size={14} /> Hoàn tiền khẩn cấp
        </button>
        <button className="cdp-action-btn cdp-btn-purple" onClick={() => showToast('✅ Đã cộng 50.000đ bồi thường vào Ví App của khách')}>
          <Wallet size={14} /> Cộng bồi thường vào ví
        </button>
      </div>

      {/* Transaction table */}
      <div className="cdp-section-title"><CreditCard size={14} /> Lịch sử giao dịch cổng thanh toán</div>
      <div className="cdp-scroll-table">
        <table className="cdp-table">
          <thead>
            <tr><th>Cổng</th><th>Trace ID</th><th>Mã đơn</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th><th>Ghi chú</th></tr>
          </thead>
          <tbody>
            {data.paymentLogs.map((p) => (
              <tr key={p.traceId} className={p.status === 'timeout' || p.status === 'pending' ? 'cdp-row-warn' : ''}>
                <td><GatewayBadge name={p.gateway} /></td>
                <td>
                  <div className="cdp-trace-id">
                    <span>{p.traceId}</span>
                    <button className="cdp-copy-btn" onClick={() => { navigator.clipboard.writeText(p.traceId); showToast('Đã copy Trace ID'); }} title="Copy">
                      <Copy size={11} />
                    </button>
                  </div>
                </td>
                <td><span className="cdp-order-chip">{p.orderId}</span></td>
                <td><strong>{formatVND(p.amount)}</strong></td>
                <td><PayStatusBadge status={p.status} /></td>
                <td className="cdp-text-mono">{p.createdAt}</td>
                <td className="cdp-note">{p.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Tab 2: Order Deep Log ────────────────────────────────────────────────────
const TabOrderLog = ({ data }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  if (data.orderLogs.length === 0)
    return <div className="cdp-empty">Không có log đơn hàng chi tiết nào.</div>;

  return (
    <div className="cdp-tab-content">
      {data.orderLogs.map((order) => (
        <div key={order.orderId} className="cdp-order-card">
          {/* Order header */}
          <div className="cdp-order-header" onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}>
            <div className="cdp-order-meta">
              <span className="cdp-order-chip">{order.orderId}</span>
              <span className="cdp-service-tag">{order.service}</span>
              <span>🔧 {order.worker}</span>
            </div>
            <div className="cdp-order-price">
              <span className="cdp-price-quoted">Báo giá: {formatVND(order.quotedPrice)}</span>
              <span className="cdp-price-final">Thực tế: {formatVND(order.finalPrice)}</span>
              {order.quotedPrice !== order.finalPrice && (
                <span className="cdp-price-diff">{order.priceDiff}</span>
              )}
            </div>
          </div>

          {expandedOrder === order.orderId && (
            <div className="cdp-order-body">
              {/* GPS Timeline */}
              <div className="cdp-section-title"><MapPin size={13} /> Dấu vết thời gian & GPS</div>
              <div className="cdp-timeline">
                {order.timeline.map((ev, i) => (
                  <div key={i} className="cdp-timeline-item">
                    <div className="cdp-timeline-dot" />
                    {i < order.timeline.length - 1 && <div className="cdp-timeline-line" />}
                    <div className="cdp-timeline-content">
                      <span className="cdp-timeline-event">{ev.event}</span>
                      <span className="cdp-timeline-time">{ev.time}</span>
                      {ev.gps && <span className="cdp-timeline-gps"><MapPin size={10} /> {ev.gps}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat log */}
              <div className="cdp-section-title" style={{ marginTop: 14 }}><MessageSquare size={13} /> Chat gốc (Admin view – kể cả tin đã xóa)</div>
              <div className="cdp-chat-log">
                {order.chat.map((msg, i) => (
                  <div key={i} className={`cdp-chat-bubble cdp-chat-${msg.from}`}>
                    <span className="cdp-chat-sender">{msg.from === 'customer' ? '👤 Khách' : '🔧 Thợ'}</span>
                    <span className="cdp-chat-msg">{msg.msg}</span>
                    <span className="cdp-chat-time">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Tab 3: Voucher & Fraud ───────────────────────────────────────────────────
const TabVoucher = ({ data }) => {
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const hasFraud = data.deviceHistory.some(d => d.flagged);

  return (
    <div className="cdp-tab-content">
      {toast && <div className="cdp-toast">{toast}</div>}

      {/* Device fingerprint */}
      <div className="cdp-section-title"><Shield size={13} /> Lịch sử thiết bị & IP</div>
      {data.deviceHistory.map((d, i) => (
        <div key={i} className={`cdp-device-card ${d.flagged ? 'cdp-device-flagged' : ''}`}>
          <div className="cdp-device-row">
            <span className="cdp-device-label">📱 {d.device}</span>
            <span className="cdp-device-ip cdp-text-mono">{d.ip}</span>
            <span className={`cdp-account-count ${d.accounts > 1 ? 'cdp-count-warn' : ''}`}>
              {d.accounts} tài khoản cùng IP
            </span>
          </div>
          {d.flagged && (
            <div className="cdp-fraud-alert">
              <AlertTriangle size={13} /> <strong>Cảnh báo gian lận:</strong> {d.note}
            </div>
          )}
        </div>
      ))}

      {/* Action buttons */}
      {hasFraud && (
        <div className="cdp-action-row" style={{ marginTop: 12 }}>
          <button className="cdp-action-btn cdp-btn-success" onClick={() => showToast('✅ Đã gỡ khóa tài khoản thành công')}>
            <Unlock size={14} /> Gỡ khóa tài khoản
          </button>
          <button className="cdp-action-btn cdp-btn-danger" onClick={() => showToast('🔒 Đã khóa vĩnh viễn thiết bị này – Ban Device')}>
            <ShieldOff size={14} /> Khóa vĩnh viễn (Ban Device)
          </button>
        </div>
      )}

      {/* Voucher table */}
      <div className="cdp-section-title" style={{ marginTop: 16 }}><Tag size={13} /> Toàn bộ mã Voucher đã dùng</div>
      <div className="cdp-scroll-table">
        <table className="cdp-table">
          <thead>
            <tr><th>Mã</th><th>Giảm giá</th><th>Ngày dùng</th><th>Đơn hàng</th><th>IP</th><th>Thiết bị</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {data.voucherLogs.map((v) => (
              <tr key={v.code + v.usedAt} className={v.status === 'suspicious' ? 'cdp-row-warn' : ''}>
                <td><span className="cdp-voucher-code">{v.code}</span></td>
                <td><strong style={{ color: 'var(--success)' }}>-{formatVND(v.discount)}</strong></td>
                <td className="cdp-text-mono">{v.usedAt}</td>
                <td><span className="cdp-order-chip">{v.orderId}</span></td>
                <td className="cdp-text-mono">{v.ip}</td>
                <td>{v.device}</td>
                <td>
                  {v.status === 'suspicious'
                    ? <span className="cdp-status-badge" style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.12)' }}><AlertTriangle size={11} /> Nghi vấn</span>
                    : <span className="cdp-status-badge" style={{ color: 'var(--success)', background: 'rgba(16,185,129,0.12)' }}><CheckCircle size={11} /> Hợp lệ</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Tab 4: Behavior Metrics ──────────────────────────────────────────────────
const TabBehavior = ({ data }) => {
  const { behavior } = data;
  const trustColor = behavior.trustScore >= 80 ? 'var(--success)' : behavior.trustScore >= 60 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="cdp-tab-content">
      {/* Trust score ring */}
      <div className="cdp-behavior-header">
        <div className="cdp-trust-ring" style={{ '--trust-color': trustColor, '--trust-pct': behavior.trustScore }}>
          <div className="cdp-trust-inner">
            <span className="cdp-trust-score" style={{ color: trustColor }}>{behavior.trustScore}</span>
            <span className="cdp-trust-label">Tín nhiệm</span>
          </div>
        </div>
        <div className="cdp-behavior-stats">
          <div className="cdp-stat-item">
            <span>Tỉ lệ hủy đơn</span>
            <strong style={{ color: behavior.cancelRate > 20 ? 'var(--danger)' : 'var(--success)' }}>
              {behavior.cancelRate}% ({behavior.cancelCount}/{behavior.totalBooked})
            </strong>
          </div>
          <div className="cdp-stat-item">
            <span>Thời gian phản hồi TB</span>
            <strong>{behavior.avgResponseTime}</strong>
          </div>
          <div className="cdp-stat-item">
            <span>Số khiếu nại gửi lên</span>
            <strong style={{ color: behavior.complaints > 0 ? 'var(--warning)' : 'inherit' }}>{behavior.complaints} vụ</strong>
          </div>
          <div className="cdp-stat-item">
            <span>Số lần hoàn tiền</span>
            <strong>{behavior.refundCount} lần</strong>
          </div>
        </div>
      </div>

      {/* Cancel rate bar */}
      {behavior.cancelRate > 20 && (
        <div className="cdp-alert-box cdp-alert-warning" style={{ marginTop: 12 }}>
          <AlertTriangle size={15} />
          <span>Tỉ lệ hủy đơn cao (<strong>{behavior.cancelRate}%</strong>) – Hệ thống đã tự động hạ điểm tín nhiệm khiến thợ ít nhận đơn hơn.</span>
        </div>
      )}

      {/* Worker private notes */}
      <div className="cdp-section-title" style={{ marginTop: 16 }}>
        <Lock size={13} /> Ghi chú riêng tư của Thợ
        <span className="cdp-admin-only">🔒 Chỉ Admin thấy</span>
      </div>
      {behavior.workerNotes.length === 0
        ? <div className="cdp-empty">Chưa có ghi chú nào từ thợ.</div>
        : (
          <div className="cdp-notes-list">
            {behavior.workerNotes.map((n, i) => (
              <div key={i} className="cdp-note-card">
                <div className="cdp-note-header">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(n.worker)}&background=6366F1&color=fff&size=32`}
                    alt="" className="cdp-note-avatar"
                  />
                  <span className="cdp-note-worker">{n.worker}</span>
                  <span className="cdp-note-date">{n.date}</span>
                </div>
                <p className="cdp-note-text">"{n.note}"</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'payment',  label: '💳 Cổng thanh toán', Icon: CreditCard },
  { id: 'orders',   label: '📋 Log đơn hàng',    Icon: FileText },
  { id: 'voucher',  label: '🎟 Voucher & Gian lận', Icon: Tag },
  { id: 'behavior', label: '📊 Hành vi',          Icon: BarChart2 },
];

const CustomerDetailPanel = ({ customer, onClose }) => {
  const [activeTab, setActiveTab] = useState('payment');
  const data = customerDetailData[customer.id] || { paymentLogs: [], orderLogs: [], voucherLogs: [], deviceHistory: [], accountStatus: 'active', behavior: { cancelRate: 0, cancelCount: 0, totalBooked: 0, avgResponseTime: '—', trustScore: 50, workerNotes: [], complaints: 0, refundCount: 0 } };
  const { label: tierLabel, color: tierColor } = getTierConfig(customer.tier);

  const statusMap = { active: { label: 'Hoạt động', color: 'var(--success)' }, suspended: { label: 'Tạm khóa', color: 'var(--warning)' }, banned: { label: 'Đã khóa', color: 'var(--danger)' } };
  const accStatus = statusMap[data.accountStatus] || statusMap.active;

  return (
    <>
      {/* Backdrop */}
      <div className="cdp-backdrop" onClick={onClose} />

      {/* Slide-in panel */}
      <div className="cdp-panel">
        {/* Header */}
        <div className="cdp-panel-header">
          <div className="cdp-customer-info">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=8B5CF6&color=fff&size=64`}
              alt={customer.name} className="cdp-avatar"
            />
            <div>
              <h3 className="cdp-customer-name">{customer.name}</h3>
              <div className="cdp-customer-meta">
                <span className="cdp-tier-badge" style={{ color: tierColor, background: `${tierColor}18` }}>{tierLabel}</span>
                <span className="cdp-acc-status" style={{ color: accStatus.color }}>● {accStatus.label}</span>
                <span className="cdp-id-chip">{customer.id}</span>
                <span className="cdp-phone">{customer.phone}</span>
              </div>
              <div className="cdp-customer-totals">
                <span>{customer.totalOrders} đơn · {formatVND(customer.totalSpent)} tổng chi tiêu</span>
              </div>
            </div>
          </div>
          <button className="cdp-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cdp-admin-badge">🔒 Chế độ Admin – Dữ liệu đặc quyền nội bộ</div>

        {/* Tabs */}
        <div className="cdp-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`cdp-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="cdp-body">
          {activeTab === 'payment'  && <TabPayment  data={data} customerName={customer.name} />}
          {activeTab === 'orders'   && <TabOrderLog data={data} />}
          {activeTab === 'voucher'  && <TabVoucher  data={data} />}
          {activeTab === 'behavior' && <TabBehavior data={data} />}
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPanel;
