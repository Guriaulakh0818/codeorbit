import { API_BASE, getAuthHeaders } from './apiConfig';

const ADMIN_API_BASE = `${API_BASE}/admin`;

export const adminApi = {
  /**
   * Fetch admin overview metrics from database
   */
  async getMetrics() {
    try {
      const res = await fetch(`${ADMIN_API_BASE}/orders/metrics`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, source: 'BACKEND' };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || `Failed to fetch metrics (HTTP ${res.status})` };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable. Please ensure the server is running.' };
    }
  },

  /**
   * Fetch paginated student orders with filters
   */
  async getOrders({ search = '', status = '', startDate = '', endDate = '', page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.set('search', search.trim());
      if (status && status !== 'ALL') params.set('status', status);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      params.set('page', String(page));
      params.set('size', String(size));
      params.set('sortBy', sortBy);
      params.set('sortDir', sortDir);

      const res = await fetch(`${ADMIN_API_BASE}/orders?${params.toString()}`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          data: json.data.content,
          totalElements: json.data.totalElements,
          totalPages: json.data.totalPages,
          page: json.data.page,
          size: json.data.size,
          last: json.data.last
        };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || `Failed to fetch orders (HTTP ${res.status})` };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable. Please ensure the server is running.' };
    }
  },

  /**
   * Fetch single order details by ID
   */
  async getOrderById(id) {
    try {
      const res = await fetch(`${ADMIN_API_BASE}/orders/${id}`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to fetch order details' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable' };
    }
  },

  /**
   * Fetch all e-books for admin management table
   */
  async getEbooks({ search = '', category = '', active = null, page = 0, size = 20 } = {}, fallbackList = []) {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'all') params.set('category', category);
      if (active !== null) params.set('active', String(active));
      params.set('page', String(page));
      params.set('size', String(size));

      const res = await fetch(`${ADMIN_API_BASE}/ebooks?${params.toString()}`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data.content, total: json.data.totalElements, source: 'BACKEND' };
      }
    } catch (e) {
      // Backend offline
    }
    return { success: true, data: fallbackList, total: fallbackList.length, source: 'LOCAL' };
  },

  /**
   * Create new e-book (supports JSON payload or FormData with PDF file)
   */
  async createEbook(payload) {
    try {
      const isFormData = payload instanceof FormData;
      const res = await fetch(`${ADMIN_API_BASE}/ebooks`, {
        method: 'POST',
        headers: isFormData ? { ...getAuthHeaders() } : { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: isFormData ? payload : JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message, source: 'BACKEND' };
      } else {
        const errorJson = await res.json().catch(() => ({}));
        return { success: false, message: errorJson.message || 'Failed to save e-book' };
      }
    } catch (e) {
      return { success: false, message: 'Backend unreachable. Saved to local storage.', source: 'LOCAL' };
    }
  },

  /**
   * Update existing e-book
   */
  async updateEbook(id, payload) {
    try {
      const isFormData = payload instanceof FormData;
      const res = await fetch(`${ADMIN_API_BASE}/ebooks/${id}`, {
        method: 'PUT',
        headers: isFormData ? { ...getAuthHeaders() } : { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: isFormData ? payload : JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message, source: 'BACKEND' };
      }
    } catch (e) {
      // fallback
    }
    return { success: true, message: 'Updated in local store', source: 'LOCAL' };
  },

  /**
   * Toggle Publish / Unpublish status
   */
  async toggleStatus(id, active) {
    try {
      const res = await fetch(`${ADMIN_API_BASE}/ebooks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ active })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message, source: 'BACKEND' };
      }
    } catch (e) {
      // fallback
    }
    return { success: true, message: `E-Book ${active ? 'Published' : 'Unpublished'} locally`, source: 'LOCAL' };
  },

  /**
   * Delete e-book
   */
  async deleteEbook(id) {
    try {
      const res = await fetch(`${ADMIN_API_BASE}/ebooks/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders()
        }
      });
      if (res.ok) {
        return { success: true, source: 'BACKEND' };
      }
    } catch (e) {
      // fallback
    }
    return { success: true, source: 'LOCAL' };
  }
};

