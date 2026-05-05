import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem('isAuthenticated');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedAuth === 'true' && storedRole) {
        setIsAuthenticated(true);
        setRole(storedRole as Role);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (selectedRole: Role) => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    await AsyncStorage.setItem('isAuthenticated', 'true');
    if (selectedRole) {
      await AsyncStorage.setItem('role', selectedRole);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setRole(null);
    await AsyncStorage.removeItem('isAuthenticated');
    await AsyncStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
