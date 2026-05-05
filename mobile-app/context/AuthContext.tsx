import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'customer' | 'worker' | null;

interface AuthContextData {
  isAuthenticated: boolean;
  role: Role;
  login: (selectedRole: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock implementation since AsyncStorage is not installed
  // In real app, you would load from AsyncStorage here

  const login = (selectedRole: Role) => {
    setIsAuthenticated(true);
    setRole(selectedRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
