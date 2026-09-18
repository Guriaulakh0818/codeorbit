import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('codeorbit_jwt'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('codeorbit_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validate token with backend /api/auth/me on mount
  useEffect(() => {
    async function verifyToken() {
      if (token) {
        const res = await authApi.getMe(token);
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('codeorbit_user', JSON.stringify(res.user));
        } else {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem('codeorbit_jwt');
          localStorage.removeItem('codeorbit_user');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    verifyToken();
  }, [token]);

  // Real Backend Login
  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('codeorbit_jwt', res.token);
      localStorage.setItem('codeorbit_user', JSON.stringify(res.user));
      return { success: true, user: res.user, role: res.user.role };
    }
    return { success: false, message: res.message || 'Invalid email or password' };
  };

  // Real Backend Registration (Strictly creates STUDENT accounts)
  const register = async ({ fullName, email, password }) => {
    const res = await authApi.register({ fullName, email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('codeorbit_jwt', res.token);
      localStorage.setItem('codeorbit_user', JSON.stringify(res.user));
      return { success: true, user: res.user, role: res.user.role };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('codeorbit_jwt');
    localStorage.removeItem('codeorbit_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      setUser,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'ADMIN',
      isStudent: user?.role === 'STUDENT'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      loading: false,
      login: async () => ({ success: false }),
      register: async () => ({ success: false }),
      logout: () => {},
      isAuthenticated: false,
      isAdmin: false,
      isStudent: false
    };
  }
  return context;
};
