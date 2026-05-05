import React, { createContext, useContext, useState } from 'react';

type Role = 'customer' | 'worker' | null;

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
  const [isLoading, setIsLoading] = useState(false);

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
