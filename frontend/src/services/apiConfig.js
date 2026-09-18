/**
 * Unified API Configuration for CodeOrbit
 * Configurable via VITE_API_BASE_URL (defaults to '/api' for Vite dev proxy and production reverse proxy)
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const getAuthToken = () => {
  return localStorage.getItem('codeorbit_jwt');
};

export const getAuthHeaders = (includeJson = true) => {
  const token = getAuthToken();
  const headers = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
