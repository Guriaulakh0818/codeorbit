import { API_BASE, getAuthHeaders } from './apiConfig';

export const catalogApi = {
  /**
   * Fetch active e-books for the public store catalog
   */
  async getEbooks({ search = '', category = '', page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.set('search', search.trim());
      if (category && category !== 'all') params.set('category', category.trim());
      params.set('page', String(page));
      params.set('size', String(size));
      params.set('sortBy', sortBy);
      params.set('sortDir', sortDir);

      const res = await fetch(`${API_BASE}/ebooks?${params.toString()}`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          data: json.data?.content || [],
          totalElements: json.data?.totalElements || 0,
          totalPages: json.data?.totalPages || 0,
          page: json.data?.page || 0,
          size: json.data?.size || size,
          last: json.data?.last ?? true
        };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || `Failed to fetch catalog (HTTP ${res.status})`, data: [] };
    } catch (e) {
      return { success: false, message: 'Server is currently unreachable. Please ensure the backend is running.', data: [] };
    }
  },

  /**
   * Fetch distinct active categories from catalog
   */
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/ebooks/categories`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data || [] };
      }
      return { success: false, data: [] };
    } catch (e) {
      return { success: false, data: [] };
    }
  },

  /**
   * Fetch single active e-book by ID
   */
  async getEbookById(id) {
    try {
      const res = await fetch(`${API_BASE}/ebooks/${id}`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { 
        success: false, 
        status: res.status,
        message: errJson.message || (res.status === 404 ? 'E-Book not found in store catalog' : 'Failed to load e-book') 
      };
    } catch (e) {
      return { success: false, status: 503, message: 'Server is currently unreachable' };
    }
  }
};
