package com.codeorbit.service;

import com.codeorbit.dto.GuestProgressSyncRequestDto;
import com.codeorbit.dto.GuestProgressSyncResponseDto;
import com.codeorbit.dto.UserProgressDto;
import com.codeorbit.security.UserPrincipal;

public interface LessonProgressService {

    void markLessonInProgress(UserPrincipal principal, Long lessonId);

    void markLessonCompleted(UserPrincipal principal, Long lessonId);

    boolean toggleLessonBookmark(UserPrincipal principal, Long lessonId);

    UserProgressDto getStudentCourseProgress(UserPrincipal principal, String courseSlug);

    GuestProgressSyncResponseDto syncGuestProgress(UserPrincipal principal, GuestProgressSyncRequestDto request);
}
