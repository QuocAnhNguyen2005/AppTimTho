import React from 'react';
import { Sun, Moon, Monitor, Bell, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header glass-panel">
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Tìm kiếm thợ, khách hàng..." className="search-input" />
      </div>

      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Chuyển đổi giao diện">
          {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
        </button>
        
        <button className="icon-btn" title="Thông báo">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="user-profile">
          <img src="https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff" alt="Admin" className="avatar" />
          <div className="user-info">
            <span className="user-name">Quản trị viên</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
