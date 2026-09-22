import { API_BASE, getAuthHeaders } from './apiConfig';

export const placementKitApi = {
  /**
   * Get all active placement kits (Public catalog)
   */
  async getAllKits() {
    try {
      const res = await fetch(`${API_BASE}/placement-kits`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data || [] };
      }
      return { success: false, message: 'Failed to fetch placement kits' };
    } catch (err) {
      console.error('Network error fetching placement kits:', err);
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  },

  /**
   * Get kit detail by slug
   * @param {string} slug
   */
  async getKitBySlug(slug) {
    if (!slug) return { success: false, message: 'Kit slug is required' };
    try {
      const res = await fetch(`${API_BASE}/placement-kits/${encodeURIComponent(slug)}`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Kit not found' };
    } catch (err) {
      console.error('Network error fetching kit detail:', err);
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  },

  /**
   * Create Razorpay payment order for ₹99 Placement Kit
   * @param {string} slug
   */
  async createKitOrder(slug) {
    if (!slug) return { success: false, message: 'Kit slug is required' };
    try {
      const res = await fetch(`${API_BASE}/placement-kits/${encodeURIComponent(slug)}/order`, {
        method: 'POST',
        headers: getAuthHeaders(true)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Could not initiate kit purchase' };
    } catch (err) {
      console.error('Network error creating kit order:', err);
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  },

  /**
   * Verify Razorpay payment and unlock Placement Kit
   * @param {string} slug
   * @param {{razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string}} payload
   */
  async verifyKitPayment(slug, payload) {
    if (!slug) return { success: false, message: 'Kit slug is required' };
    try {
      const res = await fetch(`${API_BASE}/placement-kits/${encodeURIComponent(slug)}/verify`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Payment signature verification failed' };
    } catch (err) {
      console.error('Network error verifying kit payment:', err);
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  },

  /**
   * Get student's purchased placement kits
   */
  async getMyPurchasedKits() {
    try {
      const res = await fetch(`${API_BASE}/placement-kits/my`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data || [] };
      }
      return { success: false, message: 'Failed to fetch purchased kits' };
    } catch (err) {
      console.error('Network error fetching student purchased kits:', err);
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  },

  /**
   * Submit practice answer for immediate evaluation
   * @param {string} slug
   * @param {number} questionId
   * @param {{selectedOptionId?: number, userAnswer?: string}} payload
   */
  async submitPracticeAnswer(slug, questionId, payload) {
    try {
      const res = await fetch(`${API_BASE}/placement-kits/${encodeURIComponent(slug)}/practice/${questionId}/submit`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, message: json.message || 'Submission failed' };
    } catch (err) {
      console.error('Network error submitting practice answer:', err);
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  },

  /**
   * Get student's practice progress on kit
   * @param {string} slug
   */
  async getKitProgress(slug) {
    try {
      const res = await fetch(`${API_BASE}/placement-kits/${encodeURIComponent(slug)}/progress`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      return { success: false, message: 'Failed to fetch kit progress' };
    } catch (err) {
      return { success: false, message: 'Server unreachable' };
    }
  }
};
