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
      } else if (res.status === 404) {
        return { success: false, status: 404, message: `No issued certificate matches code "${code}".` };
      }
    } catch (e) {
      // Fallback
    }

    // Check locally cached issued certificates
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
  },

  /**
   * Get server-side certificate eligibility and purchase status for a course
   * @param {string} courseSlug
   */
  async getCertificateStatus(courseSlug) {
    if (!courseSlug) return { success: false, message: 'Course slug required' };
    try {
      const res = await fetch(`${API_BASE}/certificates/status/${encodeURIComponent(courseSlug)}`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to fetch certificate status' };
    } catch (err) {
      return { success: false, message: 'Network error fetching certificate status' };
    }
  },

  /**
   * Create ₹9 Razorpay order for certificate purchase
   * @param {string} courseSlug
   */
  async createCertificateOrder(courseSlug) {
    if (!courseSlug) return { success: false, message: 'Course slug required' };
    try {
      const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(courseSlug)}/order`, {
        method: 'POST',
        headers: getAuthHeaders(true)
      });
      const json = await res.json();
      if (res.ok && json.data) {
        return { success: true, data: json.data, message: json.message };
      }
      return { success: false, message: json.message || 'Failed to create certificate order' };
    } catch (err) {
      return { success: false, message: 'Network error creating certificate order' };
    }
  },

  /**
   * Verify Razorpay payment and issue certificate
   * @param {string} courseSlug
   * @param {{ razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }} payload
   */
  async verifyCertificatePayment(courseSlug, payload) {
    if (!courseSlug) return { success: false, message: 'Course slug required' };
    try {
      const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(courseSlug)}/verify`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok && json.data) {
        // Cache certificate locally for offline/instant verification
        this._cacheCertificateLocally(json.data);
        return { success: true, data: json.data, message: json.message };
      }
      return { success: false, message: json.message || 'Payment verification failed' };
    } catch (err) {
      return { success: false, message: 'Network error during payment verification' };
    }
  },

  /**
   * Download official server-generated PDF certificate
   * @param {string} certificateCode
   */
  async downloadCertificatePdf(certificateCode) {
    if (!certificateCode) return { success: false, message: 'Certificate code required' };
    try {
      const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(certificateCode)}/download`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CodeOrbit_Certificate_${certificateCode.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return { success: true };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to download certificate PDF' };
    } catch (err) {
      return { success: false, message: 'Network error downloading certificate PDF' };
    }
  },

  _cacheCertificateLocally(cert) {
    if (!cert || !cert.certificateCode) return;
    try {
      localStorage.setItem(`codeorbit_cert_${cert.certificateCode.toUpperCase()}`, JSON.stringify(cert));
      const rawList = localStorage.getItem('codeorbit_user_certificates');
      const list = rawList ? JSON.parse(rawList) : [];
      const existingIdx = list.findIndex(c => c.certificateCode === cert.certificateCode);
      if (existingIdx >= 0) {
        list[existingIdx] = cert;
      } else {
        list.unshift(cert);
      }
      localStorage.setItem('codeorbit_user_certificates', JSON.stringify(list));
    } catch (e) {}
  }
};
