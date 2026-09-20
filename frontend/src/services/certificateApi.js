import { API_BASE, getAuthHeaders } from './apiConfig';

export const certificateApi = {
  /**
   * Verify certificate by code (public endpoint)
   * @param {string} certificateCode
   */
  async verifyCertificate(certificateCode) {
    try {
      const code = (certificateCode || '').trim().toUpperCase();
      const res = await fetch(`${API_BASE}/certificates/verify/${encodeURIComponent(code)}`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        message: err.message || (res.status === 404 ? 'Certificate not found' : 'Failed to verify certificate')
      };
    } catch (e) {
      return {
        success: false,
        status: 503,
        message: 'Server unreachable during verification'
      };
    }
  }
};
