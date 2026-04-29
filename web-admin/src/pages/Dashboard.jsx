import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp, ShoppingBag, Zap, UserPlus,
  AlertTriangle, XCircle, ChevronRight, RefreshCw
} from 'lucide-react';
import { dashboardMetrics, revenueData7Days, revenueData30Days, alerts } from '../../utils/mockData';
import { formatVND, formatShort } from '../../utils/format';
import './Dashboard.css';

// ─── Quick Metric Card ───────────────────────────────────────────────────────
const MetricCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="metric-card" style={{ '--accent': color }}>
    <div className="metric-icon-wrap" style={{ background: `${color}20` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div className="metric-body">
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {sub && <p className="metric-sub">{sub}</p>}
    </div>
    {trend !== undefined && (
      <div className={`metric-trend ${trend >= 0 ? 'up' : 'down'}`}>
        <TrendingUp size={14} />
        <span>{Math.abs(trend)}%</span>
      </div>
    )}
  </div>
);

// ─── Simple Canvas Chart (no Chart.js dependency) ───────────────────────────
const RevenueChart = ({ data, period }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { clientWidth: W, clientHeight: H } = canvas;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const pad = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const paid = data.customerPaid;
    const commission = data.platformCommission;
    const labels = data.labels;
    const maxVal = Math.max(...paid, ...commission);
    const minVal = 0;

    const xStep = chartW / (labels.length - 1);
    const yScale = (v) => pad.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const gridColor = isDark ? '#334155' : '#E2E8F0';

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const y = pad.top + (chartH / gridCount) * i;
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
      // Y labels
      const val = maxVal - (maxVal / gridCount) * i;
      ctx.setLineDash([]);
      ctx.fillStyle = textColor;
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(formatShort(val), pad.left - 8, y + 4);
    }

    // X Labels
    const step = period === 30 ? 5 : 1;
    labels.forEach((label, i) => {
      if (period === 30 && i % step !== 0) return;
      const x = pad.left + i * xStep;
      ctx.fillStyle = textColor;
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, H - pad.bottom + 16);
    });

    // Draw line helper
    const drawLine = (values, color, fillColor) => {
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = pad.left + i * xStep;
        const y = yScale(v);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      // Fill area
      ctx.lineTo(pad.left + (values.length - 1) * xStep, pad.top + chartH);
      ctx.lineTo(pad.left, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Line
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = pad.left + i * xStep;
        const y = yScale(v);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.setLineDash([]);
      ctx.stroke();

      // Dots
      values.forEach((v, i) => {
        const x = pad.left + i * xStep;
        const y = yScale(v);
        if (period === 30 && i % step !== 0) return;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = isDark ? '#1E293B' : '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    drawLine(paid, '#6366F1', 'rgba(99,102,241,0.08)');
    drawLine(commission, '#10B981', 'rgba(16,185,129,0.08)');
  }, [data, period]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '240px', display: 'block' }}
    />
  );
};

// ─── Alert Item ──────────────────────────────────────────────────────────────
const AlertItem = ({ alert }) => {
  const Icon = alert.type === 'danger' ? XCircle : AlertTriangle;
  return (
    <div className={`alert-item alert-${alert.type}`}>
      <Icon size={16} className="alert-icon" />
      <span>{alert.message}</span>
      <a href={alert.link} className="alert-link">
        Xem <ChevronRight size={14} />
      </a>
    </div>
  );
};

// ─── Dashboard Page ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const [period, setPeriod] = useState(7);
  const [metrics] = useState(dashboardMetrics);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => setLastRefresh(new Date());

  const chartData = period === 7 ? revenueData7Days : revenueData30Days;
  const totalCommission = chartData.platformCommission.reduce((a, b) => a + b, 0);
  const totalPaid = chartData.customerPaid.reduce((a, b) => a + b, 0);

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tổng quan hệ thống</h1>
          <p className="page-subtitle">
            Cập nhật lúc {lastRefresh.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <button className="btn-refresh" onClick={handleRefresh}>
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="alert-banner">
          <div className="alert-banner-title">
            <AlertTriangle size={16} />
            Cần xử lý ngay
          </div>
          {alerts.map((a) => <AlertItem key={a.id} alert={a} />)}
        </div>
      )}

      {/* Top Metrics */}
      <div className="metrics-grid">
        <MetricCard
          icon={TrendingUp}
          label="Doanh thu hôm nay"
          value={formatVND(metrics.revenueToday)}
          sub={`Hoa hồng: ${formatVND(Math.round(metrics.revenueToday * 0.155))}`}
          color="#6366F1"
          trend={12.4}
        />
        <MetricCard
          icon={ShoppingBag}
          label="Đơn đang chạy"
          value={metrics.activeOrders}
          sub="Thời gian thực"
          color="#F59E0B"
          trend={5.2}
        />
        <MetricCard
          icon={Zap}
          label="Thợ đang Online"
          value={metrics.onlineWorkers}
          sub="/ 82 thợ hoạt động"
          color="#10B981"
          trend={-3.1}
        />
        <MetricCard
          icon={UserPlus}
          label="Người dùng đăng ký mới"
          value={metrics.newUsers}
          sub="Hôm nay"
          color="#EC4899"
          trend={18.7}
        />
      </div>

      {/* Revenue Chart */}
      <div className="card chart-card">
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Biểu đồ doanh thu</h2>
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: '#6366F1' }} />
              <span>Khách trả: <strong>{formatVND(totalPaid)}</strong></span>
              <span className="legend-dot" style={{ background: '#10B981' }} />
              <span>Hoa hồng: <strong>{formatVND(totalCommission)}</strong></span>
            </div>
          </div>
          <div className="period-toggle">
            <button
              className={period === 7 ? 'active' : ''}
              onClick={() => setPeriod(7)}
            >
              7 ngày
            </button>
            <button
              className={period === 30 ? 'active' : ''}
              onClick={() => setPeriod(30)}
            >
              30 ngày
            </button>
          </div>
        </div>
        <RevenueChart data={chartData} period={period} />
      </div>

      {/* Bottom Row */}
      <div className="dashboard-bottom-row">
        {/* Recent Alerts detail */}
        <div className="card">
          <h2 className="card-section-title">📊 Tóm tắt hoạt động</h2>
          <div className="activity-list">
            <div className="activity-row">
              <span>Tổng đơn tháng này</span>
              <strong>342</strong>
            </div>
            <div className="activity-row">
              <span>Đơn hoàn thành</span>
              <strong style={{ color: 'var(--success)' }}>318 (92.9%)</strong>
            </div>
            <div className="activity-row">
              <span>Đơn bị hủy</span>
              <strong style={{ color: 'var(--danger)' }}>24 (7.1%)</strong>
            </div>
            <div className="activity-row">
              <span>Điểm trung bình thợ</span>
              <strong>4.6 ⭐</strong>
            </div>
            <div className="activity-row">
              <span>Khiếu nại tháng này</span>
              <strong style={{ color: 'var(--warning)' }}>12 vụ</strong>
            </div>
            <div className="activity-row">
              <span>Hoàn tiền đã thực hiện</span>
              <strong style={{ color: 'var(--danger)' }}>{formatVND(2850000)}</strong>
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="card">
          <h2 className="card-section-title">🏆 Dịch vụ phổ biến nhất</h2>
          <div className="service-rank-list">
            {[
              { name: 'Điện lạnh', count: 148, pct: 43 },
              { name: 'Điện nước', count: 89, pct: 26 },
              { name: 'Vệ sinh nhà cửa', count: 72, pct: 21 },
              { name: 'Sửa khóa', count: 33, pct: 10 },
            ].map((s) => (
              <div key={s.name} className="service-rank-item">
                <div className="service-rank-info">
                  <span>{s.name}</span>
                  <span className="service-rank-count">{s.count} đơn</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${s.pct}%`, background: 'var(--accent-primary)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
