import React, { createContext, useContext, useState } from 'react';

// Thêm 'admin' vào type Role để tài khoản admin có thể đăng nhập
type Role = 'customer' | 'worker' | 'admin' | null;

interface UserInfo {
  id: number;
  full_name: string;
  phone_number: string;
  avatar_url?: string;
  is_verified?: boolean;
}

interface AuthContextData {
  isAuthenticated: boolean;
  role: Role;
  user: UserInfo | null;
  login: (selectedRole: Role, userInfo?: UserInfo) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  // isLoading = false ngay từ đầu (không cần restore session)
  const [isLoading] = useState(false);

  const login = (selectedRole: Role, userInfo?: UserInfo) => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    if (userInfo) setUser(userInfo);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
