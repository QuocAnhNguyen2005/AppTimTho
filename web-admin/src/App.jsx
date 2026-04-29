import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers/Workers';
import Users from './pages/Users/Users';
import Services from './pages/Services/Services';
import Finance from './pages/Finance/Finance';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="workers" element={<Workers />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Services />} />
            <Route path="bookings" element={<Finance />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
