package com.codeorbit.service;

import com.codeorbit.dto.StudentDashboardSummaryDto;
import com.codeorbit.dto.StudentEnrollmentDto;
import com.codeorbit.security.UserPrincipal;

public interface StudentEnrollmentService {

    StudentEnrollmentDto enrollInCourse(UserPrincipal principal, String courseSlug);

    boolean isEnrolled(Long userId, Long courseId);

    boolean isStudentEnrolled(UserPrincipal principal, String courseSlug);

    StudentEnrollmentDto getEnrollmentStatus(UserPrincipal principal, String courseSlug);

    StudentDashboardSummaryDto getStudentDashboardSummary(UserPrincipal principal);
}
