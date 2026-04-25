import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wrench, List, CreditCard } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/', name: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { path: '/workers', name: 'Quản lý Thợ', icon: <Wrench size={20} /> },
    { path: '/users', name: 'Khách hàng', icon: <Users size={20} /> },
    { path: '/categories', name: 'Dịch vụ', icon: <List size={20} /> },
    { path: '/bookings', name: 'Đơn hàng & Thu nhập', icon: <CreditCard size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <div className="logo-icon">T</div>
        <h2>TimTho Admin</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <p>Phiên bản 1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
