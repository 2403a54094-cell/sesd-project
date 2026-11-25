import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export interface User {
  id: string;
  studentId: string;
  name: string;
  netId: string;
  email: string;
  department: string;
  role: string;
  passStatus: string;
  transitPassId: string;
  biometricSync: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (studentId: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage on mount
    const savedToken = localStorage.getItem('campusride_token');
    const savedUser = localStorage.getItem('campusride_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('campusride_user');
      }
    } else {
      // Default to demo user STU2026001 for seamless viewing
      const defaultUser: User = {
        id: 'user-1',
        studentId: 'STU2026001',
        name: 'Alex Chen',
        netId: 'STU-2024-8891',
        email: 'alex.chen@metro.edu',
        department: 'Undergraduate Senior • Computer Science',
        role: 'Student',
        passStatus: 'Valid • Zone 1-4',
        transitPassId: 'CP-98302-AZ',
        biometricSync: 'Active & Ready'
      };
      localStorage.setItem('campusride_token', 'MOCK_TOKEN_STU2026001');
      localStorage.setItem('campusride_user', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (studentId: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login(studentId, password);
      localStorage.setItem('campusride_token', data.token);
      localStorage.setItem('campusride_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('campusride_token');
    localStorage.removeItem('campusride_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
