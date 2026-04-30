import React, { useState } from 'react';
import {
  Download, CheckCircle, Clock, MapPin, Zap,
  DollarSign, AlertCircle
} from 'lucide-react';
import { activeBookings, withdrawalRequests, financeExportData } from '../../utils/mockData';
import { formatVND, getBookingStatusConfig } from '../../utils/format';
import './Finance.css';

// ─── Simple Map Placeholder ───────────────────────────────────────────────────
const LiveMapPlaceholder = ({ bookings }) => (
  <div className="live-map-container">
    <div className="live-map-overlay">
      <p className="live-map-title">🗺 Bản đồ trực tiếp</p>
      <p className="live-map-sub">Kết nối Google Maps API để xem vị trí đơn hàng theo thời gian thực</p>
    </div>
    {/* Fake map dots */}
    {bookings.filter((b) => b.lat).map((b, i) => {
      const { color } = getBookingStatusConfig(b.status);
      return (
        <div
          key={b.id}
          className="map-dot"
          title={`${b.id}: ${b.customer} → ${b.worker}`}
          style={{
            left: `${10 + i * 13}%`,
            top: `${20 + (i % 3) * 22}%`,
            background: color,
          }}
        >
          <MapPin size={10} />
        </div>
      );
    })}
  </div>
);

// ─── Withdrawal Row ───────────────────────────────────────────────────────────
const WithdrawalRow = ({ req, onPay }) => {
  const isPending = req.status === 'pending';
  return (
    <tr className={isPending ? '' : 'row-paid'}>
      <td>
        <div className="worker-cell">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.workerName)}&background=6366F1&color=fff&size=64`}
            alt={req.workerName}
            className="table-avatar"
          />
          <div>
            <p className="worker-name">{req.workerName}</p>
            <p className="worker-id">{req.workerId}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="bank-info">
          <span className="bank-name">{req.bank}</span>
          <span className="bank-acc">{req.accountNo}</span>
        </div>
      </td>
      <td>
        <span className="withdrawal-amount">{formatVND(req.amount)}</span>
      </td>
      <td>
        <span className="balance-chip">{formatVND(req.balance)} còn lại</span>
      </td>
      <td>{req.requestedAt}</td>
      <td>
        {isPending ? (
          <span className="status-badge" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--warning)' }}>
            <Clock size={12} /> Chờ duyệt
          </span>
        ) : (
          <div>
            <span className="status-badge" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)' }}>
              <CheckCircle size={12} /> Đã trả
            </span>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>{req.paidAt}</p>
          </div>
        )}
      </td>
      <td>
        {isPending && (
          <button className="btn btn-success btn-sm" onClick={() => onPay(req.id)}>
            <CheckCircle size={14} /> Đã thanh toán
          </button>
        )}
      </td>
    </tr>
  );
};

// ─── Export Button ────────────────────────────────────────────────────────────
const ExportSection = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);

    // Build CSV
    const headers = ['Ngày', 'Mã đơn', 'Khách hàng', 'Thợ', 'Dịch vụ', 'Tổng tiền', 'Hoa hồng', 'Thợ nhận', 'Trạng thái'];
    const rows = financeExportData.map((r) => [
      r.date, r.orderId, r.customer, r.worker, r.service,
      r.amount, r.commission, r.net, r.status
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel Vietnamese
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-tai-chinh-thang-${new Date().getMonth() + 1}-${new Date().getFullYear()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setExporting(false), 1500);
  };

  return (
    <div className="export-section">
      <div className="export-info">
        <DollarSign size={20} className="export-icon" />
        <div>
          <p className="export-title">Xuất báo cáo tài chính</p>
          <p className="export-sub">Tải file CSV (mở bằng Excel) – tất cả giao dịch tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</p>
        </div>
      </div>
      <button className="btn btn-export" onClick={handleExport} disabled={exporting}>
        <Download size={16} />
        {exporting ? 'Đang tải...' : 'Xuất file CSV / Excel'}
      </button>
    </div>
  );
};

// ─── Finance Page ─────────────────────────────────────────────────────────────
const Finance = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const bookings = activeBookings;
  const [withdrawals, setWithdrawals] = useState(withdrawalRequests);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePay = (id) => {
    const now = new Date();
    const paid = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`;
    setWithdrawals((prev) =>
      prev.map((w) => w.id === id ? { ...w, status: 'paid', paidAt: paid } : w)
    );
    showToast('✅ Đã đánh dấu thanh toán! Số dư thợ đã được cập nhật.');
  };

  const pendingCount = withdrawals.filter((w) => w.status === 'pending').length;
  const pendingTotal = withdrawals.filter((w) => w.status === 'pending').reduce((s, w) => s + w.amount, 0);

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="finance-page">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng & Thu nhập</h1>
          <p className="page-subtitle">Giám sát đơn hàng, duyệt lệnh rút tiền và báo cáo tài chính</p>
        </div>
        {pendingCount > 0 && (
          <div className="pending-alert">
            <AlertCircle size={16} />
            {pendingCount} lệnh rút tiền · {formatVND(pendingTotal)} chờ duyệt
          </div>
        )}
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
          Giám sát đơn hàng
          <span className="tab-badge">{bookings.filter((b) => b.status !== 'completed').length}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setActiveTab('withdrawals')}>
          Rút tiền
          {pendingCount > 0 && <span className="tab-badge" style={{ background: 'var(--warning)' }}>{pendingCount}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}>
          Báo cáo & Xuất file
        </button>
      </div>

      {/* ── Bookings Monitor ── */}
      {activeTab === 'bookings' && (
        <div className="bookings-layout">
          {/* Live Map */}
          <div className="card map-card">
            <div className="map-card-header">
              <h3 className="card-section-title">📍 Bản đồ đơn hàng</h3>
              <div className="live-badge"><Zap size={11} /> LIVE</div>
            </div>
            <LiveMapPlaceholder bookings={bookings} />
          </div>

          {/* Order List */}
          <div className="card">
            <div className="card-toolbar">
              <h3 className="card-section-title">Danh sách đơn</h3>
              <div className="filter-btns">
                {['all', 'in_progress', 'waiting', 'completed'].map((s) => (
                  <button
                    key={s}
                    className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === 'all' ? 'Tất cả' : getBookingStatusConfig(s).label}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-list">
              {filteredBookings.map((b) => {
                const { label, color, bg } = getBookingStatusConfig(b.status);
                return (
                  <div key={b.id} className="booking-row">
                    <div className="booking-id-col">
                      <span className="booking-id">{b.id}</span>
                    </div>
                    <div className="booking-main">
                      <div className="booking-parties">
                        <span className="booking-customer">👤 {b.customer}</span>
                        <span className="booking-arrow">→</span>
                        <span className="booking-worker">🔧 {b.worker}</span>
                      </div>
                      <div className="booking-details">
                        <span>{b.service}</span>
                        <span>📍 {b.address}</span>
                        <span>🕐 {b.startedAt}</span>
                        <span className="booking-amount">{formatVND(b.amount)}</span>
                      </div>
                    </div>
                    <span className="status-badge" style={{ background: bg, color }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Withdrawals ── */}
      {activeTab === 'withdrawals' && (
        <div className="card">
          {pendingCount > 0 && (
            <div className="withdrawal-summary">
              <div className="ws-item">
                <p>Đang chờ duyệt</p>
                <strong style={{ color: 'var(--warning)' }}>{pendingCount} lệnh</strong>
              </div>
              <div className="ws-item">
                <p>Tổng cần chuyển</p>
                <strong style={{ color: 'var(--danger)' }}>{formatVND(pendingTotal)}</strong>
              </div>
              <div className="ws-item">
                <p>Đã thanh toán</p>
                <strong style={{ color: 'var(--success)' }}>
                  {withdrawals.filter((w) => w.status === 'paid').length} lệnh
                </strong>
              </div>
            </div>
          )}

          <table className="data-table">
            <thead>
              <tr>
                <th>Thợ</th>
                <th>Ngân hàng / Tài khoản</th>
                <th>Số tiền rút</th>
                <th>Số dư hiện tại</th>
                <th>Thời gian yêu cầu</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((req) => (
                <WithdrawalRow key={req.id} req={req} onPay={handlePay} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Export ── */}
      {activeTab === 'export' && (
        <div className="card">
          <ExportSection />

          {/* Finance summary table */}
          <div style={{ marginTop: 24 }}>
            <h3 className="card-section-title">Preview – Giao dịch gần nhất</h3>
            <table className="data-table" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Thợ</th>
                  <th>Dịch vụ</th>
                  <th>Tổng tiền</th>
                  <th>Hoa hồng (15.5%)</th>
                  <th>Thợ nhận</th>
                </tr>
              </thead>
              <tbody>
                {financeExportData.map((r) => (
                  <tr key={r.orderId}>
                    <td>{r.date}</td>
                    <td><span className="booking-id">{r.orderId}</span></td>
                    <td>{r.customer}</td>
                    <td>{r.worker}</td>
                    <td><span className="service-tag">{r.service}</span></td>
                    <td>{formatVND(r.amount)}</td>
                    <td style={{ color: 'var(--accent-primary)' }}>{formatVND(r.commission)}</td>
                    <td style={{ color: 'var(--success)' }}>{formatVND(r.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
