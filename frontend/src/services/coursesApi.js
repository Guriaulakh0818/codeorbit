import { API_BASE, getAuthHeaders } from './apiConfig';

export const coursesApi = {
  /**
   * Fetch published courses for the public catalog
   * @param {Object} options
   * @param {string} [options.track] - Optional track filter (e.g. 'DSA', 'SYSTEMS', 'WEB')
   * @param {string} [options.search] - Optional search query
   * @param {number} [options.page=0] - Page index (0-based)
   * @param {number} [options.size=12] - Items per page
   */
  async getCourses({ track = '', search = '', page = 0, size = 12 } = {}) {
    try {
      const params = new URLSearchParams();
      if (track && track !== 'ALL') params.set('track', track.trim());
      if (search && search.trim()) params.set('search', search.trim());
      params.set('page', String(page));
      params.set('size', String(size));

      const res = await fetch(`${API_BASE}/courses?${params.toString()}`, {
        headers: getAuthHeaders(false)
      });

      if (res.ok) {
        const json = await res.json();
        const paged = json.data || {};
        return {
          success: true,
          data: paged.content || [],
          totalElements: paged.totalElements || 0,
          totalPages: paged.totalPages || 0,
          page: paged.page || 0,
          size: paged.size || size,
          last: paged.last ?? true
        };
      }

      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errJson.message || `Failed to fetch courses (HTTP ${res.status})`,
        data: []
      };
    } catch (e) {
      return {
        success: false,
        message: 'Server is currently unreachable. Please ensure the backend is running.',
        data: []
      };
    }
  },

  /**
   * Fetch single published course detail and syllabus by slug
   * @param {string} slug
   */
  async getCourseBySlug(slug) {
    try {
      const res = await fetch(`${API_BASE}/courses/${encodeURIComponent(slug)}`, {
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
        message: errJson.message || (res.status === 404 ? 'Course not found' : 'Failed to load course detail')
      };
    } catch (e) {
      return {
        success: false,
        status: 503,
        message: 'Server is currently unreachable.'
      };
    }
  },

  /**
   * Fetch public lesson content with explicit language parameter
   * @param {string} courseSlug
   * @param {string} lessonSlug
   * @param {string} [lang='en'] - 'en' or 'hinglish'
   */
  async getLesson(courseSlug, lessonSlug, lang = 'en') {
    try {
      const params = new URLSearchParams();
      if (lang) params.set('lang', lang);

      const res = await fetch(
        `${API_BASE}/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}?${params.toString()}`,
        {
          headers: getAuthHeaders(false)
        }
      );

      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }

      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        message: errJson.message || (res.status === 404 ? 'Lesson not found' : 'Failed to load lesson')
      };
    } catch (e) {
      return {
        success: false,
        status: 503,
        message: 'Server is currently unreachable.'
      };
    }
  },

  /**
   * Fetch public quiz questions with randomized options (no answer keys exposed)
   * @param {string} courseSlug
   * @param {string} quizSlug
   * @param {string} [lang='en'] - 'en' or 'hinglish'
   */
  async getQuiz(courseSlug, quizSlug, lang = 'en') {
    try {
      const params = new URLSearchParams();
      if (lang) params.set('lang', lang);

      const res = await fetch(
        `${API_BASE}/courses/${encodeURIComponent(courseSlug)}/quizzes/${encodeURIComponent(quizSlug)}?${params.toString()}`,
        {
          headers: getAuthHeaders(false)
        }
      );

      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }

      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        message: errJson.message || (res.status === 404 ? 'Quiz not found' : 'Failed to load quiz')
      };
    } catch (e) {
      return {
        success: false,
        status: 503,
        message: 'Server is currently unreachable.'
      };
    }
  }
};
