import { API_BASE, getAuthHeaders, fetchWithTimeout } from './apiConfig';
import { getLocalCurriculumStore } from './adminCurriculumApi';

export const coursesApi = {
  /**
   * Fetch published courses for the public catalog
   * @param {Object} options
   * @param {string} [options.track] - Optional track filter (e.g. 'DSA', 'OS', 'DBMS')
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

      const res = await fetchWithTimeout(`${API_BASE}/courses?${params.toString()}`, {
        headers: getAuthHeaders(false)
      }, 2500);

      if (res.ok) {
        const json = await res.json();
        const paged = json.data || {};
        if (Array.isArray(paged.content) && paged.content.length > 0) {
          return {
            success: true,
            data: paged.content,
            totalElements: paged.totalElements || paged.content.length,
            totalPages: paged.totalPages || 1,
            page: paged.page || 0,
            size: paged.size || size,
            last: paged.last ?? true
          };
        }
      }
    } catch (e) {
      // fallback to synchronized curriculum store below
    }

    // Live Synchronized Dataset Fallback
    const store = getLocalCurriculumStore();
    let filtered = [...store];
    if (track && track !== 'ALL') {
      filtered = filtered.filter((c) => c.track?.toUpperCase() === track.toUpperCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) =>
        c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: filtered,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size) || 1,
      page: 0,
      size,
      last: true
    };
  },

  /**
   * Fetch single published course detail and syllabus by slug
   * @param {string} slug
   */
  async getCourseBySlug(slug) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/courses/${encodeURIComponent(slug)}`, {
        headers: getAuthHeaders(false)
      }, 2500);

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return { success: true, data: json.data };
        }
      }
    } catch (e) {
      // fallback below
    }

    // Live Synchronized Dataset Fallback
    const store = getLocalCurriculumStore();
    const course = store.find((c) => c.slug === slug || String(c.id) === String(slug));
    if (course) {
      return { success: true, data: course };
    }

    return {
      success: false,
      status: 404,
      message: 'Course track not found.'
    };
  },

  /**
   * Fetch public lesson content with explicit language parameter
   * @param {string} courseSlug
   * @param {string} lessonSlug
   * @param {string} [lang='en'] - 'en' or 'hinglish'
   */
  async getLesson(courseSlug, lessonSlug, lang = 'en') {
    const isHinglishRequested = lang === 'hinglish';

    try {
      const params = new URLSearchParams();
      if (lang) params.set('lang', lang);

      const res = await fetchWithTimeout(
        `${API_BASE}/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}?${params.toString()}`,
        {
          headers: getAuthHeaders(false)
        },
        3000
      );

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const lessonData = json.data;
          // Ensure both content & contentMarkdown are populated with language
          const activeContent = lessonData.content || (isHinglishRequested ? lessonData.contentHinglish : lessonData.contentEn) || '';
          return {
            success: true,
            data: {
              ...lessonData,
              content: activeContent,
              contentMarkdown: activeContent
            }
          };
        }
      }
    } catch (e) {
      // fallback below
    }

    // Live Synchronized Dataset Fallback
    const store = getLocalCurriculumStore();
    const course = store.find((c) => c.slug === courseSlug || String(c.id) === String(courseSlug));
    if (course && course.modules) {
      for (const mod of course.modules) {
        const foundLesson = (mod.lessons || []).find((l) => l.slug === lessonSlug || String(l.id) === String(lessonSlug));
        if (foundLesson) {
          const activeContent = isHinglishRequested
            ? (foundLesson.contentHinglish || foundLesson.contentEn)
            : (foundLesson.contentEn || foundLesson.contentHinglish);

          return {
            success: true,
            data: {
              ...foundLesson,
              courseTitle: course.title,
              courseSlug: course.slug,
              moduleId: mod.id,
              moduleTitle: mod.title,
              content: activeContent,
              contentMarkdown: activeContent,
              contentEn: foundLesson.contentEn,
              contentHinglish: foundLesson.contentHinglish,
              activeLanguageServed: isHinglishRequested ? 'hinglish' : 'en'
            }
          };
        }
      }
    }

    return {
      success: false,
      status: 404,
      message: 'Lesson content not found.'
    };
  },

  /**
   * Fetch public quiz questions with randomized options
   * @param {string} courseSlug
   * @param {string} quizSlug
   * @param {string} [lang='en'] - 'en' or 'hinglish'
   */
  async getQuiz(courseSlug, quizSlug, lang = 'en') {
    const isHinglishRequested = lang === 'hinglish';

    try {
      const params = new URLSearchParams();
      if (lang) params.set('lang', lang);

      const res = await fetchWithTimeout(
        `${API_BASE}/courses/${encodeURIComponent(courseSlug)}/quizzes/${encodeURIComponent(quizSlug)}?${params.toString()}`,
        {
          headers: getAuthHeaders(false)
        },
        3000
      );

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return { success: true, data: json.data };
        }
      }
    } catch (e) {
      // fallback below
    }

    // Fallback from live dataset
    const store = getLocalCurriculumStore();
    const course = store.find((c) => c.slug === courseSlug || String(c.id) === String(courseSlug));
    if (course && course.modules) {
      for (const mod of course.modules) {
        const foundQuiz = (mod.quizzes || []).find((q) => q.slug === quizSlug || String(q.id) === String(quizSlug));
        if (foundQuiz) {
          const localizedQuestions = (foundQuiz.questions || []).map((q) => ({
            id: q.id,
            prompt: isHinglishRequested ? (q.promptHinglish || q.promptEn) : (q.promptEn || q.promptHinglish),
            codeContext: q.codeContext,
            options: (q.options || []).map((opt) => ({
              id: opt.id,
              text: isHinglishRequested ? (opt.text_hinglish || opt.text_en || opt.text) : (opt.text_en || opt.text_hinglish || opt.text)
            }))
          }));

          return {
            success: true,
            data: {
              ...foundQuiz,
              moduleTitle: mod.title,
              questions: localizedQuestions
            }
          };
        }
      }
    }

    return {
      success: false,
      status: 404,
      message: 'Quiz assessment not found.'
    };
  }
};

export default coursesApi;
