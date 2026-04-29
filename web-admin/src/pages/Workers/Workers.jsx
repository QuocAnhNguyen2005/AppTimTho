import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Shield, ShieldOff, Eye,
  Star, Phone, Clock, User, AlertTriangle
} from 'lucide-react';
import { pendingWorkers, activeWorkers } from '../../utils/mockData';
import { formatVND, getWorkerStatusConfig } from '../../utils/format';
import './Workers.css';

// ─── Worker Detail Modal ─────────────────────────────────────────────────────
const WorkerDetailModal = ({ worker, onClose, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h3>Chi tiết hồ sơ thợ</h3>
          <button className="modal-close" onClick={onClose}><XCircle size={22} /></button>
        </div>

        <div className="modal-body worker-detail-body">
          {/* Portrait + Info */}
          <div className="worker-detail-top">
            <img src={worker.portrait} alt={worker.name} className="worker-portrait" />
            <div className="worker-detail-info">
              <h4 className="worker-detail-name">{worker.name}</h4>
              <div className="worker-detail-row"><Phone size={14} /><span>{worker.phone}</span></div>
              <div className="worker-detail-row"><Shield size={14} /><span>{worker.service}</span></div>
              <div className="worker-detail-row"><Clock size={14} /><span>Đăng ký: {worker.registeredAt}</span></div>
              <div className="conduct-cert">
                <User size={14} />
                <span>Xác nhận hạnh kiểm: {worker.conductCert}</span>
              </div>
            </div>
          </div>

          {/* CCCD */}
          <div className="cccd-section">
            <h5>Ảnh CCCD / Căn Cước Công Dân</h5>
            <div className="cccd-images">
              <div className="cccd-img-wrap">
                <p>Mặt trước</p>
                <img src={worker.cccdFront} alt="CCCD Mặt trước" />
              </div>
              <div className="cccd-img-wrap">
                <p>Mặt sau</p>
                <img src={worker.cccdBack} alt="CCCD Mặt sau" />
              </div>
            </div>
          </div>

          {/* Reject form */}
          {showRejectForm && (
            <div className="reject-form">
              <label>Lý do từ chối (sẽ gửi thông báo cho thợ)</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Ảnh CCCD không rõ nét, vui lòng chụp lại..."
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => setShowRejectForm(!showRejectForm)}>
            <XCircle size={16} />
            {showRejectForm ? 'Huỷ' : 'Từ chối'}
          </button>
          {showRejectForm && (
            <button
              className="btn btn-danger"
              disabled={!rejectReason.trim()}
              onClick={() => onReject(worker.id, rejectReason)}
            >
              Xác nhận từ chối
            </button>
          )}
          {!showRejectForm && (
            <button className="btn btn-success" onClick={() => onApprove(worker.id)}>
              <CheckCircle size={16} />
              Duyệt hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Discipline Modal ────────────────────────────────────────────────────────
const DisciplineModal = ({ worker, onClose, onAction }) => {
  const [reason, setReason] = useState('');
  const [type, setType] = useState('suspend_3');

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>Kỷ luật thợ</h3>
          <button className="modal-close" onClick={onClose}><XCircle size={22} /></button>
        </div>
        <div className="modal-body">
          <div className="discipline-worker-info">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=EF4444&color=fff&size=64`} alt="" className="disc-avatar" />
            <div>
              <p className="discipline-name">{worker.name}</p>
              <p className="discipline-sub">Điểm uy tín: {worker.trustScore} ⭐ · Đánh giá 1 sao: {worker.oneStarCount} lần</p>
            </div>
          </div>

          {worker.oneStarCount >= 3 && (
            <div className="alert-item alert-danger" style={{ marginBottom: 16 }}>
              <AlertTriangle size={16} className="alert-icon" />
              <span>Thợ này đã bị đánh giá 1 sao 3 lần. Cần xem xét kỷ luật!</span>
            </div>
          )}

          <div className="form-group">
            <label>Hình thức kỷ luật</label>
            <div className="radio-group">
              <label className={`radio-item ${type === 'suspend_3' ? 'selected' : ''}`}>
                <input type="radio" value="suspend_3" checked={type === 'suspend_3'} onChange={() => setType('suspend_3')} />
                <ShieldOff size={16} /> Khóa tạm thời 3 ngày
              </label>
              <label className={`radio-item ${type === 'ban' ? 'selected' : ''}`}>
                <input type="radio" value="ban" checked={type === 'ban'} onChange={() => setType('ban')} />
                <XCircle size={16} /> Khóa vĩnh viễn
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Lý do kỷ luật</label>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Mô tả hành vi vi phạm..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn btn-danger" disabled={!reason.trim()} onClick={() => onAction(worker.id, type, reason)}>
            Xác nhận kỷ luật
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Trust Score Display ─────────────────────────────────────────────────────
const TrustScore = ({ score }) => {
  const color = score >= 4 ? '#10B981' : score >= 3 ? '#F59E0B' : '#EF4444';
  return (
    <div className="trust-score" style={{ color }}>
      <Star size={14} fill={color} />
      <span>{score.toFixed(1)}</span>
    </div>
  );
};

// ─── Workers Page ─────────────────────────────────────────────────────────────
const Workers = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingList, setPendingList] = useState(pendingWorkers);
  const [activeList, setActiveList] = useState(activeWorkers);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [disciplineWorker, setDisciplineWorker] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setPendingList((prev) => prev.filter((w) => w.id !== id));
    setSelectedWorker(null);
    showToast('✅ Đã duyệt hồ sơ thành công!');
  };

  const handleReject = (id, reason) => {
    setPendingList((prev) => prev.filter((w) => w.id !== id));
    setSelectedWorker(null);
    showToast(`❌ Đã từ chối hồ sơ. Lý do: ${reason}`, 'error');
  };

  const handleDiscipline = (id, type, reason) => {
    setActiveList((prev) => prev.map((w) =>
      w.id === id ? { ...w, status: type === 'ban' ? 'banned' : 'suspended', disciplineReason: reason } : w
    ));
    setDisciplineWorker(null);
    const msg = type === 'ban' ? '🔒 Đã khóa vĩnh viễn tài khoản thợ.' : '⏸ Đã tạm khóa thợ 3 ngày.';
    showToast(msg, 'warning');
  };

  const filteredActive = activeList.filter((w) =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.phone.includes(searchTerm)
  );

  return (
    <div className="workers-page">
      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Thợ</h1>
          <p className="page-subtitle">Kiểm soát chất lượng nhân sự trên nền tảng</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Chờ phê duyệt
          <span className="tab-badge">{pendingList.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Đang hoạt động
          <span className="tab-badge">{activeList.length}</span>
        </button>
      </div>

      {/* ── TAB: Pending ── */}
      {activeTab === 'pending' && (
        <div className="card">
          {pendingList.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={48} color="var(--success)" />
              <p>Không có hồ sơ nào chờ duyệt</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Thợ</th>
                  <th>Dịch vụ</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đăng ký</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <div className="worker-cell">
                        <img src={w.portrait} alt={w.name} className="table-avatar" />
                        <div>
                          <p className="worker-name">{w.name}</p>
                          <p className="worker-id">{w.id}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="service-tag">{w.service}</span></td>
                    <td>{w.phone}</td>
                    <td>{w.registeredAt}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-outline" onClick={() => setSelectedWorker(w)}>
                          <Eye size={14} /> Xem hồ sơ
                        </button>
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(w.id)}>
                          <CheckCircle size={14} />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleReject(w.id, 'Hồ sơ không đạt yêu cầu')}>
                          <XCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── TAB: Active ── */}
      {activeTab === 'active' && (
        <div className="card">
          <div className="table-toolbar">
            <input
              type="text"
              className="search-box"
              placeholder="Tìm theo tên hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Thợ</th>
                <th>Dịch vụ</th>
                <th>Trạng thái</th>
                <th>Điểm Uy Tín</th>
                <th>Việc hoàn thành</th>
                <th>Doanh thu</th>
                <th>Kỷ luật</th>
              </tr>
            </thead>
            <tbody>
              {filteredActive.map((w) => {
                const sc = getWorkerStatusConfig(w.status === 'banned' ? 'offline' : w.status === 'suspended' ? 'offline' : w.status);
                return (
                  <tr key={w.id} className={w.status === 'banned' ? 'row-banned' : w.status === 'suspended' ? 'row-suspended' : ''}>
                    <td>
                      <div className="worker-cell">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=6366F1&color=fff&size=64`}
                          alt={w.name}
                          className="table-avatar"
                        />
                        <div>
                          <p className="worker-name">{w.name}</p>
                          <p className="worker-id">{w.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="service-tag">{w.service}</span></td>
                    <td>
                      {w.status === 'banned' ? (
                        <span className="status-badge" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.12)' }}>Đã khóa</span>
                      ) : w.status === 'suspended' ? (
                        <span className="status-badge" style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.12)' }}>Tạm khóa</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="status-dot" style={{ background: sc.color }} />
                          <span style={{ fontSize: '0.85rem' }}>{sc.label}</span>
                        </div>
                      )}
                    </td>
                    <td><TrustScore score={w.trustScore} /></td>
                    <td>{w.completedJobs} đơn</td>
                    <td>{formatVND(w.revenue)}</td>
                    <td>
                      {w.status !== 'banned' && (
                        <button
                          className={`btn btn-sm ${w.oneStarCount >= 3 ? 'btn-danger' : 'btn-outline'}`}
                          onClick={() => setDisciplineWorker(w)}
                          title="Kỷ luật thợ"
                        >
                          <ShieldOff size={14} />
                          {w.oneStarCount >= 3 && <span style={{ marginLeft: 4 }}>!</span>}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {selectedWorker && (
        <WorkerDetailModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {disciplineWorker && (
        <DisciplineModal
          worker={disciplineWorker}
          onClose={() => setDisciplineWorker(null)}
          onAction={handleDiscipline}
        />
      )}
    </div>
  );
};

export default Workers;
