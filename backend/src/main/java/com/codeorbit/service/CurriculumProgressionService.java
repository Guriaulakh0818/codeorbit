package com.codeorbit.service;

import com.codeorbit.entity.CourseModule;
import com.codeorbit.entity.Quiz;

public interface CurriculumProgressionService {

    boolean isModuleUnlocked(Long userId, CourseModule module);

    boolean isQuizUnlocked(Long userId, Quiz quiz);

    boolean isEligibleForCertificate(Long userId, Long courseId);

    int getPassedModuleQuizCount(Long userId, Long courseId);

    int getPassedFinalQuizCount(Long userId, Long courseId);

    void validateModuleAccess(Long userId, CourseModule module);

    void validateQuizAccess(Long userId, Quiz quiz);

    boolean hasPlacementReadyAccess(Long userId, Long courseId);
}
