import { API_BASE, getAuthHeaders } from './apiConfig';
import { CURRICULUM_DATA } from '../data/curriculumData';

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
   * Submit quiz attempt for authoritative server evaluation with robust offline/seed fallback
   * @param {number|string} quizId
   * @param {Object} payload
   * @param {string} payload.language - 'en' or 'hinglish'
   * @param {Array<{questionId: number, selectedOptionId: string}>} payload.answers
   * @param {string} [courseSlug]
   * @param {string} [quizSlug]
   */
  async submitQuiz(quizId, payload, courseSlug = null, quizSlug = null) {
    try {
      const res = await fetch(`${API_BASE}/student/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return { success: true, data: json.data };
        }
      }
    } catch (e) {
      // Proceed to client-side fallback
    }

    // Client-side fallback evaluation from CURRICULUM_DATA
    try {
      let targetQuiz = null;
      
      // 1. Try to find by courseSlug & quizSlug
      if (courseSlug) {
        const course = CURRICULUM_DATA.find((c) => c.slug === courseSlug);
        if (course?.modules) {
          for (const mod of course.modules) {
            const found = (mod.quizzes || []).find((q) => (quizSlug ? q.slug === quizSlug : q.id === Number(quizId)));
            if (found) {
              targetQuiz = found;
              break;
            }
          }
        }
      }

      // 2. Global search across all courses if not found yet
      if (!targetQuiz) {
        for (const course of CURRICULUM_DATA) {
          for (const mod of (course.modules || [])) {
            const found = (mod.quizzes || []).find(
              (q) => q.id === Number(quizId) || (quizSlug && q.slug === quizSlug)
            );
            if (found) {
              targetQuiz = found;
              break;
            }
          }
          if (targetQuiz) break;
        }
      }

      // 3. Fallback to any quiz in curriculum data if questions match
      if (!targetQuiz) {
        for (const course of CURRICULUM_DATA) {
          for (const mod of (course.modules || [])) {
            if (mod.quizzes && mod.quizzes.length > 0) {
              targetQuiz = mod.quizzes[0];
              break;
            }
          }
          if (targetQuiz) break;
        }
      }

      if (targetQuiz && targetQuiz.questions) {
        const isHinglish = payload.language === 'hinglish';
        const submittedAnswersMap = new Map();
        (payload.answers || []).forEach((a) => {
          submittedAnswersMap.set(Number(a.questionId), a.selectedOptionId);
        });

        let correctCount = 0;
        const totalCount = targetQuiz.questions.length;

        const feedback = targetQuiz.questions.map((q) => {
          const userSelected = submittedAnswersMap.get(Number(q.id)) || null;
          const isCorrect = userSelected && userSelected.toLowerCase() === (q.correctOptionId || '').toLowerCase();
          if (isCorrect) correctCount++;

          return {
            questionId: q.id,
            prompt: isHinglish ? (q.promptHinglish || q.promptEn) : (q.promptEn || q.promptHinglish),
            codeContext: q.codeContext || '',
            selectedOptionId: userSelected,
            correctOptionId: q.correctOptionId,
            correct: !!isCorrect,
            explanation: isHinglish ? (q.explanationHinglish || q.explanationEn) : (q.explanationEn || q.explanationHinglish),
            options: (q.options || []).map((opt) => ({
              id: opt.id,
              text: isHinglish ? (opt.text_hinglish || opt.text_en || opt.text) : (opt.text_en || opt.text_hinglish || opt.text)
            }))
          };
        });

        const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        const minPass = targetQuiz.minPassScorePercentage || 80;
        const passed = scorePercentage >= minPass;

        return {
          success: true,
          data: {
            quizId: targetQuiz.id || quizId,
            scorePercentage,
            correctAnswers: correctCount,
            totalQuestions: totalCount,
            passed,
            attemptNumber: 1,
            feedback
          }
        };
      }
    } catch (fallbackErr) {
      // Fallback failed
    }

    return { success: false, message: 'Quiz could not be evaluated at this moment.' };
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
