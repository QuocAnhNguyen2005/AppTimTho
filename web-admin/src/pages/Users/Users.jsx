import React, { useState } from 'react';
import {
  Search, MessageSquare, ChevronRight, XCircle,
  RotateCcw, CheckCircle, AlertTriangle, Crown, ExternalLink
} from 'lucide-react';
import { customerList, tickets, tierRules } from '../../utils/mockData';
import { formatVND, formatDate, getTierConfig } from '../../utils/format';
import CustomerDetailPanel from './CustomerDetailPanel';
import './Users.css';
import './CustomerDetailPanel.css';

// ─── Tier Badge ──────────────────────────────────────────────────────────────
const TierBadge = ({ tier }) => {
  const { label, color, bg } = getTierConfig(tier);
  return (
    <span className="tier-badge" style={{ color, background: bg }}>
      <Crown size={11} />
      {label}
    </span>
  );
};

// ─── Ticket Chat Modal ────────────────────────────────────────────────────────
const TicketModal = ({ ticket, onClose, onRefund, onDismiss }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal-box" style={{ maxWidth: '600px' }}>
      <div className="modal-header">
        <div>
          <h3>Khiếu nại #{ticket.id}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {ticket.userName} → {ticket.workerName} · {ticket.service} · {ticket.createdAt}
          </p>
        </div>
        <button className="modal-close" onClick={onClose}><XCircle size={22} /></button>
      </div>

      <div className="modal-body">
        {/* Issue Summary */}
        <div className="ticket-issue">
          <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <p>{ticket.issue}</p>
        </div>

        {/* Amount */}
        <div className="ticket-amount">
          Giá trị đơn: <strong>{formatVND(ticket.amount)}</strong>
          <span className={`ticket-status ticket-${ticket.status}`}>
            {ticket.status === 'open' ? 'Chưa giải quyết' : 'Đã xử lý'}
          </span>
        </div>

        {/* Chat log */}
        <h5 className="chat-title">Lịch sử chat giữa 2 bên</h5>
        <div className="chat-log">
          {ticket.chat.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.from}`}>
              <div className="bubble-meta">
                <span className="bubble-sender">
                  {msg.from === 'user' ? ticket.userName : ticket.workerName}
                </span>
                <span className="bubble-time">{msg.time}</span>
              </div>
              <div className="bubble-text">{msg.message}</div>
            </div>
          ))}
        </div>
      </div>

      {ticket.status === 'open' && (
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={() => onDismiss(ticket.id)}>
            <CheckCircle size={16} /> Không hoàn tiền
          </button>
          <button className="btn btn-success" onClick={() => onRefund(ticket.id, ticket.amount)}>
            <RotateCcw size={16} /> Hoàn tiền {formatVND(ticket.amount)}
          </button>
        </div>
      )}
    </div>
  </div>
);

// ─── Tier Rules Editor ────────────────────────────────────────────────────────
const TierRulesEditor = ({ rules, onSave }) => {
  const [editRules, setEditRules] = useState(rules);

  const update = (idx, field, val) => {
    setEditRules((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };

  return (
    <div className="tier-rules-editor">
      <h5 className="tier-rules-title">⚙️ Cấu hình phân hạng tự động</h5>
      <p className="tier-rules-sub">Khách hàng sẽ được tự động nâng hạng dựa trên tổng chi tiêu tích lũy.</p>
      <div className="tier-rules-list">
        {editRules.map((rule, i) => (
          <div key={rule.tier} className="tier-rule-row" style={{ borderLeft: `4px solid ${rule.color}` }}>
            <TierBadge tier={rule.tier} />
            <div className="tier-rule-inputs">
              <div className="tier-rule-field">
                <label>Từ (đ)</label>
                <input
                  type="number"
                  value={rule.minSpend}
                  onChange={(e) => update(i, 'minSpend', +e.target.value)}
                  disabled={i === 0}
                />
              </div>
              <span className="tier-rule-sep">→</span>
              <div className="tier-rule-field">
                <label>Đến (đ)</label>
                <input
                  type="number"
                  value={rule.maxSpend ?? ''}
                  onChange={(e) => update(i, 'maxSpend', e.target.value ? +e.target.value : null)}
                  placeholder="Không giới hạn"
                  disabled={i === editRules.length - 1}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-success" style={{ marginTop: 12 }} onClick={() => onSave(editRules)}>
        Lưu cấu hình
      </button>
    </div>
  );
};

// ─── Users Page ───────────────────────────────────────────────────────────────
const Users = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState(customerList);
  const [ticketList, setTicketList] = useState(tickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentRules, setCurrentRules] = useState(tierRules);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Skeleton Loading
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Debounce for search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefund = (ticketId, amount) => {
    setTicketList((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: 'resolved' } : t));
    setSelectedTicket(null);
    showToast(`✅ Đã hoàn tiền ${formatVND(amount)} cho khách hàng.`);
  };

  const handleDismiss = (ticketId) => {
    setTicketList((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: 'resolved' } : t));
    setSelectedTicket(null);
    showToast('📋 Đã đóng khiếu nại, không hoàn tiền.', 'warning');
  };

  const handleSaveRules = (rules) => {
    setCurrentRules(rules);
    // Recalculate tier for each user
    setUsers((prev) => prev.map((u) => {
      const tier = rules.reduce((acc, r) => {
        const inRange = u.totalSpent >= r.minSpend && (r.maxSpend === null || u.totalSpent <= r.maxSpend);
        return inRange ? r.tier : acc;
      }, 'bronze');
      return { ...u, tier };
    }));
    showToast('✅ Đã lưu cấu hình phân hạng và cập nhật tất cả khách hàng!');
  };

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || u.phone.includes(debouncedSearch)
  );

  const openTickets = ticketList.filter((t) => t.status === 'open').length;

  return (
    <div className="users-page">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Khách hàng</h1>
          <p className="page-subtitle">Quản lý tài khoản, phân hạng và xử lý khiếu nại</p>
        </div>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          Danh sách khách <span className="tab-badge">{users.length}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
          Khiếu nại {openTickets > 0 && <span className="tab-badge" style={{ background: 'var(--danger)' }}>{openTickets}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'tiers' ? 'active' : ''}`} onClick={() => setActiveTab('tiers')}>
          Phân hạng
        </button>
      </div>

      {/* ── Customer List ── */}
      {activeTab === 'list' && (
        <div className="card">
          <div className="table-toolbar">
            <div className="search-wrap">
              <Search size={16} className="search-icon-inner" />
              <input
                type="text"
                className="search-box with-icon"
                placeholder="Tìm theo tên hoặc SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Hạng</th>
                <th>Số điện thoại</th>
                <th>Tổng đơn</th>
                <th>Tổng chi tiêu</th>
                <th>Ngày tham gia</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div className="worker-cell">
                        <div className="skeleton-avatar"></div>
                        <div>
                          <div className="skeleton-text skeleton-title"></div>
                          <div className="skeleton-text skeleton-sub"></div>
                        </div>
                      </div>
                    </td>
                    <td><div className="skeleton-text skeleton-badge"></div></td>
                    <td><div className="skeleton-text skeleton-text-short"></div></td>
                    <td><div className="skeleton-text skeleton-text-short"></div></td>
                    <td><div className="skeleton-text skeleton-text-short"></div></td>
                    <td><div className="skeleton-text skeleton-text-short"></div></td>
                  </tr>
                ))
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="cdp-table-row-click" onClick={() => setSelectedCustomer(u)}>
                    <td>
                      <div className="worker-cell">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=8B5CF6&color=fff&size=64`}
                          alt={u.name}
                          className="table-avatar"
                        />
                        <div>
                          <div className="cdp-row-name-link">
                            <p className="worker-name">{u.name}</p>
                            <span className="cdp-view-hint"><ExternalLink size={11} /> Chi tiết</span>
                          </div>
                          <p className="worker-id">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td><TierBadge tier={u.tier} /></td>
                    <td>{u.phone}</td>
                    <td><strong>{u.totalOrders}</strong> đơn</td>
                    <td><strong>{formatVND(u.totalSpent)}</strong></td>
                    <td>{formatDate(u.joinedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tickets ── */}
      {activeTab === 'tickets' && (
        <div className="card">
          <div className="tickets-list">
            {ticketList.map((t) => (
              <div
                key={t.id}
                className={`ticket-row ${t.status === 'resolved' ? 'ticket-resolved' : ''}`}
                onClick={() => setSelectedTicket(t)}
              >
                <div className="ticket-avatar">
                  <MessageSquare size={20} />
                </div>
                <div className="ticket-content">
                  <div className="ticket-top">
                    <span className="ticket-id">{t.id}</span>
                    <span className={`ticket-status ticket-${t.status}`}>
                      {t.status === 'open' ? 'Chưa giải quyết' : 'Đã xử lý'}
                    </span>
                  </div>
                  <p className="ticket-issue">{t.issue}</p>
                  <div className="ticket-meta">
                    <span>👤 {t.userName}</span>
                    <span>🔧 {t.workerName}</span>
                    <span>🛠 {t.service}</span>
                    <span>💰 {formatVND(t.amount)}</span>
                  </div>
                </div>
                <div className="ticket-arrow"><ChevronRight size={18} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tier Rules ── */}
      {activeTab === 'tiers' && (
        <div className="card">
          <TierRulesEditor rules={currentRules} onSave={handleSaveRules} />
        </div>
      )}

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onRefund={handleRefund}
          onDismiss={handleDismiss}
        />
      )}

      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default Users;
