import { API_BASE } from './apiConfig';

const AUTH_API_BASE = `${API_BASE}/auth`;

export const authApi = {
  /**
   * Register a new student
   */
  async register({ fullName, email, password }) {
    try {
      const res = await fetch(`${AUTH_API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
        signal: AbortSignal.timeout(5000)
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed. Please check your inputs.'
        };
      }

      return {
        success: true,
        token: data.data.token,
        user: data.data.user,
        message: data.message
      };
    } catch (err) {
      return {
        success: false,
        message: 'Could not connect to authentication server. Please check your network or try again.'
      };
    }
  },

  /**
   * Login with email and password
   */
  async login(email, password) {
    try {
      const res = await fetch(`${AUTH_API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(5000)
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Invalid email or password.'
        };
      }

      return {
        success: true,
        token: data.data.token,
        user: data.data.user,
        message: data.message
      };
    } catch (err) {
      return {
        success: false,
        message: 'Could not connect to authentication server.'
      };
    }
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(token) {
    try {
      const res = await fetch(`${AUTH_API_BASE}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: AbortSignal.timeout(3000)
      });

      if (!res.ok) {
        return { success: false, status: res.status };
      }

      const data = await res.json();
      return {
        success: true,
        user: data.data
      };
    } catch (err) {
      return { success: false };
    }
  }
};
