/**
 * Unified API Configuration for CodeOrbit
 * Configurable via VITE_API_BASE_URL (defaults to '/api' for Vite dev proxy and production reverse proxy)
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
export const API_BASE_URL = API_BASE;

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

/**
 * Enhanced fetch wrapper with fast timeout and AbortController to prevent long UI hangs
 * @param {string} url 
 * @param {RequestInit} [options={}] 
 * @param {number} [timeoutMs=3500] 
 * @returns {Promise<Response>}
 */
export const fetchWithTimeout = async (url, options = {}, timeoutMs = 3500) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};
