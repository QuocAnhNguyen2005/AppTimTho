// Format currency to Vietnamese đồng
export const formatVND = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Format large numbers with K, M abbreviations
export const formatShort = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num?.toString() ?? '0';
};

// Format date string
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Get tier badge config
export const getTierConfig = (tier) => {
  const configs = {
    bronze: { label: 'Đồng', color: '#CD7F32', bg: 'rgba(205,127,50,0.15)' },
    silver: { label: 'Bạc', color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' },
    gold:   { label: 'Vàng', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  };
  return configs[tier] || configs.bronze;
};

// Get status badge config for bookings
export const getBookingStatusConfig = (status) => {
  const configs = {
    in_progress: { label: 'Đang thực hiện', color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
    waiting:     { label: 'Chờ thợ', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    completed:   { label: 'Hoàn thành', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    cancelled:   { label: 'Đã hủy', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  };
  return configs[status] || configs.waiting;
};

// Get worker online status config
export const getWorkerStatusConfig = (status) => {
  const configs = {
    online:  { label: 'Online', color: '#10B981' },
    busy:    { label: 'Bận', color: '#F59E0B' },
    offline: { label: 'Offline', color: '#6B7280' },
  };
  return configs[status] || configs.offline;
};
