import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminLayout from './layouts/AdminLayout';

// Placeholder Pages
const Dashboard = () => (
  <div className="card">
    <h2>Trang Tổng Quan (Dashboard)</h2>
    <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
      Thống kê doanh thu, số lượng người dùng và thợ sẽ được hiển thị ở đây.
    </p>
  </div>
);

const Workers = () => (
  <div className="card">
    <h2>Quản lý Thợ Sửa Chữa</h2>
    <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
      Danh sách thợ chờ duyệt sẽ xuất hiện ở đây.
    </p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="workers" element={<Workers />} />
            <Route path="users" element={<div className="card"><h2>Quản lý Người Dùng</h2></div>} />
            <Route path="categories" element={<div className="card"><h2>Quản lý Dịch Vụ</h2></div>} />
            <Route path="bookings" element={<div className="card"><h2>Quản lý Đơn Hàng</h2></div>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
