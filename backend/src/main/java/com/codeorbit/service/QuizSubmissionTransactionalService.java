package com.codeorbit.service;

import com.codeorbit.dto.QuizSubmissionRequestDto;
import com.codeorbit.dto.QuizSubmissionResultDto;

public interface QuizSubmissionTransactionalService {

    QuizSubmissionResultDto executeSubmissionInNewTransaction(Long userId, Long quizId, QuizSubmissionRequestDto request);
}
