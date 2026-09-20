import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
      // Clear previous user's in-memory progress map to prevent account leakage
      setCourseProgressMap({});

      if (user) {
        setCompletedLessonIds(new Set());
        setBookmarkedLessonIds(new Set());

        // Authenticated user: Check if there is pending guest progress to merge
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
              // Guest data cleared only after verified server reconciliation
              localStorage.removeItem(GUEST_PROGRESS_KEY);
            }
          } catch (e) {
            // Keep guest data in localStorage so sync can retry on next connection
          } finally {
            if (isMounted) setIsSyncing(false);
          }
        }
      } else {
        // Guest user: Load from localStorage
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
      // Authenticated: Authoritative server update
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
      // Guest: Store in localStorage
      const current = getStoredGuestProgress();
      if (!current.completedLessonIds.includes(numId)) {
        current.completedLessonIds.push(numId);
        saveStoredGuestProgress(current);
      }
      setCompletedLessonIds((prev) => new Set([...prev, numId]));
      return true;
    }
  }, [user]);

  // Toggle bookmark
  const toggleLessonBookmark = useCallback(async (lessonId) => {
    if (!lessonId) return false;
    const numId = Number(lessonId);

    if (user) {
      // Authenticated: Server update
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
      // Guest: Local update
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

  // Fetch course-level authoritative progress
  const fetchCourseProgress = useCallback(async (courseSlug) => {
    if (!courseSlug || !user) return null;
    const res = await studentLearningApi.getCourseProgress(courseSlug);
    if (res.success && res.data) {
      setCourseProgressMap((prev) => ({
        ...prev,
        [courseSlug]: res.data
      }));

      // Update completed and bookmarked sets with authoritative server lists
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

  return (
    <LearningProgressContext.Provider
      value={{
        completedLessonIds,
        bookmarkedLessonIds,
        courseProgressMap,
        isSyncing,
        isLessonCompleted,
        isLessonBookmarked,
        markLessonInProgress,
        markLessonCompleted,
        toggleLessonBookmark,
        fetchCourseProgress
      }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
};

export const useLearningProgress = () => {
  const context = useContext(LearningProgressContext);
  if (!context) {
    throw new Error('useLearningProgress must be used within a LearningProgressProvider');
  }
  return context;
};
