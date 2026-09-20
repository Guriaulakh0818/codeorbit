import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { studentLearningApi } from '../services/studentLearningApi';

const MASTER_COMPLETED_KEY = 'codeorbit_completed_lessons';
const MASTER_BOOKMARKS_KEY = 'codeorbit_bookmarked_lessons';
const GUEST_PROGRESS_KEY = 'codeorbit_guest_learning_progress';

// Retrieve all completed lesson IDs/slugs across master and legacy keys
const getStoredCompleted = () => {
  try {
    const items = new Set();

    // 1. Read master key
    const primary = localStorage.getItem(MASTER_COMPLETED_KEY);
    if (primary) {
      const arr = JSON.parse(primary);
      if (Array.isArray(arr)) arr.forEach((x) => items.add(x));
    }

    // 2. Scan legacy keys in localStorage for backward compatibility
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('codeorbit_student_progress_') || k === GUEST_PROGRESS_KEY)) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.completedLessonIds)) {
              parsed.completedLessonIds.forEach((x) => items.add(x));
            }
          }
        } catch (e) {}
      }
    }
    return Array.from(items);
  } catch (e) {
    return [];
  }
};

const getStoredBookmarks = () => {
  try {
    const items = new Set();
    const primary = localStorage.getItem(MASTER_BOOKMARKS_KEY);
    if (primary) {
      const arr = JSON.parse(primary);
      if (Array.isArray(arr)) arr.forEach((x) => items.add(x));
    }
    return Array.from(items);
  } catch (e) {
    return [];
  }
};

const saveStoredCompleted = (list, user) => {
  try {
    const json = JSON.stringify(list);
    localStorage.setItem(MASTER_COMPLETED_KEY, json);
    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify({ completedLessonIds: list }));
    if (user) {
      const userKey = `codeorbit_student_progress_${user.id || user.email || 'user'}`;
      localStorage.setItem(userKey, JSON.stringify({ completedLessonIds: list }));
    }
  } catch (e) {}
};

const saveStoredBookmarks = (list, user) => {
  try {
    const json = JSON.stringify(list);
    localStorage.setItem(MASTER_BOOKMARKS_KEY, json);
  } catch (e) {}
};

const LearningProgressContext = createContext(null);

export const LearningProgressProvider = ({ children }) => {
  const { user } = useAuth();

  const [completedLessonIds, setCompletedLessonIds] = useState(() => {
    return new Set(getStoredCompleted());
  });

  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState(() => {
    return new Set(getStoredBookmarks());
  });

  const [courseProgressMap, setCourseProgressMap] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  // Synchronize on mount or authentication change
  useEffect(() => {
    let isMounted = true;

    const initializeProgress = async () => {
      const initial = getStoredCompleted();
      const initialBookmarks = getStoredBookmarks();

      if (isMounted) {
        setCompletedLessonIds(new Set(initial));
        setBookmarkedLessonIds(new Set(initialBookmarks));
      }

      if (user) {
        setIsSyncing(true);
        try {
          const syncPayload = {
            completedLessonIds: initial.filter((x) => typeof x === 'number' || !isNaN(Number(x))).map(Number),
            bookmarkedLessonIds: initialBookmarks.filter((x) => typeof x === 'number' || !isNaN(Number(x))).map(Number)
          };

          const syncRes = await studentLearningApi.syncGuestProgress(syncPayload);
          if (syncRes.success && syncRes.data && isMounted) {
            const serverCompleted = syncRes.data.totalCompletedLessonIds || [];
            const serverBookmarked = syncRes.data.totalBookmarkedLessonIds || [];

            const mergedCompleted = Array.from(new Set([...initial, ...serverCompleted]));
            const mergedBookmarked = Array.from(new Set([...initialBookmarks, ...serverBookmarked]));

            setCompletedLessonIds(new Set(mergedCompleted));
            setBookmarkedLessonIds(new Set(mergedBookmarked));

            saveStoredCompleted(mergedCompleted, user);
            saveStoredBookmarks(mergedBookmarked, user);
          }
        } catch (e) {
          // If server call fails, local storage remains authoritative
        } finally {
          if (isMounted) setIsSyncing(false);
        }
      }
    };

    initializeProgress();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Check if a lesson is completed (checks number, string, or slug match)
  const isLessonCompleted = useCallback((lessonIdOrSlug) => {
    if (!lessonIdOrSlug && lessonIdOrSlug !== 0) return false;
    if (completedLessonIds.has(lessonIdOrSlug)) return true;
    
    const num = Number(lessonIdOrSlug);
    if (!isNaN(num)) {
      if (completedLessonIds.has(num) || completedLessonIds.has(String(num))) return true;
    }
    if (typeof lessonIdOrSlug === 'string') {
      if (completedLessonIds.has(lessonIdOrSlug)) return true;
      const parsedNum = Number(lessonIdOrSlug);
      if (!isNaN(parsedNum) && completedLessonIds.has(parsedNum)) return true;
    }
    return false;
  }, [completedLessonIds]);

  // Check if a lesson is bookmarked
  const isLessonBookmarked = useCallback((lessonIdOrSlug) => {
    if (!lessonIdOrSlug && lessonIdOrSlug !== 0) return false;
    if (bookmarkedLessonIds.has(lessonIdOrSlug)) return true;
    const num = Number(lessonIdOrSlug);
    if (!isNaN(num)) {
      if (bookmarkedLessonIds.has(num) || bookmarkedLessonIds.has(String(num))) return true;
    }
    if (typeof lessonIdOrSlug === 'string' && bookmarkedLessonIds.has(lessonIdOrSlug)) return true;
    return false;
  }, [bookmarkedLessonIds]);

  // Safe fallback for course bookmark checks
  const isCourseBookmarked = useCallback(() => {
    return false;
  }, []);

  // Mark lesson in progress (telemetry)
  const markLessonInProgress = useCallback(async (lessonId) => {
    if (!lessonId || !user) return;
    try {
      await studentLearningApi.markInProgress(Number(lessonId));
    } catch (e) {}
  }, [user]);

  // Fetch course-level authoritative progress
  const fetchCourseProgress = useCallback(async (courseSlug) => {
    if (!courseSlug || !user) return null;
    try {
      const res = await studentLearningApi.getCourseProgress(courseSlug);
      if (res.success && res.data) {
        setCourseProgressMap((prev) => ({
          ...prev,
          [courseSlug]: res.data
        }));

        if (Array.isArray(res.data.completedLessonIds)) {
          setCompletedLessonIds((prev) => {
            const next = new Set([...prev, ...res.data.completedLessonIds]);
            saveStoredCompleted(Array.from(next), user);
            return next;
          });
        }
        return res.data;
      }
    } catch (e) {}
    return null;
  }, [user]);

  // Synchronous, atomic toggle function supporting both ID and Slug
  const toggleLessonCompletion = useCallback(async (lessonIdOrSlugOrObj, courseSlug = null, extraSlug = null) => {
    if (!lessonIdOrSlugOrObj && lessonIdOrSlugOrObj !== 0) return false;

    // Collect all candidate keys (number ID, string ID, slug)
    const candidates = [];
    if (typeof lessonIdOrSlugOrObj === 'object' && lessonIdOrSlugOrObj !== null) {
      if (lessonIdOrSlugOrObj.id !== undefined && lessonIdOrSlugOrObj.id !== null) {
        candidates.push(lessonIdOrSlugOrObj.id, Number(lessonIdOrSlugOrObj.id), String(lessonIdOrSlugOrObj.id));
      }
      if (lessonIdOrSlugOrObj.slug) {
        candidates.push(lessonIdOrSlugOrObj.slug);
      }
    } else {
      candidates.push(lessonIdOrSlugOrObj);
      const num = Number(lessonIdOrSlugOrObj);
      if (!isNaN(num)) {
        candidates.push(num, String(num));
      } else if (typeof lessonIdOrSlugOrObj === 'string') {
        candidates.push(lessonIdOrSlugOrObj);
      }
    }
    if (extraSlug && typeof extraSlug === 'string') {
      candidates.push(extraSlug);
    }

    const uniqueCandidates = Array.from(new Set(candidates.filter((c) => c !== undefined && c !== null && c !== '')));

    let isNowCompleted = false;

    setCompletedLessonIds((prev) => {
      const isCurrentlyDone = uniqueCandidates.some((c) => prev.has(c));
      isNowCompleted = !isCurrentlyDone;

      const next = new Set(prev);
      if (isNowCompleted) {
        uniqueCandidates.forEach((c) => next.add(c));
      } else {
        uniqueCandidates.forEach((c) => next.delete(c));
      }

      const list = Array.from(next);
      saveStoredCompleted(list, user);
      return next;
    });

    // Server background sync if authenticated
    const numId = uniqueCandidates.find((c) => typeof c === 'number' && !isNaN(c));
    if (user && numId) {
      try {
        if (isNowCompleted) {
          await studentLearningApi.markCompleted(numId);
        }
        if (courseSlug) {
          fetchCourseProgress(courseSlug);
        }
      } catch (e) {}
    }

    return isNowCompleted;
  }, [user, fetchCourseProgress]);

  // Mark completed alias
  const markLessonCompleted = useCallback(async (lessonIdOrSlug, courseSlug = null, extraSlug = null) => {
    return toggleLessonCompletion(lessonIdOrSlug, courseSlug, extraSlug);
  }, [toggleLessonCompletion]);

  // Toggle bookmark (persisted locally & on server)
  const toggleLessonBookmark = useCallback(async (lessonIdOrSlug) => {
    if (!lessonIdOrSlug && lessonIdOrSlug !== 0) return false;
    const num = Number(lessonIdOrSlug);
    const identifier = !isNaN(num) ? num : String(lessonIdOrSlug);

    let isNowBookmarked = false;

    setBookmarkedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(identifier)) {
        next.delete(identifier);
        isNowBookmarked = false;
      } else {
        next.add(identifier);
        isNowBookmarked = true;
      }

      const list = Array.from(next);
      saveStoredBookmarks(list, user);
      return next;
    });

    if (user && typeof identifier === 'number') {
      try {
        await studentLearningApi.toggleBookmark(identifier);
      } catch (e) {}
    }

    return isNowBookmarked;
  }, [user]);

  // Format progress for dashboard consumers
  const progress = useMemo(() => ({
    completedLessonIds: Array.from(completedLessonIds),
    bookmarkedLessonIds: Array.from(bookmarkedLessonIds),
    passedQuizIds: []
  }), [completedLessonIds, bookmarkedLessonIds]);

  return (
    <LearningProgressContext.Provider
      value={{
        completedLessonIds: Array.from(completedLessonIds),
        bookmarkedLessonIds: Array.from(bookmarkedLessonIds),
        courseProgressMap,
        isSyncing,
        isLessonCompleted,
        isLessonBookmarked,
        isCourseBookmarked,
        markLessonInProgress,
        toggleLessonCompletion,
        markLessonCompleted,
        toggleLessonBookmark,
        fetchCourseProgress,
        progress
      }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
};

export const useLearningProgress = () => {
  const context = useContext(LearningProgressContext);
  if (!context) {
    return {
      completedLessonIds: [],
      bookmarkedLessonIds: [],
      courseProgressMap: {},
      isSyncing: false,
      isLessonCompleted: () => false,
      isLessonBookmarked: () => false,
      isCourseBookmarked: () => false,
      markLessonInProgress: async () => {},
      toggleLessonCompletion: async () => false,
      markLessonCompleted: async () => false,
      toggleLessonBookmark: async () => false,
      fetchCourseProgress: async () => null,
      progress: { completedLessonIds: [], bookmarkedLessonIds: [], passedQuizIds: [] }
    };
  }
  return context;
};

export default LearningProgressContext;
