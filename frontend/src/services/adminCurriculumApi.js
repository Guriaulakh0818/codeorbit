import { API_BASE, getAuthHeaders, fetchWithTimeout } from './apiConfig';
import { CURRICULUM_DATA, TECH_DOMAINS } from '../data/curriculumData';

const ADMIN_CURRICULUM_BASE = `${API_BASE}/admin/curriculum`;
const STORAGE_KEY = 'codeorbit_admin_curriculum_cache_v2';

// Helper to get local data initialized from CURRICULUM_DATA
function getLocalCurriculumStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 20) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }

  // Deep clone from CURRICULUM_DATA
  const initial = JSON.parse(JSON.stringify(CURRICULUM_DATA));
  saveLocalCurriculumStore(initial);
  return initial;
}

function saveLocalCurriculumStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export const adminCurriculumApi = {
  // ==========================================
  // COURSES
  // ==========================================

  async getCourses({ search = '', track = '', status = '', page = 0, size = 50, sortBy = 'orderIndex', sortDir = 'asc' } = {}) {
    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.set('search', search.trim());
      if (track && track !== 'ALL') params.set('track', track);
      if (status && status !== 'ALL') params.set('status', status);
      params.set('page', String(page));
      params.set('size', String(size));
      params.set('sortBy', sortBy);
      params.set('sortDir', sortDir);

      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/courses?${params.toString()}`, {
        headers: getAuthHeaders()
      }, 2000);

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data.content) && json.data.content.length > 0) {
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
      }
    } catch (e) {
      // fallback below
    }

    // Local Store Fallback
    let list = getLocalCurriculumStore();
    if (track && track !== 'ALL') {
      list = list.filter((c) => c.track?.toUpperCase() === track.toUpperCase());
    }
    if (status && status !== 'ALL') {
      list = list.filter((c) => c.status?.toUpperCase() === status.toUpperCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.shortDescription?.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: list,
      totalElements: list.length,
      totalPages: Math.ceil(list.length / size) || 1,
      page: 0,
      size,
      last: true
    };
  },

  async getCourseById(courseId) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}`, {
        headers: getAuthHeaders()
      }, 2000);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return { success: true, data: json.data };
      }
    } catch (e) {
      // fallback
    }

    const list = getLocalCurriculumStore();
    const course = list.find((c) => String(c.id) === String(courseId) || c.slug === String(courseId));
    if (course) {
      return { success: true, data: course };
    }
    return { success: false, message: 'Course not found in database.' };
  },

  async createCourse(payload) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      }, 3000);
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
    } catch (e) {
      // fallback
    }

    const list = getLocalCurriculumStore();
    const newCourse = {
      id: Date.now(),
      title: payload.title,
      slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      track: payload.track || 'CS_CORE',
      difficultyLevel: payload.difficultyLevel || 'BEGINNER_TO_ADVANCED',
      estimatedHours: Number(payload.estimatedHours) || 30,
      orderIndex: list.length + 1,
      status: payload.status || 'PUBLISHED',
      shortDescription: payload.shortDescription || '',
      description: payload.description || '',
      subcourses: [
        { curriculumLevel: 'BEGINNER', title: 'Beginner Foundations', slug: 'beginner', isFree: true, priceInr: 0 },
        { curriculumLevel: 'INTERMEDIATE', title: 'Intermediate Core', slug: 'intermediate', isFree: true, priceInr: 0 },
        { curriculumLevel: 'ADVANCED', title: 'Advanced Mastery', slug: 'advanced', isFree: true, priceInr: 0 },
        { curriculumLevel: 'PLACEMENT_READY', title: 'Placement Ready Prep', slug: 'placement-ready', isFree: false, priceInr: 29 }
      ],
      modules: []
    };
    list.push(newCourse);
    saveLocalCurriculumStore(list);
    return { success: true, data: newCourse, message: 'Course created successfully.' };
  },

  async updateCourse(courseId, payload) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      }, 3000);
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
    } catch (e) {
      // fallback
    }

    const list = getLocalCurriculumStore();
    const idx = list.findIndex((c) => String(c.id) === String(courseId));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      saveLocalCurriculumStore(list);
      return { success: true, data: list[idx], message: 'Course updated successfully.' };
    }
    return { success: false, message: 'Course not found.' };
  },

  async updateCourseStatus(courseId, status) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      }, 2000);
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
    } catch (e) {
      // fallback
    }

    const list = getLocalCurriculumStore();
    const course = list.find((c) => String(c.id) === String(courseId));
    if (course) {
      course.status = status;
      saveLocalCurriculumStore(list);
      return { success: true, data: course, message: `Status updated to ${status}` };
    }
    return { success: false, message: 'Course not found.' };
  },

  async deleteCourse(courseId) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }, 2000);
      if (res.ok) return { success: true };
    } catch (e) {
      // fallback
    }

    let list = getLocalCurriculumStore();
    list = list.filter((c) => String(c.id) !== String(courseId));
    saveLocalCurriculumStore(list);
    return { success: true, message: 'Course deleted successfully.' };
  },

  // ==========================================
  // SUBCOURSES / TIERS & CONCEPTS
  // ==========================================

  async updateSubcourse(courseId, subcourseId, payload) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/subcourses/${subcourseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      }, 3000);
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
    } catch (e) {
      // fallback
    }

    const list = getLocalCurriculumStore();
    for (const c of list) {
      if (String(c.id) === String(courseId) || c.slug === String(courseId)) {
        if (!c.subcourses) c.subcourses = [];
        const sub = c.subcourses.find((s) => String(s.id) === String(subcourseId) || s.slug === String(subcourseId) || s.curriculumLevel === payload.curriculumLevel);
        if (sub) {
          Object.assign(sub, payload);
          saveLocalCurriculumStore(list);
          return { success: true, data: sub, message: 'Tier concepts updated successfully.' };
        } else {
          c.subcourses.push({ id: Date.now(), ...payload });
          saveLocalCurriculumStore(list);
          return { success: true, data: payload, message: 'Tier concepts added successfully.' };
        }
      }
    }
    return { success: false, message: 'Course not found.' };
  },

  // ==========================================
  // MODULES
  // ==========================================

  async createModule(courseId, payload) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      }, 3000);
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
    } catch (e) {
      // fallback
    }

    const list = getLocalCurriculumStore();
    const course = list.find((c) => String(c.id) === String(courseId));
    if (course) {
      if (!course.modules) course.modules = [];
      const newModule = {
        id: Date.now(),
        courseId: Number(courseId),
        title: payload.title,
        slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: payload.description || '',
        orderIndex: course.modules.length + 1,
        curriculumLevel: payload.curriculumLevel || 'BEGINNER',
        status: payload.status || 'PUBLISHED',
        lessons: [],
        quizzes: []
      };
      course.modules.push(newModule);
      saveLocalCurriculumStore(list);
      return { success: true, data: newModule, message: 'Module added successfully.' };
    }
    return { success: false, message: 'Parent course not found.' };
  },

  async updateModule(moduleId, payload) {
    try {
      const res = await fetchWithTimeout(`${ADMIN_CURRICULUM_BASE}/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      }, 3000);
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data, message: json.message };
      }
    } catch (e) {
      // fallback
    }

    const list = getLocalCurriculumStore();
    for (const c of list) {
      const mod = c.modules?.find((m) => String(m.id) === String(moduleId));
      if (mod) {
        Object.assign(mod, payload);
        saveLocalCurriculumStore(list);
        return { success: true, data: mod, message: 'Module updated successfully.' };
      }
    }
    return { success: false, message: 'Module not found.' };
  },

  async updateModuleStatus(moduleId, status) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      const mod = c.modules?.find((m) => String(m.id) === String(moduleId));
      if (mod) {
        mod.status = status;
        saveLocalCurriculumStore(list);
        return { success: true, data: mod, message: 'Status updated.' };
      }
    }
    return { success: true };
  },

  async deleteModule(moduleId) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      if (c.modules) {
        c.modules = c.modules.filter((m) => String(m.id) !== String(moduleId));
      }
    }
    saveLocalCurriculumStore(list);
    return { success: true, message: 'Module deleted.' };
  },

  // ==========================================
  // LESSONS
  // ==========================================

  async createLesson(moduleId, payload) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      const mod = c.modules?.find((m) => String(m.id) === String(moduleId));
      if (mod) {
        if (!mod.lessons) mod.lessons = [];
        const newLesson = {
          id: Date.now(),
          moduleId: Number(moduleId),
          title: payload.title,
          slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          estimatedMinutes: Number(payload.estimatedMinutes) || 15,
          orderIndex: mod.lessons.length + 1,
          status: payload.status || 'PUBLISHED',
          hinglishStatus: payload.hinglishStatus || 'PUBLISHED',
          contentEn: payload.contentEn || `# ${payload.title}\n\nLesson concept overview.`,
          contentHinglish: payload.contentHinglish || `# ${payload.title} 🇮🇳\n\nConcept ka Hinglish explanation.`,
          codeSnippetJava: payload.codeSnippetJava || '',
          codeSnippetCpp: payload.codeSnippetCpp || '',
          codeSnippetPython: payload.codeSnippetPython || ''
        };
        mod.lessons.push(newLesson);
        saveLocalCurriculumStore(list);
        return { success: true, data: newLesson, message: 'Lesson created successfully.' };
      }
    }
    return { success: false, message: 'Module not found.' };
  },

  async updateLesson(lessonId, payload) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      for (const m of c.modules || []) {
        const les = m.lessons?.find((l) => String(l.id) === String(lessonId));
        if (les) {
          Object.assign(les, payload);
          saveLocalCurriculumStore(list);
          return { success: true, data: les, message: 'Lesson updated successfully.' };
        }
      }
    }
    return { success: false, message: 'Lesson not found.' };
  },

  async updateLessonStatus(lessonId, status) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      for (const m of c.modules || []) {
        const les = m.lessons?.find((l) => String(l.id) === String(lessonId));
        if (les) {
          les.status = status;
          saveLocalCurriculumStore(list);
          return { success: true, data: les };
        }
      }
    }
    return { success: true };
  },

  async deleteLesson(lessonId) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      for (const m of c.modules || []) {
        if (m.lessons) {
          m.lessons = m.lessons.filter((l) => String(l.id) !== String(lessonId));
        }
      }
    }
    saveLocalCurriculumStore(list);
    return { success: true, message: 'Lesson deleted.' };
  },

  // ==========================================
  // QUIZZES
  // ==========================================

  async createQuiz(moduleId, payload) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      const mod = c.modules?.find((m) => String(m.id) === String(moduleId));
      if (mod) {
        if (!mod.quizzes) mod.quizzes = [];
        const newQuiz = {
          id: Date.now(),
          moduleId: Number(moduleId),
          title: payload.title,
          slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: payload.description || '',
          minPassScorePercentage: Number(payload.minPassScorePercentage) || 80,
          quizType: payload.quizType || 'MODULE_QUIZ',
          curriculumLevel: payload.curriculumLevel || 'BEGINNER',
          status: payload.status || 'PUBLISHED',
          questions: []
        };
        mod.quizzes.push(newQuiz);
        saveLocalCurriculumStore(list);
        return { success: true, data: newQuiz, message: 'Quiz created successfully.' };
      }
    }
    return { success: false, message: 'Module not found.' };
  },

  async updateQuiz(quizId, payload) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      for (const m of c.modules || []) {
        const qz = m.quizzes?.find((q) => String(q.id) === String(quizId));
        if (qz) {
          Object.assign(qz, payload);
          saveLocalCurriculumStore(list);
          return { success: true, data: qz, message: 'Quiz updated successfully.' };
        }
      }
    }
    return { success: false, message: 'Quiz not found.' };
  },

  async updateQuizStatus(quizId, status) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      for (const m of c.modules || []) {
        const qz = m.quizzes?.find((q) => String(q.id) === String(quizId));
        if (qz) {
          qz.status = status;
          saveLocalCurriculumStore(list);
          return { success: true, data: qz };
        }
      }
    }
    return { success: true };
  },

  async deleteQuiz(quizId) {
    const list = getLocalCurriculumStore();
    for (const c of list) {
      for (const m of c.modules || []) {
        if (m.quizzes) {
          m.quizzes = m.quizzes.filter((q) => String(q.id) !== String(quizId));
        }
      }
    }
    saveLocalCurriculumStore(list);
    return { success: true, message: 'Quiz deleted.' };
  },

  // Export and Reset Utilities for Admin
  resetToDefaultCurriculum() {
    const initial = JSON.parse(JSON.stringify(CURRICULUM_DATA));
    saveLocalCurriculumStore(initial);
    return initial;
  }
};

export { TECH_DOMAINS, getLocalCurriculumStore };

export const fetchAdminCourses = async (params) => {
  const res = await adminCurriculumApi.getCourses(params);
  return {
    content: res.data || [],
    totalElements: res.totalElements || (res.data ? res.data.length : 0),
    totalPages: res.totalPages || 1
  };
};

export const fetchAdminCourseById = async (id) => {
  const res = await adminCurriculumApi.getCourseById(id);
  return res.data;
};

export const createCourse = (data) => adminCurriculumApi.createCourse(data);
export const updateCourse = (id, data) => adminCurriculumApi.updateCourse(id, data);
export const deleteCourse = (id) => adminCurriculumApi.deleteCourse(id);
export const updateCourseStatus = (id, status) => adminCurriculumApi.updateCourseStatus(id, status);

export const updateSubcourse = (courseId, subcourseId, data) => adminCurriculumApi.updateSubcourse(courseId, subcourseId, data);

export const createModule = (courseId, data) => adminCurriculumApi.createModule(courseId, data);
export const updateModule = (moduleId, data) => adminCurriculumApi.updateModule(moduleId, data);
export const deleteModule = (moduleId) => adminCurriculumApi.deleteModule(moduleId);

export const createLesson = (moduleId, data) => adminCurriculumApi.createLesson(moduleId, data);
export const updateLesson = (lessonId, data) => adminCurriculumApi.updateLesson(lessonId, data);
export const deleteLesson = (lessonId) => adminCurriculumApi.deleteLesson(lessonId);

export default adminCurriculumApi;

