package com.codeorbit.service;

import com.codeorbit.dto.QuizPublicDto;
import com.codeorbit.dto.QuizSubmissionRequestDto;
import com.codeorbit.dto.QuizSubmissionResultDto;
import com.codeorbit.security.UserPrincipal;

import java.util.List;

public interface QuizService {

    QuizPublicDto getPublicQuizByCourseAndSlug(String courseSlug, String quizSlug, String language);

    QuizSubmissionResultDto submitQuizAttempt(UserPrincipal principal, Long quizId, QuizSubmissionRequestDto request);

    List<QuizSubmissionResultDto> getStudentQuizAttempts(UserPrincipal principal, Long quizId);
}
