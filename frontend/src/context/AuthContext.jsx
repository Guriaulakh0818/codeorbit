import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('codeorbit_jwt'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('codeorbit_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Validate token with backend /api/auth/me on mount in the background without wiping session on network delay
  useEffect(() => {
    let isMounted = true;

    async function verifyToken() {
      const savedToken = localStorage.getItem('codeorbit_jwt');
      const savedUser = localStorage.getItem('codeorbit_user');
      
      if (!savedToken || !savedUser) {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
        return;
      }

      // If it's a local fallback session token, always preserve authenticated student state
      if (savedToken.startsWith('co_auth_')) {
        try {
          const parsed = JSON.parse(savedUser);
          if (isMounted && parsed) {
            setUser(parsed);
          }
        } catch (e) {}
        return;
      }

      const res = await authApi.getMe(savedToken);
      if (!isMounted) return;

      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('codeorbit_user', JSON.stringify(res.user));
      } else if (res.isAuthError) {
        // Only wipe if it's a real server token that has genuinely expired
        setToken(null);
        setUser(null);
        localStorage.removeItem('codeorbit_jwt');
        localStorage.removeItem('codeorbit_user');
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, []);

  // Real Backend Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('codeorbit_jwt', res.token);
        localStorage.setItem('codeorbit_user', JSON.stringify(res.user));
        return { success: true, user: res.user, role: res.user.role };
      }
      return { success: false, message: res.message || 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  // Real Backend Registration
  const register = async ({ fullName, email, password }) => {
    setLoading(true);
    try {
      const res = await authApi.register({ fullName, email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('codeorbit_jwt', res.token);
        localStorage.setItem('codeorbit_user', JSON.stringify(res.user));
        return { success: true, user: res.user, role: res.user.role };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const loginWithGoogle = async (idToken, mockUserData = null) => {
    setLoading(true);
    try {
      const res = await authApi.loginWithGoogle(idToken, mockUserData);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('codeorbit_jwt', res.token);
        localStorage.setItem('codeorbit_user', JSON.stringify(res.user));
        return { success: true, user: res.user, role: res.user.role };
      }
      return { success: false, message: res.message || 'Google sign-in failed' };
    } finally {
      setLoading(false);
    }
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
      loginWithGoogle,
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
      loginWithGoogle: async () => ({ success: false }),
      logout: () => {},
      isAuthenticated: false,
      isAdmin: false,
      isStudent: false
    };
  }
  return context;
};

export default AuthContext;
