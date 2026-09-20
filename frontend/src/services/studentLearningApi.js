import { API_BASE, getAuthHeaders } from './apiConfig';

export const studentLearningApi = {
  /**
   * Notify server that authenticated student started viewing a lesson
   * @param {number} lessonId
   */
  async markInProgress(lessonId) {
    try {
      const res = await fetch(`${API_BASE}/student/progress/in-progress`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ lessonId, completed: false })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, message: json.message };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  },

  /**
   * Mark lesson completed authoritatively on the server
   * @param {number} lessonId
   */
  async markCompleted(lessonId) {
    try {
      const res = await fetch(`${API_BASE}/student/progress/complete`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ lessonId, completed: true })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, message: json.message };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to update progress' };
    } catch (e) {
      return { success: false, message: 'Server unreachable' };
    }
  },

  /**
   * Toggle lesson bookmark
   * @param {number} lessonId
   */
  async toggleBookmark(lessonId) {
    try {
      const res = await fetch(`${API_BASE}/student/progress/bookmark`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ lessonId })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, isBookmarked: json.data };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  },

  /**
   * Fetch authoritatively computed progress for a specific course
   * @param {string} courseSlug
   */
  async getCourseProgress(courseSlug) {
    try {
      const res = await fetch(`${API_BASE}/student/progress/${encodeURIComponent(courseSlug)}`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      return { success: false, data: null };
    } catch (e) {
      return { success: false, data: null };
    }
  },

  /**
   * Synchronize guest / local storage progress to server upon login
   * @param {Object} payload
   * @param {number[]} payload.completedLessonIds
   * @param {number[]} payload.bookmarkedLessonIds
   */
  async syncGuestProgress({ completedLessonIds = [], bookmarkedLessonIds = [] }) {
    try {
      const res = await fetch(`${API_BASE}/student/progress/sync`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ completedLessonIds, bookmarkedLessonIds })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  },

  /**
   * Submit quiz attempt for authoritative server evaluation
   * @param {number} quizId
   * @param {Object} payload
   * @param {string} payload.language - 'en' or 'hinglish'
   * @param {Array<{questionId: number, selectedOptionId: string}>} payload.answers
   */
  async submitQuiz(quizId, payload) {
    try {
      const res = await fetch(`${API_BASE}/student/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to submit quiz attempt' };
    } catch (e) {
      return { success: false, message: 'Server unreachable during quiz submission' };
    }
  },

  /**
   * Fetch past attempts for a quiz
   * @param {number} quizId
   */
  async getQuizAttempts(quizId) {
    try {
      const res = await fetch(`${API_BASE}/student/quizzes/${quizId}/attempts`, {
        headers: getAuthHeaders(true)
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
   * Claim and generate course certificate upon 100% completion & quiz pass
   * @param {string} courseSlug
   */
  async claimCertificate(courseSlug) {
    try {
      const res = await fetch(`${API_BASE}/student/certificates/claim/${encodeURIComponent(courseSlug)}`, {
        method: 'POST',
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, message: json.message, data: json.data };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Failed to issue certificate' };
    } catch (e) {
      return { success: false, message: 'Server unreachable during certificate generation' };
    }
  },

  /**
   * Fetch all earned certificates for current student
   */
  async getStudentCertificates() {
    try {
      const res = await fetch(`${API_BASE}/student/certificates`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data || [] };
      }
      return { success: false, data: [] };
    } catch (e) {
      return { success: false, data: [] };
    }
  }
};
