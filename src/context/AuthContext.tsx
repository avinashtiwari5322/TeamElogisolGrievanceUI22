import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

interface RegisterData {
  userName: string;
  email: string;
  password: string;
  mobile?: string;
  companyName: string;
  role: 'User';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock data for demonstration
const mockUsers: User[] = [
  {
    userId: 1,
    userName: 'admin',
    email: 'admin@elogisol.com',
    roleId: 1,
    role: 'Admin',
    isActive: true
  },
  {
    userId: 2,
    userName: 'john_doe',
    email: 'john@company.com',
    roleId: 2,
    role: 'User',
    companyId: 1,
    companyName: 'Tech Corp',
    isActive: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Real API authentication
    const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.success && data.accessToken && data.user) {
      // Store token and user details in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      throw new Error(data.message || 'Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('accessToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const register = async (userData: RegisterData): Promise<void> => {
    // Mock registration
    const newUser: User = {
      userId: mockUsers.length + 1,
      userName: userData.userName,
      email: userData.email,
      mobile: userData.mobile,
      role: 'User',
      isActive: true,
      company: {
        companyId: 1,
        companyName: userData.companyName,
        isActive: true
      },
      roleId: 0,
    };

    mockUsers.push(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};