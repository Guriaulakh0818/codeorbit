import { API_BASE, getAuthHeaders } from './apiConfig';

export const certificateApi = {
  /**
   * Verify certificate by code (public endpoint)
   * @param {string} certificateCode
   */
  async verifyCertificate(certificateCode) {
    const code = (certificateCode || '').trim().toUpperCase();
    if (!code) {
      return { success: false, status: 400, message: 'Please enter a certificate code.' };
    }

    try {
      const res = await fetch(`${API_BASE}/certificates/verify/${encodeURIComponent(code)}`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return { success: true, data: json.data };
        }
      }
    } catch (e) {
      // Check fallback below
    }

    // Check locally issued certificates
    try {
      const localDirect = localStorage.getItem(`codeorbit_cert_${code}`);
      if (localDirect) {
        return { success: true, data: JSON.parse(localDirect) };
      }

      const rawList = localStorage.getItem('codeorbit_user_certificates');
      if (rawList) {
        const list = JSON.parse(rawList);
        const found = list.find((c) => (c.certificateCode || '').toUpperCase() === code);
        if (found) {
          return { success: true, data: found };
        }
      }
    } catch (e) {}

    return {
      success: false,
      status: 404,
      message: `No issued certificate matches the code "${code}".`
    };
  }
};
