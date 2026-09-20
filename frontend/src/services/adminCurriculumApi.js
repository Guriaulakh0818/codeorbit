import { API_BASE, getAuthHeaders } from './apiConfig';

const ADMIN_CURRICULUM_BASE = `${API_BASE}/admin/curriculum`;

export const adminCurriculumApi = {
  // ==========================================
  // COURSES
  // ==========================================

  async getCourses({ search = '', track = '', status = '', page = 0, size = 10, sortBy = 'orderIndex', sortDir = 'asc' } = {}) {
    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.set('search', search.trim());
      if (track && track !== 'ALL') params.set('track', track);
      if (status && status !== 'ALL') params.set('status', status);
      params.set('page', String(page));
      params.set('size', String(size));
      params.set('sortBy', sortBy);
      params.set('sortDir', sortDir);

      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/courses?${params.toString()}`, {
        headers: getAuthHeaders()
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
      return { success: false, message: errJson.message || `Failed to fetch courses (HTTP ${res.status})` };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async getCourseById(courseId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to load course details.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async createCourse(payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to create course.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateCourse(courseId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update course.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateCourseStatus(courseId, status) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update course status.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async deleteCourse(courseId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return { success: true };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to delete course.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  // ==========================================
  // MODULES
  // ==========================================

  async createModule(courseId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to create module.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateModule(moduleId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update module.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateModuleStatus(moduleId, status) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/modules/${moduleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update module status.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async deleteModule(moduleId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/modules/${moduleId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return { success: true };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to delete module.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  // ==========================================
  // LESSONS
  // ==========================================

  async getLessonById(lessonId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/lessons/${lessonId}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to load lesson.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async createLesson(moduleId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to create lesson.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateLesson(lessonId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update lesson.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateLessonStatus(lessonId, status) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/lessons/${lessonId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update lesson status.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async deleteLesson(lessonId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return { success: true };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to delete lesson.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  // ==========================================
  // QUIZZES & QUESTIONS
  // ==========================================

  async getQuizById(quizId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/quizzes/${quizId}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to load quiz.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async createQuiz(moduleId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/modules/${moduleId}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to create quiz.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateQuiz(quizId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update quiz.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateQuizStatus(quizId, status) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/quizzes/${quizId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update quiz status.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async deleteQuiz(quizId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return { success: true };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to delete quiz.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async addQuestion(quizId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/quizzes/${quizId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to add question.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async updateQuestion(questionId, payload) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to update question.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  },

  async deleteQuestion(questionId) {
    try {
      const res = await fetch(`${ADMIN_CURRICULUM_BASE}/questions/${questionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return { success: true };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || 'Failed to delete question.' };
    } catch (e) {
      return { success: false, message: 'Backend service unreachable.' };
    }
  }
};
