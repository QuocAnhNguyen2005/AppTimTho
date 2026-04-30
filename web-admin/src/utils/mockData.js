// ─── Mock Data for Admin Portal ─────────────────────────────────────────────

export const dashboardMetrics = {
  revenueToday: 12450000,
  activeOrders: 23,
  onlineWorkers: 47,
  newUsers: 18,
};

export const revenueData7Days = {
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  customerPaid: [8200000, 11500000, 9800000, 14200000, 10600000, 16800000, 12450000],
  platformCommission: [1271000, 1782500, 1519000, 2201000, 1643000, 2604000, 1929750],
};

export const revenueData30Days = {
  labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
  customerPaid: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15000000 + 5000000)),
  platformCommission: [],
};
revenueData30Days.platformCommission = revenueData30Days.customerPaid.map(v => Math.round(v * 0.155));

export const alerts = [
  { id: 1, type: 'danger', message: 'Có 3 khiếu nại chưa giải quyết', link: '/users?tab=tickets' },
  { id: 2, type: 'warning', message: 'Có 5 thợ đang chờ duyệt hồ sơ', link: '/workers?tab=pending' },
  { id: 3, type: 'warning', message: '2 yêu cầu rút tiền đang chờ phê duyệt', link: '/bookings?tab=withdrawals' },
  { id: 4, type: 'danger', message: 'Thợ Lê Quang Huy bị đánh giá 1 sao 3 lần liên tiếp', link: '/workers?tab=active' },
];

// Workers
export const pendingWorkers = [
  {
    id: 'W001', name: 'Nguyễn Minh Tuấn', phone: '0901234567',
    service: 'Điện lạnh', registeredAt: '2026-04-28',
    cccdFront: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Trước',
    cccdBack: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Sau',
    portrait: 'https://ui-avatars.com/api/?name=Nguyễn+Minh+Tuấn&background=6366F1&color=fff&size=128',
    conductCert: 'Phường Bến Nghé, Q.1, TP.HCM – Ngày 10/04/2026',
    status: 'pending',
  },
  {
    id: 'W002', name: 'Trần Thị Bích Ngọc', phone: '0912345678',
    service: 'Vệ sinh nhà cửa', registeredAt: '2026-04-27',
    cccdFront: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Trước',
    cccdBack: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Sau',
    portrait: 'https://ui-avatars.com/api/?name=Trần+Thị+Bích+Ngọc&background=10B981&color=fff&size=128',
    conductCert: 'Phường Tân Định, Q.1, TP.HCM – Ngày 08/04/2026',
    status: 'pending',
  },
  {
    id: 'W003', name: 'Phạm Văn Đức', phone: '0933456789',
    service: 'Sửa khóa', registeredAt: '2026-04-26',
    cccdFront: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Trước',
    cccdBack: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Sau',
    portrait: 'https://ui-avatars.com/api/?name=Phạm+Văn+Đức&background=F59E0B&color=fff&size=128',
    conductCert: 'Phường 12, Q.Bình Thạnh, TP.HCM – Ngày 05/04/2026',
    status: 'pending',
  },
  {
    id: 'W004', name: 'Lê Thành Long', phone: '0944567890',
    service: 'Điện nước', registeredAt: '2026-04-25',
    cccdFront: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Trước',
    cccdBack: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Sau',
    portrait: 'https://ui-avatars.com/api/?name=Lê+Thành+Long&background=EF4444&color=fff&size=128',
    conductCert: 'Phường 5, Q.Gò Vấp, TP.HCM – Ngày 01/04/2026',
    status: 'pending',
  },
  {
    id: 'W005', name: 'Hoàng Thị Mai', phone: '0955678901',
    service: 'Vệ sinh nhà cửa', registeredAt: '2026-04-24',
    cccdFront: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Trước',
    cccdBack: 'https://placehold.co/400x260/1E293B/94A3B8?text=CCCD+Mặt+Sau',
    portrait: 'https://ui-avatars.com/api/?name=Hoàng+Thị+Mai&background=8B5CF6&color=fff&size=128',
    conductCert: 'Phường Tân Phú, Q.7, TP.HCM – Ngày 20/03/2026',
    status: 'pending',
  },
];

export const activeWorkers = [
  { id: 'W010', name: 'Bùi Văn Nam', phone: '0901111222', service: 'Điện lạnh', trustScore: 4.8, completedJobs: 156, status: 'online', revenue: 45600000, oneStarCount: 0 },
  { id: 'W011', name: 'Đặng Thị Hoa', phone: '0912222333', service: 'Vệ sinh nhà cửa', trustScore: 4.6, completedJobs: 98, status: 'busy', revenue: 28900000, oneStarCount: 1 },
  { id: 'W012', name: 'Ngô Quốc Khánh', phone: '0923333444', service: 'Điện nước', trustScore: 4.9, completedJobs: 212, status: 'online', revenue: 67800000, oneStarCount: 0 },
  { id: 'W013', name: 'Võ Thị Lan', phone: '0934444555', service: 'Sửa khóa', trustScore: 3.2, completedJobs: 45, status: 'offline', revenue: 12300000, oneStarCount: 2 },
  { id: 'W014', name: 'Lê Quang Huy', phone: '0945555666', service: 'Điện lạnh', trustScore: 2.1, completedJobs: 23, status: 'offline', revenue: 5600000, oneStarCount: 3 },
  { id: 'W015', name: 'Phan Minh Trí', phone: '0956666777', service: 'Điện nước', trustScore: 4.7, completedJobs: 134, status: 'online', revenue: 38900000, oneStarCount: 0 },
  { id: 'W016', name: 'Trịnh Thị Thu', phone: '0967777888', service: 'Vệ sinh nhà cửa', trustScore: 4.5, completedJobs: 87, status: 'busy', revenue: 22100000, oneStarCount: 1 },
  { id: 'W017', name: 'Đinh Văn Bảo', phone: '0978888999', service: 'Sửa khóa', trustScore: 4.3, completedJobs: 62, status: 'online', revenue: 18700000, oneStarCount: 0 },
];

// Users
export const customerList = [
  { id: 'U001', name: 'Nguyễn Thị Hương', phone: '0901112233', totalOrders: 24, totalSpent: 8400000, tier: 'gold', joinedAt: '2025-01-10' },
  { id: 'U002', name: 'Trần Văn Bình', phone: '0912223344', totalOrders: 8, totalSpent: 2100000, tier: 'silver', joinedAt: '2025-06-20' },
  { id: 'U003', name: 'Lê Thị Cẩm', phone: '0923334455', totalOrders: 3, totalSpent: 650000, tier: 'bronze', joinedAt: '2026-01-05' },
  { id: 'U004', name: 'Phạm Quốc Toàn', phone: '0934445566', totalOrders: 41, totalSpent: 15600000, tier: 'gold', joinedAt: '2024-11-15' },
  { id: 'U005', name: 'Hoàng Minh Châu', phone: '0945556677', totalOrders: 12, totalSpent: 3800000, tier: 'silver', joinedAt: '2025-03-22' },
  { id: 'U006', name: 'Vũ Thị Diễm', phone: '0956667788', totalOrders: 1, totalSpent: 150000, tier: 'bronze', joinedAt: '2026-04-01' },
  { id: 'U007', name: 'Đỗ Văn Hậu', phone: '0967778899', totalOrders: 19, totalSpent: 5700000, tier: 'silver', joinedAt: '2025-05-14' },
  { id: 'U008', name: 'Bùi Thị Nga', phone: '0978889900', totalOrders: 55, totalSpent: 22300000, tier: 'gold', joinedAt: '2024-09-08' },
];

export const tickets = [
  {
    id: 'TK001', userId: 'U003', userName: 'Lê Thị Cẩm', workerId: 'W014', workerName: 'Lê Quang Huy',
    service: 'Điện lạnh', amount: 350000, status: 'open', createdAt: '2026-04-28 14:32',
    issue: 'Thợ đến trễ 2 tiếng, làm xong nhưng máy vẫn chạy không lạnh. Yêu cầu hoàn tiền.',
    chat: [
      { from: 'user', message: 'Bạn ơi bạn đến chưa? Tôi chờ lâu lắm rồi.', time: '12:00' },
      { from: 'worker', message: 'Dạ tôi kẹt xe, 30 phút nữa tôi đến ạ.', time: '12:01' },
      { from: 'user', message: 'Trời ơi, 2 tiếng rồi mà!', time: '14:00' },
      { from: 'worker', message: 'Dạ xin lỗi, tôi đang trên đường.', time: '14:05' },
      { from: 'user', message: 'Xong rồi nhưng máy vẫn không lạnh. Làm gì vậy?', time: '15:45' },
      { from: 'worker', message: 'Dạ tôi bơm gas rồi mà, có thể do máy cũ quá.', time: '15:50' },
    ],
  },
  {
    id: 'TK002', userId: 'U006', userName: 'Vũ Thị Diễm', workerId: 'W013', workerName: 'Võ Thị Lan',
    service: 'Sửa khóa', amount: 200000, status: 'open', createdAt: '2026-04-27 09:15',
    issue: 'Thợ tính tiền cao hơn bảng giá niêm yết, không có hóa đơn.',
    chat: [
      { from: 'user', message: 'Sửa khóa hết bao nhiêu vậy?', time: '09:00' },
      { from: 'worker', message: 'Dạ 300k ạ.', time: '09:02' },
      { from: 'user', message: 'Sao app ghi 150-200k mà lấy 300k?', time: '09:20' },
      { from: 'worker', message: 'Khóa này loại đặc biệt nên giá khác.', time: '09:25' },
    ],
  },
  {
    id: 'TK003', userId: 'U001', userName: 'Nguyễn Thị Hương', workerId: 'W011', workerName: 'Đặng Thị Hoa',
    service: 'Vệ sinh nhà cửa', amount: 500000, status: 'resolved', createdAt: '2026-04-25 11:00',
    issue: 'Dọn xong nhưng còn nhiều chỗ bẩn, không đạt yêu cầu.',
    chat: [
      { from: 'user', message: 'Chị ơi góc bếp chưa sạch nè.', time: '14:00' },
      { from: 'worker', message: 'Dạ để em làm lại ạ.', time: '14:05' },
      { from: 'user', message: 'Em làm nhanh quá, chưa kỹ.', time: '15:30' },
    ],
  },
];

export const tierRules = [
  { tier: 'bronze', name: 'Đồng', minSpend: 0, maxSpend: 1999999, color: '#CD7F32' },
  { tier: 'silver', name: 'Bạc', minSpend: 2000000, maxSpend: 7999999, color: '#9CA3AF' },
  { tier: 'gold', name: 'Vàng', minSpend: 8000000, maxSpend: null, color: '#F59E0B' },
];

// Categories & Services
export const categories = [
  {
    id: 'C001', name: 'Điện lạnh', icon: '❄️', baseFee: 50000, commissionRate: 15.5, isActive: true,
    pricingItems: [
      { name: 'Bơm gas điều hòa 1-1.5HP', minPrice: 200000, maxPrice: 350000 },
      { name: 'Bơm gas điều hòa 2HP+', minPrice: 350000, maxPrice: 500000 },
      { name: 'Vệ sinh máy lạnh', minPrice: 150000, maxPrice: 250000 },
      { name: 'Sửa board mạch', minPrice: 300000, maxPrice: 1500000 },
    ],
  },
  {
    id: 'C002', name: 'Điện nước', icon: '🔧', baseFee: 50000, commissionRate: 15.5, isActive: true,
    pricingItems: [
      { name: 'Thay vòi nước', minPrice: 80000, maxPrice: 200000 },
      { name: 'Thông cống nghẹt', minPrice: 200000, maxPrice: 500000 },
      { name: 'Sửa bình nóng lạnh', minPrice: 150000, maxPrice: 400000 },
      { name: 'Lắp đặt đường ống', minPrice: 300000, maxPrice: 1000000 },
    ],
  },
  {
    id: 'C003', name: 'Sửa khóa', icon: '🔑', baseFee: 50000, commissionRate: 15.5, isActive: true,
    pricingItems: [
      { name: 'Mở khóa thông thường', minPrice: 100000, maxPrice: 200000 },
      { name: 'Thay ổ khóa thông thường', minPrice: 150000, maxPrice: 300000 },
      { name: 'Mở khóa vân tay/điện tử', minPrice: 200000, maxPrice: 500000 },
      { name: 'Lắp khóa điện tử mới', minPrice: 500000, maxPrice: 2000000 },
    ],
  },
  {
    id: 'C004', name: 'Vệ sinh nhà cửa', icon: '🏠', baseFee: 50000, commissionRate: 15.5, isActive: true,
    pricingItems: [
      { name: 'Dọn dẹp căn hộ 1PN', minPrice: 200000, maxPrice: 350000 },
      { name: 'Dọn dẹp căn hộ 2PN', minPrice: 300000, maxPrice: 500000 },
      { name: 'Vệ sinh nhà bếp chuyên sâu', minPrice: 350000, maxPrice: 600000 },
      { name: 'Vệ sinh kính cửa', minPrice: 150000, maxPrice: 400000 },
    ],
  },
  {
    id: 'C005', name: 'Sơn nhà', icon: '🎨', baseFee: 50000, commissionRate: 15.5, isActive: false,
    pricingItems: [
      { name: 'Sơn tường (50m²)', minPrice: 1500000, maxPrice: 3000000 },
      { name: 'Sơn tường (100m²)', minPrice: 2500000, maxPrice: 5000000 },
    ],
  },
];

// Bookings & Finance
export const activeBookings = [
  { id: 'B001', customer: 'Nguyễn Thị Hương', worker: 'Ngô Quốc Khánh', service: 'Điện nước', amount: 280000, status: 'in_progress', address: 'Q.1, TP.HCM', startedAt: '22:10', lat: 10.7769, lng: 106.7009 },
  { id: 'B002', customer: 'Trần Văn Bình', worker: 'Bùi Văn Nam', service: 'Điện lạnh', amount: 350000, status: 'in_progress', address: 'Q.3, TP.HCM', startedAt: '21:55', lat: 10.7721, lng: 106.6800 },
  { id: 'B003', customer: 'Phạm Quốc Toàn', worker: 'Đặng Thị Hoa', service: 'Vệ sinh nhà cửa', amount: 500000, status: 'in_progress', address: 'Q.Bình Thạnh', startedAt: '21:30', lat: 10.8031, lng: 106.7100 },
  { id: 'B004', customer: 'Hoàng Minh Châu', worker: 'Phan Minh Trí', service: 'Điện nước', amount: 180000, status: 'waiting', address: 'Q.7, TP.HCM', startedAt: '22:25', lat: 10.7242, lng: 106.7166 },
  { id: 'B005', customer: 'Vũ Thị Diễm', worker: 'Đinh Văn Bảo', service: 'Sửa khóa', amount: 200000, status: 'in_progress', address: 'Q.Tân Bình', startedAt: '22:05', lat: 10.8009, lng: 106.6519 },
  { id: 'B006', customer: 'Đỗ Văn Hậu', worker: 'Trịnh Thị Thu', service: 'Vệ sinh nhà cửa', amount: 400000, status: 'completed', address: 'Q.Gò Vấp', startedAt: '20:00', lat: 10.8380, lng: 106.6728 },
];

export const withdrawalRequests = [
  { id: 'WD001', workerName: 'Bùi Văn Nam', workerId: 'W010', amount: 2000000, bank: 'Vietcombank', accountNo: '0071004256789', status: 'pending', requestedAt: '2026-04-29 18:00', balance: 8500000 },
  { id: 'WD002', workerName: 'Ngô Quốc Khánh', workerId: 'W012', amount: 5000000, bank: 'Techcombank', accountNo: '19038888888', status: 'pending', requestedAt: '2026-04-29 17:30', balance: 12300000 },
  { id: 'WD003', workerName: 'Phan Minh Trí', workerId: 'W015', amount: 1500000, bank: 'MB Bank', accountNo: '0900112233', status: 'pending', requestedAt: '2026-04-29 16:45', balance: 4600000 },
  { id: 'WD004', workerName: 'Đặng Thị Hoa', workerId: 'W011', amount: 800000, bank: 'ACB', accountNo: '987654321', status: 'paid', requestedAt: '2026-04-28 14:00', paidAt: '2026-04-28 16:30', balance: 2100000 },
  { id: 'WD005', workerName: 'Đinh Văn Bảo', workerId: 'W017', amount: 1200000, bank: 'VPBank', accountNo: '1234567890', status: 'paid', requestedAt: '2026-04-27 10:00', paidAt: '2026-04-27 14:15', balance: 3200000 },
];

export const financeExportData = [
  { date: '2026-04-01', orderId: 'B-0001', customer: 'Nguyễn Thị Hương', worker: 'Bùi Văn Nam', service: 'Điện lạnh', amount: 350000, commission: 54250, net: 295750, status: 'completed' },
  { date: '2026-04-01', orderId: 'B-0002', customer: 'Trần Văn Bình', worker: 'Ngô Quốc Khánh', service: 'Điện nước', amount: 280000, commission: 43400, net: 236600, status: 'completed' },
  { date: '2026-04-02', orderId: 'B-0003', customer: 'Phạm Quốc Toàn', worker: 'Đặng Thị Hoa', service: 'Vệ sinh nhà cửa', amount: 500000, commission: 77500, net: 422500, status: 'completed' },
];

// ─── Dashboard Interactive Mock Data ─────────────────────────────────────────

// 1. Revenue Today – payment method breakdown + today's transactions
export const todayTransactions = [
  { id: 'B-0201', worker: 'Bùi Văn Nam', customer: 'Nguyễn Thị Hương', service: 'Điện lạnh', amount: 350000, commission: 54250, payMethod: 'Chuyển khoản App', time: '08:30' },
  { id: 'B-0202', worker: 'Ngô Quốc Khánh', customer: 'Trần Văn Bình', service: 'Điện nước', amount: 280000, commission: 43400, payMethod: 'ZaloPay', time: '09:15' },
  { id: 'B-0203', worker: 'Đặng Thị Hoa', customer: 'Phạm Quốc Toàn', service: 'Vệ sinh nhà cửa', amount: 500000, commission: 77500, payMethod: 'Tiền mặt', time: '10:00' },
  { id: 'B-0204', worker: 'Phan Minh Trí', customer: 'Hoàng Minh Châu', service: 'Điện nước', amount: 180000, commission: 27900, payMethod: 'MoMo', time: '10:45' },
  { id: 'B-0205', worker: 'Đinh Văn Bảo', customer: 'Vũ Thị Diễm', service: 'Sửa khóa', amount: 200000, commission: 31000, payMethod: 'Tiền mặt', time: '11:20' },
  { id: 'B-0206', worker: 'Trịnh Thị Thu', customer: 'Đỗ Văn Hậu', service: 'Vệ sinh nhà cửa', amount: 400000, commission: 62000, payMethod: 'Chuyển khoản App', time: '13:05' },
  { id: 'B-0207', worker: 'Bùi Văn Nam', customer: 'Bùi Thị Nga', service: 'Điện lạnh', amount: 500000, commission: 77500, payMethod: 'ZaloPay', time: '14:30' },
  { id: 'B-0208', worker: 'Ngô Quốc Khánh', customer: 'Nguyễn Thị Hương', service: 'Điện nước', amount: 320000, commission: 49600, payMethod: 'MoMo', time: '15:10' },
  { id: 'B-0209', worker: 'Phan Minh Trí', customer: 'Trần Văn Bình', service: 'Điện nước', amount: 250000, commission: 38750, payMethod: 'Tiền mặt', time: '16:00' },
  { id: 'B-0210', worker: 'Đặng Thị Hoa', customer: 'Phạm Quốc Toàn', service: 'Vệ sinh nhà cửa', amount: 600000, commission: 93000, payMethod: 'Chuyển khoản App', time: '17:30' },
];
export const paymentMethodBreakdown = [
  { method: 'Chuyển khoản App', pct: 35, color: '#6366F1' },
  { method: 'ZaloPay', pct: 28, color: '#10B981' },
  { method: 'Tiền mặt', pct: 22, color: '#F59E0B' },
  { method: 'MoMo', pct: 15, color: '#EC4899' },
];

// 2. Active Orders – live tracking with status stages + anomaly flag
export const liveOrders = [
  { id: 'BO-001', customer: 'Nguyễn Thị Hương', worker: 'Ngô Quốc Khánh', service: 'Điện nước', address: 'Q.1, TP.HCM', stage: 'Đang sửa chữa', startedAt: '08:00', acceptedAt: '08:05', arrivedAt: '08:20', amount: 280000, lat: 10.7769, lng: 106.7009, anomaly: false },
  { id: 'BO-002', customer: 'Trần Văn Bình', worker: 'Bùi Văn Nam', service: 'Điện lạnh', address: 'Q.3, TP.HCM', stage: 'Đang kiểm tra lỗi', startedAt: '08:30', acceptedAt: '08:32', arrivedAt: '08:55', amount: 350000, lat: 10.7721, lng: 106.6800, anomaly: false },
  { id: 'BO-003', customer: 'Phạm Quốc Toàn', worker: 'Đặng Thị Hoa', service: 'Vệ sinh nhà cửa', address: 'Q.Bình Thạnh', stage: 'Đang di chuyển', startedAt: '09:00', acceptedAt: '09:02', arrivedAt: null, amount: 500000, lat: 10.8031, lng: 106.7100, anomaly: true, anomalyMsg: 'Nhận đơn 52 phút chưa bấm "Đã đến nơi"' },
  { id: 'BO-004', customer: 'Hoàng Minh Châu', worker: 'Phan Minh Trí', service: 'Điện nước', address: 'Q.7, TP.HCM', stage: 'Đang sửa chữa', startedAt: '09:30', acceptedAt: '09:31', arrivedAt: '09:50', amount: 180000, lat: 10.7242, lng: 106.7166, anomaly: false },
  { id: 'BO-005', customer: 'Vũ Thị Diễm', worker: 'Đinh Văn Bảo', service: 'Sửa khóa', address: 'Q.Tân Bình', stage: 'Đang di chuyển', startedAt: '10:00', acceptedAt: '10:03', arrivedAt: null, amount: 200000, lat: 10.8009, lng: 106.6519, anomaly: true, anomalyMsg: 'Nhận đơn 48 phút chưa bấm "Đã đến nơi"' },
  { id: 'BO-006', customer: 'Đỗ Văn Hậu', worker: 'Trịnh Thị Thu', service: 'Vệ sinh nhà cửa', address: 'Q.Gò Vấp', stage: 'Đang kiểm tra lỗi', startedAt: '10:15', acceptedAt: '10:17', arrivedAt: '10:40', amount: 400000, lat: 10.8380, lng: 106.6728, anomaly: false },
];

// 3. Online Workers – with skill, district, wallet balance
export const onlineWorkersList = [
  { id: 'W010', name: 'Bùi Văn Nam', skill: 'Điện lạnh', district: 'Q.3', walletBalance: 8500000, status: 'online', rating: 4.8 },
  { id: 'W011', name: 'Đặng Thị Hoa', skill: 'Vệ sinh nhà cửa', district: 'Q.Bình Thạnh', walletBalance: 2100000, status: 'busy', rating: 4.6 },
  { id: 'W012', name: 'Ngô Quốc Khánh', skill: 'Điện nước', district: 'Q.1', walletBalance: 12300000, status: 'online', rating: 4.9 },
  { id: 'W015', name: 'Phan Minh Trí', skill: 'Điện nước', district: 'Q.7', walletBalance: 4600000, status: 'online', rating: 4.7 },
  { id: 'W016', name: 'Trịnh Thị Thu', skill: 'Vệ sinh nhà cửa', district: 'Q.Gò Vấp', walletBalance: 800000, status: 'busy', rating: 4.5 },
  { id: 'W017', name: 'Đinh Văn Bảo', skill: 'Sửa khóa', district: 'Q.Tân Bình', walletBalance: 3200000, status: 'online', rating: 4.3 },
  { id: 'W018', name: 'Lý Thị Mỹ Duyên', skill: 'Điện lạnh', district: 'Q.10', walletBalance: 150000, status: 'online', rating: 4.1 },
  { id: 'W019', name: 'Võ Minh Khoa', skill: 'Điện lạnh', district: 'Q.Tân Phú', walletBalance: 6700000, status: 'online', rating: 4.7 },
  { id: 'W020', name: 'Huỳnh Thị Lan', skill: 'Vệ sinh nhà cửa', district: 'Q.12', walletBalance: 1900000, status: 'busy', rating: 4.4 },
  { id: 'W021', name: 'Trần Văn Hùng', skill: 'Điện nước', district: 'Q.Thủ Đức', walletBalance: 5400000, status: 'online', rating: 4.6 },
];
export const skillDemand = [
  { skill: 'Điện lạnh', online: 3, needed: 8, color: '#6366F1' },
  { skill: 'Điện nước', online: 3, needed: 5, color: '#10B981' },
  { skill: 'Vệ sinh nhà cửa', online: 3, needed: 4, color: '#F59E0B' },
  { skill: 'Sửa khóa', online: 1, needed: 2, color: '#EC4899' },
];

// 4. New Users – source attribution + fraud signals
export const newUsersToday = [
  { id: 'NU001', name: 'Phan Thị Ngân', phone: '0901000001', source: 'Facebook Ads', ip: '113.22.45.101', device: 'iPhone 14', joinedAt: '07:15', suspicious: false },
  { id: 'NU002', name: 'Lê Minh Quân', phone: '0902000002', source: 'Google Search', ip: '113.22.45.102', device: 'Samsung S23', joinedAt: '07:42', suspicious: false },
  { id: 'NU003', name: 'Nguyễn Văn Tài', phone: '0903000003', source: 'Referral (REF2025)', ip: '171.225.10.55', device: 'Xiaomi 12', joinedAt: '08:10', suspicious: false },
  { id: 'NU004', name: 'Tài khoản ảo 1', phone: '0904000004', source: 'Referral (REF2025)', ip: '171.225.10.55', device: 'Xiaomi 12', joinedAt: '08:11', suspicious: true, fraudNote: 'Cùng IP + thiết bị với NU003' },
  { id: 'NU005', name: 'Tài khoản ảo 2', phone: '0905000005', source: 'Referral (REF2025)', ip: '171.225.10.55', device: 'Xiaomi 12', joinedAt: '08:12', suspicious: true, fraudNote: 'Cùng IP + thiết bị với NU003' },
  { id: 'NU006', name: 'Tài khoản ảo 3', phone: '0906000006', source: 'Referral (REF2025)', ip: '171.225.10.55', device: 'Xiaomi 12', joinedAt: '08:13', suspicious: true, fraudNote: 'Cùng IP + thiết bị với NU003' },
  { id: 'NU007', name: 'Trần Thị Kim', phone: '0907000007', source: 'Facebook Ads', ip: '42.116.88.200', device: 'iPhone 13', joinedAt: '09:30', suspicious: false },
  { id: 'NU008', name: 'Đỗ Quang Vinh', phone: '0908000008', source: 'Google Search', ip: '14.225.12.99', device: 'Oppo A96', joinedAt: '10:05', suspicious: false },
];
export const userSourceBreakdown = [
  { source: 'Facebook Ads', count: 7, pct: 39, color: '#6366F1' },
  { source: 'Google Search', count: 5, pct: 28, color: '#10B981' },
  { source: 'Referral', count: 4, pct: 22, color: '#F59E0B' },
  { source: 'Khác', count: 2, pct: 11, color: '#94A3B8' },
];

// 5. Chart data point insights
export const chartDayInsights = {
  T2: { note: 'Đầu tuần bình thường, không có sự kiện đặc biệt.', topWorkers: [] },
  T3: { note: 'Tăng nhẹ do chiến dịch SMS nhắc lịch bảo dưỡng định kỳ.', topWorkers: ['Ngô Quốc Khánh', 'Bùi Văn Nam'] },
  T4: { note: 'Giảm nhẹ so với T3, thời tiết mát mẻ ảnh hưởng nhu cầu điện lạnh.', topWorkers: [] },
  T5: { note: 'Đỉnh giữa tuần – nhiều văn phòng đặt dịch vụ vệ sinh định kỳ.', topWorkers: ['Đặng Thị Hoa', 'Trịnh Thị Thu', 'Ngô Quốc Khánh'] },
  T6: { note: 'Giảm do một số thợ nghỉ sớm cuối tuần.', topWorkers: [] },
  T7: { note: '🎉 Doanh thu T7 đạt đỉnh nhờ sự kiện "Khuyến mãi cuối tuần – Giảm 20% phí gọi thợ". Lượng đơn tăng 68% so với T7 tuần trước.', topWorkers: ['Bùi Văn Nam', 'Ngô Quốc Khánh', 'Phan Minh Trí'] },
  CN: { note: 'Cuối tuần – chủ yếu dịch vụ vệ sinh nhà và sửa chữa gia đình.', topWorkers: ['Đặng Thị Hoa', 'Đinh Văn Bảo'] },
};

// 6. Cancelled orders detail
export const cancelledOrders = [
  { id: 'C-0101', customer: 'Trần Văn Bình', worker: 'Lê Quang Huy', service: 'Điện lạnh', amount: 350000, cancelledAt: '2026-04-28 10:30', reason: 'Thợ bận', cancelledBy: 'Thợ' },
  { id: 'C-0102', customer: 'Vũ Thị Diễm', worker: 'Võ Thị Lan', service: 'Sửa khóa', amount: 200000, cancelledAt: '2026-04-28 11:15', reason: 'Khách đổi ý', cancelledBy: 'Khách' },
  { id: 'C-0103', customer: 'Đỗ Văn Hậu', worker: 'Trịnh Thị Thu', service: 'Vệ sinh nhà cửa', amount: 400000, cancelledAt: '2026-04-27 09:00', reason: 'Gọi không nghe máy', cancelledBy: 'Hệ thống' },
  { id: 'C-0104', customer: 'Hoàng Minh Châu', worker: 'Bùi Văn Nam', service: 'Điện lạnh', amount: 300000, cancelledAt: '2026-04-27 14:20', reason: 'Thợ bận', cancelledBy: 'Thợ' },
  { id: 'C-0105', customer: 'Bùi Thị Nga', worker: 'Phan Minh Trí', service: 'Điện nước', amount: 180000, cancelledAt: '2026-04-26 16:00', reason: 'Khách đổi ý', cancelledBy: 'Khách' },
  { id: 'C-0106', customer: 'Phạm Quốc Toàn', worker: 'Đặng Thị Hoa', service: 'Vệ sinh nhà cửa', amount: 500000, cancelledAt: '2026-04-26 17:30', reason: 'Gọi không nghe máy', cancelledBy: 'Hệ thống' },
];

// 7. Service breakdown detail (sub-categories)
export const serviceSubBreakdown = {
  'Điện lạnh': [
    { name: 'Bơm gas điều hòa', count: 89, pct: 60, color: '#6366F1' },
    { name: 'Vệ sinh máy lạnh', count: 37, pct: 25, color: '#8B5CF6' },
    { name: 'Sửa board mạch', count: 14, pct: 9, color: '#A78BFA' },
    { name: 'Khác', count: 8, pct: 6, color: '#C4B5FD' },
  ],
  'Điện nước': [
    { name: 'Thông cống nghẹt', count: 38, pct: 43, color: '#10B981' },
    { name: 'Thay vòi nước', count: 27, pct: 30, color: '#34D399' },
    { name: 'Sửa bình nóng lạnh', count: 15, pct: 17, color: '#6EE7B7' },
    { name: 'Lắp đặt đường ống', count: 9, pct: 10, color: '#A7F3D0' },
  ],
  'Vệ sinh nhà cửa': [
    { name: 'Dọn dẹp căn hộ 1PN', count: 32, pct: 44, color: '#F59E0B' },
    { name: 'Vệ sinh nhà bếp', count: 24, pct: 33, color: '#FBBF24' },
    { name: 'Dọn dẹp căn hộ 2PN', count: 12, pct: 17, color: '#FCD34D' },
    { name: 'Vệ sinh kính cửa', count: 4, pct: 6, color: '#FDE68A' },
  ],
  'Sửa khóa': [
    { name: 'Mở khóa thông thường', count: 18, pct: 55, color: '#EC4899' },
    { name: 'Thay ổ khóa', count: 9, pct: 27, color: '#F472B6' },
    { name: 'Mở khóa điện tử', count: 6, pct: 18, color: '#FBCFE8' },
  ],
};

// ─── Customer Detail (Admin Privilege View) ───────────────────────────────────
export const customerDetailData = {
  U001: {
    // Tab 1: Payment transactions
    paymentLogs: [
      { traceId: 'ZALOPAY-20260428-001', gateway: 'ZaloPay', amount: 350000, status: 'success', orderId: 'B-0201', createdAt: '2026-04-28 08:30', settledAt: '2026-04-28 08:31', note: '' },
      { traceId: 'VNPAY-20260415-022', gateway: 'VNPay', amount: 280000, status: 'refunded', orderId: 'B-0188', createdAt: '2026-04-15 14:10', settledAt: '2026-04-15 16:40', note: 'Khách yêu cầu hủy, đã hoàn' },
      { traceId: 'MOMO-20260401-007', gateway: 'MoMo', amount: 500000, status: 'pending', orderId: 'B-0155', createdAt: '2026-04-01 10:05', settledAt: null, note: 'Timeout – chờ xác nhận từ cổng' },
      { traceId: 'ZALOPAY-20260320-088', gateway: 'ZaloPay', amount: 420000, status: 'success', orderId: 'B-0102', createdAt: '2026-03-20 09:15', settledAt: '2026-03-20 09:16', note: '' },
    ],
    // Tab 2: Deep order log
    orderLogs: [
      {
        orderId: 'B-0201', service: 'Điện lạnh', worker: 'Bùi Văn Nam', amount: 350000,
        timeline: [
          { event: 'Khách đặt đơn', time: '2026-04-28 08:00', gps: null },
          { event: 'Thợ nhận đơn', time: '2026-04-28 08:05', gps: 'Q.Bình Thạnh (cách 3.2km)' },
          { event: 'Thợ bắt đầu di chuyển', time: '2026-04-28 08:10', gps: 'Q.Bình Thạnh' },
          { event: 'Thợ đến nơi', time: '2026-04-28 08:28', gps: 'Q.1 – Khớp địa chỉ ✓' },
          { event: 'Bắt đầu sửa chữa', time: '2026-04-28 08:35', gps: null },
          { event: 'Hoàn thành', time: '2026-04-28 09:45', gps: null },
        ],
        quotedPrice: 320000, finalPrice: 350000, priceDiff: '+30.000đ (vật tư)',
        chat: [
          { from: 'customer', msg: 'Máy lạnh nhà em hơi yếu gió ạ, báo giá xem nào', time: '07:55' },
          { from: 'worker', msg: 'Dạ em xem qua thì cần bơm gas + vệ sinh, báo giá 320k ạ', time: '07:58' },
          { from: 'customer', msg: 'Oke anh, chị chốt nha', time: '08:00' },
          { from: 'worker', msg: 'Xong rồi chị ơi, có thêm 30k tiền ga đặc biệt chị thông cảm nha', time: '09:40' },
          { from: 'customer', msg: 'Ừ thôi được', time: '09:42' },
        ],
      },
      {
        orderId: 'B-0188', service: 'Điện nước', worker: 'Ngô Quốc Khánh', amount: 280000,
        timeline: [
          { event: 'Khách đặt đơn', time: '2026-04-15 13:50', gps: null },
          { event: 'Thợ nhận đơn', time: '2026-04-15 13:52', gps: 'Q.3 (cách 1.8km)' },
          { event: 'Thợ bắt đầu di chuyển', time: '2026-04-15 14:00', gps: 'Q.3' },
          { event: 'Khách hủy đơn', time: '2026-04-15 14:10', gps: null },
        ],
        quotedPrice: 280000, finalPrice: 0, priceDiff: 'Đã hủy – hoàn tiền',
        chat: [
          { from: 'customer', msg: 'Anh ơi hôm nay chị bận rồi không cần nữa', time: '14:08' },
          { from: 'worker', msg: 'Dạ em đang trên đường rồi chị...', time: '14:09' },
          { from: 'customer', msg: 'Xin lỗi nha anh', time: '14:10' },
        ],
      },
    ],
    // Tab 3: Voucher history
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2025-01-10', orderId: 'B-0001', ip: '113.22.45.101', device: 'iPhone 13', status: 'valid' },
      { code: 'WEEKEND20', discount: 84000, usedAt: '2025-03-15', orderId: 'B-0045', ip: '113.22.45.101', device: 'iPhone 13', status: 'valid' },
      { code: 'SUMMER30', discount: 105000, usedAt: '2025-06-20', orderId: 'B-0089', ip: '113.22.45.101', device: 'iPhone 13', status: 'valid' },
    ],
    deviceHistory: [{ ip: '113.22.45.101', device: 'iPhone 13', accounts: 1, flagged: false }],
    accountStatus: 'active',
    // Tab 4: Behavior metrics
    behavior: {
      cancelRate: 8,   // %
      cancelCount: 2,
      totalBooked: 24,
      avgResponseTime: '4 phút',
      trustScore: 92,
      workerNotes: [
        { worker: 'Bùi Văn Nam', note: 'Khách dễ tính, thanh toán nhanh, không đòi hỏi gì thêm.', date: '2026-04-28' },
        { worker: 'Ngô Quốc Khánh', note: 'Khách thân thiện, cho boa 20k.', date: '2026-03-20' },
      ],
      complaints: 0,
      refundCount: 1,
    },
  },

  U002: {
    paymentLogs: [
      { traceId: 'MOMO-20260410-033', gateway: 'MoMo', amount: 200000, status: 'success', orderId: 'B-0170', createdAt: '2026-04-10 10:00', settledAt: '2026-04-10 10:01', note: '' },
      { traceId: 'ZALOPAY-20260301-009', gateway: 'ZaloPay', amount: 350000, status: 'timeout', orderId: 'B-0112', createdAt: '2026-03-01 09:30', settledAt: null, note: 'Lỗi mạng – giao dịch treo 24h' },
    ],
    orderLogs: [
      {
        orderId: 'B-0170', service: 'Sửa khóa', worker: 'Võ Thị Lan', amount: 200000,
        timeline: [
          { event: 'Khách đặt đơn', time: '2026-04-10 09:50', gps: null },
          { event: 'Thợ nhận đơn', time: '2026-04-10 09:53', gps: 'Q.Tân Bình (cách 2km)' },
          { event: 'Thợ đến nơi', time: '2026-04-10 10:18', gps: 'Q.Tân Bình – Khớp ✓' },
          { event: 'Hoàn thành', time: '2026-04-10 10:50', gps: null },
        ],
        quotedPrice: 150000, finalPrice: 200000, priceDiff: '+50.000đ (thợ tự thêm)',
        chat: [
          { from: 'customer', msg: 'Sửa khóa cửa thường mất bao nhiêu vậy?', time: '09:48' },
          { from: 'worker', msg: 'Dạ 150k anh ạ', time: '09:49' },
          { from: 'customer', msg: 'Ok chốt', time: '09:50' },
          { from: 'worker', msg: 'Xong rồi anh, khóa này loại khó nên 200k anh nhé', time: '10:48' },
          { from: 'customer', msg: 'Sao lại tăng vậy? Báo giá 150k mà', time: '10:49' },
          { from: 'worker', msg: 'Anh thông cảm, vật tư đặc biệt ạ', time: '10:50' },
        ],
      },
    ],
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2025-06-20', orderId: 'B-0050', ip: '171.225.10.55', device: 'Samsung S22', status: 'valid' },
    ],
    deviceHistory: [{ ip: '171.225.10.55', device: 'Samsung S22', accounts: 3, flagged: true, note: '3 TK cùng IP' }],
    accountStatus: 'active',
    behavior: {
      cancelRate: 37, cancelCount: 3, totalBooked: 8,
      avgResponseTime: '12 phút', trustScore: 55,
      workerNotes: [
        { worker: 'Võ Thị Lan', note: 'Khách hay cò kè, đòi giảm giá thêm sau khi thợ đã đến nơi.', date: '2026-04-10' },
      ],
      complaints: 1, refundCount: 0,
    },
  },

  U003: {
    paymentLogs: [
      { traceId: 'VNPAY-20260428-105', gateway: 'VNPay', amount: 350000, status: 'pending', orderId: 'B-0200', createdAt: '2026-04-28 14:30', settledAt: null, note: 'App báo lỗi, tiền đã trừ nhưng đơn chưa tạo' },
    ],
    orderLogs: [],
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2026-01-05', orderId: 'B-0010', ip: '14.225.12.99', device: 'Oppo A96', status: 'valid' },
      { code: 'FRIEND20', discount: 50000, usedAt: '2026-02-10', orderId: 'B-0025', ip: '14.225.12.99', device: 'Oppo A96', status: 'suspicious', note: 'Mã của tài khoản ảo U004' },
    ],
    deviceHistory: [{ ip: '14.225.12.99', device: 'Oppo A96', accounts: 1, flagged: false }],
    accountStatus: 'active',
    behavior: {
      cancelRate: 33, cancelCount: 1, totalBooked: 3,
      avgResponseTime: '8 phút', trustScore: 60,
      workerNotes: [],
      complaints: 1, refundCount: 1,
    },
  },

  U004: {
    paymentLogs: [
      { traceId: 'ZALOPAY-20260425-200', gateway: 'ZaloPay', amount: 500000, status: 'success', orderId: 'B-0195', createdAt: '2026-04-25 09:00', settledAt: '2026-04-25 09:01', note: '' },
      { traceId: 'MOMO-20260410-111', gateway: 'MoMo', amount: 400000, status: 'success', orderId: 'B-0178', createdAt: '2026-04-10 11:30', settledAt: '2026-04-10 11:31', note: '' },
      { traceId: 'VNPAY-20260320-044', gateway: 'VNPay', amount: 600000, status: 'refunded', orderId: 'B-0145', createdAt: '2026-03-20 16:00', settledAt: '2026-03-21 10:00', note: 'Hoàn do thợ hủy' },
    ],
    orderLogs: [
      {
        orderId: 'B-0195', service: 'Vệ sinh nhà cửa', worker: 'Đặng Thị Hoa', amount: 500000,
        timeline: [
          { event: 'Khách đặt đơn', time: '2026-04-25 08:45', gps: null },
          { event: 'Thợ nhận đơn', time: '2026-04-25 08:47', gps: 'Q.Gò Vấp (cách 5km)' },
          { event: 'Thợ đến nơi', time: '2026-04-25 09:30', gps: 'Q.Bình Thạnh – Khớp ✓' },
          { event: 'Hoàn thành', time: '2026-04-25 12:00', gps: null },
        ],
        quotedPrice: 500000, finalPrice: 500000, priceDiff: 'Đúng báo giá',
        chat: [
          { from: 'customer', msg: 'Căn hộ 2PN, cần dọn dẹp toàn bộ ạ', time: '08:43' },
          { from: 'worker', msg: 'Dạ 500k anh ạ, em làm kỹ cho anh', time: '08:45' },
          { from: 'customer', msg: 'Ok nha', time: '08:46' },
        ],
      },
    ],
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2024-11-15', orderId: 'B-0001', ip: '42.116.88.200', device: 'iPhone 14 Pro', status: 'valid' },
      { code: 'LOYAL100', discount: 100000, usedAt: '2025-06-01', orderId: 'B-0120', ip: '42.116.88.200', device: 'iPhone 14 Pro', status: 'valid' },
      { code: 'SUMMER30', discount: 150000, usedAt: '2025-07-15', orderId: 'B-0155', ip: '42.116.88.200', device: 'iPhone 14 Pro', status: 'valid' },
    ],
    deviceHistory: [{ ip: '42.116.88.200', device: 'iPhone 14 Pro', accounts: 1, flagged: false }],
    accountStatus: 'active',
    behavior: {
      cancelRate: 5, cancelCount: 2, totalBooked: 41,
      avgResponseTime: '3 phút', trustScore: 95,
      workerNotes: [
        { worker: 'Đặng Thị Hoa', note: 'Khách rất tử tế, nhà sạch sẽ, cho thợ nước và đồ ăn vặt.', date: '2026-04-25' },
        { worker: 'Ngô Quốc Khánh', note: 'Khách VIP, thanh toán đúng giá, review 5 sao luôn.', date: '2026-03-10' },
      ],
      complaints: 0, refundCount: 1,
    },
  },

  U005: {
    paymentLogs: [
      { traceId: 'MOMO-20260422-077', gateway: 'MoMo', amount: 180000, status: 'success', orderId: 'B-0192', createdAt: '2026-04-22 15:00', settledAt: '2026-04-22 15:01', note: '' },
    ],
    orderLogs: [],
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2025-03-22', orderId: 'B-0030', ip: '27.64.100.88', device: 'Xiaomi 13', status: 'valid' },
    ],
    deviceHistory: [{ ip: '27.64.100.88', device: 'Xiaomi 13', accounts: 1, flagged: false }],
    accountStatus: 'active',
    behavior: {
      cancelRate: 25, cancelCount: 3, totalBooked: 12,
      avgResponseTime: '9 phút', trustScore: 68,
      workerNotes: [
        { worker: 'Phan Minh Trí', note: 'Khách hủy đơn lúc thợ đang đi đường, không báo trước.', date: '2026-04-01' },
      ],
      complaints: 0, refundCount: 0,
    },
  },

  U006: {
    paymentLogs: [
      { traceId: 'VNPAY-20260428-301', gateway: 'VNPay', amount: 350000, status: 'timeout', orderId: 'B-0199', createdAt: '2026-04-28 14:30', settledAt: null, note: 'App bị văng, tiền đã bị trừ nhưng đơn chưa tạo' },
    ],
    orderLogs: [],
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2026-04-01', orderId: 'B-0005', ip: '171.225.10.55', device: 'Xiaomi 12', status: 'suspicious', note: 'IP trùng 5 tài khoản khác' },
    ],
    deviceHistory: [{ ip: '171.225.10.55', device: 'Xiaomi 12', accounts: 5, flagged: true, note: '5 TK dùng cùng IP + thiết bị – nghi gian lận mã giảm giá' }],
    accountStatus: 'suspended',
    behavior: {
      cancelRate: 0, cancelCount: 0, totalBooked: 1,
      avgResponseTime: '—', trustScore: 20,
      workerNotes: [],
      complaints: 0, refundCount: 0,
    },
  },

  U007: {
    paymentLogs: [
      { traceId: 'ZALOPAY-20260420-088', gateway: 'ZaloPay', amount: 400000, status: 'success', orderId: 'B-0185', createdAt: '2026-04-20 10:00', settledAt: '2026-04-20 10:01', note: '' },
      { traceId: 'MOMO-20260310-055', gateway: 'MoMo', amount: 280000, status: 'refunded', orderId: 'B-0150', createdAt: '2026-03-10 08:00', settledAt: '2026-03-10 17:00', note: 'Hoàn tiền theo yêu cầu khiếu nại' },
    ],
    orderLogs: [],
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2025-05-14', orderId: 'B-0040', ip: '103.15.52.180', device: 'Samsung A54', status: 'valid' },
      { code: 'LOYAL100', discount: 100000, usedAt: '2025-12-01', orderId: 'B-0120', ip: '103.15.52.180', device: 'Samsung A54', status: 'valid' },
    ],
    deviceHistory: [{ ip: '103.15.52.180', device: 'Samsung A54', accounts: 1, flagged: false }],
    accountStatus: 'active',
    behavior: {
      cancelRate: 21, cancelCount: 4, totalBooked: 19,
      avgResponseTime: '6 phút', trustScore: 72,
      workerNotes: [
        { worker: 'Trịnh Thị Thu', note: 'Khách hay đổi yêu cầu giữa chừng, mất thêm thời gian nhưng trả tiền đúng.', date: '2026-04-20' },
      ],
      complaints: 1, refundCount: 1,
    },
  },

  U008: {
    paymentLogs: [
      { traceId: 'ZALOPAY-20260429-500', gateway: 'ZaloPay', amount: 600000, status: 'success', orderId: 'B-0210', createdAt: '2026-04-29 09:00', settledAt: '2026-04-29 09:01', note: '' },
      { traceId: 'VNPAY-20260415-200', gateway: 'VNPay', amount: 500000, status: 'success', orderId: 'B-0195', createdAt: '2026-04-15 14:00', settledAt: '2026-04-15 14:01', note: '' },
      { traceId: 'MOMO-20260401-300', gateway: 'MoMo', amount: 350000, status: 'success', orderId: 'B-0180', createdAt: '2026-04-01 11:00', settledAt: '2026-04-01 11:01', note: '' },
    ],
    orderLogs: [],
    voucherLogs: [
      { code: 'NEWUSER50', discount: 50000, usedAt: '2024-09-08', orderId: 'B-0001', ip: '14.161.22.55', device: 'iPhone 15 Pro Max', status: 'valid' },
      { code: 'LOYAL100', discount: 100000, usedAt: '2025-01-10', orderId: 'B-0055', ip: '14.161.22.55', device: 'iPhone 15 Pro Max', status: 'valid' },
      { code: 'GOLD200', discount: 200000, usedAt: '2025-09-20', orderId: 'B-0180', ip: '14.161.22.55', device: 'iPhone 15 Pro Max', status: 'valid' },
    ],
    deviceHistory: [{ ip: '14.161.22.55', device: 'iPhone 15 Pro Max', accounts: 1, flagged: false }],
    accountStatus: 'active',
    behavior: {
      cancelRate: 2, cancelCount: 1, totalBooked: 55,
      avgResponseTime: '2 phút', trustScore: 98,
      workerNotes: [
        { worker: 'Bùi Văn Nam', note: 'Khách VIP số 1 của hệ thống, luôn review 5 sao, boa hậu hĩnh.', date: '2026-04-29' },
        { worker: 'Đặng Thị Hoa', note: 'Chị Nga là khách quen, đặt thợ mỗi tháng, rất thoải mái.', date: '2026-04-10' },
        { worker: 'Ngô Quốc Khánh', note: 'Khách tốt bụng, cho nước và bánh khi làm việc.', date: '2026-03-15' },
      ],
      complaints: 0, refundCount: 0,
    },
  },
};

