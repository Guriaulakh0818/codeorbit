import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { studentLearningApi } from '../services/studentLearningApi';

const GUEST_PROGRESS_KEY = 'codeorbit_guest_learning_progress';

const LearningProgressContext = createContext(null);

const getStoredGuestProgress = () => {
  try {
    const raw = localStorage.getItem(GUEST_PROGRESS_KEY);
    if (!raw) return { completedLessonIds: [], bookmarkedLessonIds: [] };
    const parsed = JSON.parse(raw);
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
      bookmarkedLessonIds: Array.isArray(parsed.bookmarkedLessonIds) ? parsed.bookmarkedLessonIds : []
    };
  } catch (e) {
    return { completedLessonIds: [], bookmarkedLessonIds: [] };
  }
};

const saveStoredGuestProgress = (data) => {
  try {
    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    // Ignore storage errors
  }
};

export const LearningProgressProvider = ({ children }) => {
  const { user } = useAuth();

  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState(new Set());
  const [courseProgressMap, setCourseProgressMap] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  // Synchronize on authentication change or load guest progress
  useEffect(() => {
    let isMounted = true;

    const initializeProgress = async () => {
      setCourseProgressMap({});

      if (user) {
        setCompletedLessonIds(new Set());
        setBookmarkedLessonIds(new Set());

        const guestData = getStoredGuestProgress();
        const hasPendingGuestData = 
          guestData.completedLessonIds.length > 0 || guestData.bookmarkedLessonIds.length > 0;

        if (hasPendingGuestData) {
          setIsSyncing(true);
          try {
            const syncRes = await studentLearningApi.syncGuestProgress(guestData);
            if (syncRes.success && syncRes.data && isMounted) {
              setCompletedLessonIds(new Set(syncRes.data.totalCompletedLessonIds || []));
              setBookmarkedLessonIds(new Set(syncRes.data.totalBookmarkedLessonIds || []));
              localStorage.removeItem(GUEST_PROGRESS_KEY);
            }
          } catch (e) {
            // Keep guest data in localStorage
          } finally {
            if (isMounted) setIsSyncing(false);
          }
        }
      } else {
        const guest = getStoredGuestProgress();
        if (isMounted) {
          setCompletedLessonIds(new Set(guest.completedLessonIds));
          setBookmarkedLessonIds(new Set(guest.bookmarkedLessonIds));
        }
      }
    };

    initializeProgress();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Check if a lesson is completed
  const isLessonCompleted = useCallback((lessonId) => {
    if (!lessonId) return false;
    return completedLessonIds.has(Number(lessonId));
  }, [completedLessonIds]);

  // Check if a lesson is bookmarked
  const isLessonBookmarked = useCallback((lessonId) => {
    if (!lessonId) return false;
    return bookmarkedLessonIds.has(Number(lessonId));
  }, [bookmarkedLessonIds]);

  // Safe fallback for course bookmark checks
  const isCourseBookmarked = useCallback((courseId) => {
    return false;
  }, []);

  // Mark lesson in progress
  const markLessonInProgress = useCallback(async (lessonId) => {
    if (!lessonId || !user) return;
    try {
      await studentLearningApi.markInProgress(Number(lessonId));
    } catch (e) {
      // Non-blocking telemetry
    }
  }, [user]);

  // Mark lesson completed
  const markLessonCompleted = useCallback(async (lessonId, courseSlug = null) => {
    if (!lessonId) return false;
    const numId = Number(lessonId);

    if (user) {
      const res = await studentLearningApi.markCompleted(numId);
      if (res.success) {
        setCompletedLessonIds((prev) => new Set([...prev, numId]));
        if (courseSlug) {
          fetchCourseProgress(courseSlug);
        }
        return true;
      }
      return false;
    } else {
      const current = getStoredGuestProgress();
      if (!current.completedLessonIds.includes(numId)) {
        current.completedLessonIds.push(numId);
        saveStoredGuestProgress(current);
      }
      setCompletedLessonIds((prev) => new Set([...prev, numId]));
      return true;
    }
  }, [user]);

  // Toggle completion alias
  const toggleLessonCompletion = useCallback(async (lessonId, courseSlug = null) => {
    return markLessonCompleted(lessonId, courseSlug);
  }, [markLessonCompleted]);

  // Toggle bookmark
  const toggleLessonBookmark = useCallback(async (lessonId) => {
    if (!lessonId) return false;
    const numId = Number(lessonId);

    if (user) {
      const res = await studentLearningApi.toggleBookmark(numId);
      if (res.success) {
        setBookmarkedLessonIds((prev) => {
          const next = new Set(prev);
          if (res.isBookmarked) {
            next.add(numId);
          } else {
            next.delete(numId);
          }
          return next;
        });
        return res.isBookmarked;
      }
      return false;
    } else {
      const current = getStoredGuestProgress();
      let nowBookmarked = false;
      if (current.bookmarkedLessonIds.includes(numId)) {
        current.bookmarkedLessonIds = current.bookmarkedLessonIds.filter((id) => id !== numId);
        nowBookmarked = false;
      } else {
        current.bookmarkedLessonIds.push(numId);
        nowBookmarked = true;
      }
      saveStoredGuestProgress(current);
      setBookmarkedLessonIds((prev) => {
        const next = new Set(prev);
        if (nowBookmarked) next.add(numId);
        else next.delete(numId);
        return next;
      });
      return nowBookmarked;
    }
  }, [user]);

  const toggleCourseBookmark = useCallback(async () => {
    return false;
  }, []);

  // Fetch course-level authoritative progress
  const fetchCourseProgress = useCallback(async (courseSlug) => {
    if (!courseSlug || !user) return null;
    const res = await studentLearningApi.getCourseProgress(courseSlug);
    if (res.success && res.data) {
      setCourseProgressMap((prev) => ({
        ...prev,
        [courseSlug]: res.data
      }));

      if (Array.isArray(res.data.completedLessonIds)) {
        setCompletedLessonIds((prev) => new Set([...prev, ...res.data.completedLessonIds]));
      }
      if (Array.isArray(res.data.bookmarkedLessonIds)) {
        setBookmarkedLessonIds((prev) => new Set([...prev, ...res.data.bookmarkedLessonIds]));
      }
      return res.data;
    }
    return null;
  }, [user]);

  // Backward compatibility object for legacy components
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
        markLessonCompleted,
        toggleLessonCompletion,
        toggleLessonBookmark,
        toggleCourseBookmark,
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
      markLessonCompleted: async () => {},
      toggleLessonCompletion: async () => {},
      toggleLessonBookmark: async () => {},
      toggleCourseBookmark: async () => {},
      fetchCourseProgress: async () => null,
      progress: { completedLessonIds: [], bookmarkedLessonIds: [], passedQuizIds: [] }
    };
  }
  return context;
};

export default LearningProgressContext;
