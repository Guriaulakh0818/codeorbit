package com.codeorbit.service;

import com.codeorbit.dto.*;
import com.codeorbit.entity.PublishStatus;
import org.springframework.data.domain.Pageable;

public interface AdminCurriculumService {

    // Courses
    PagedResponseDto<CourseSummaryDto> getAllAdminCourses(String search, String track, PublishStatus status, Pageable pageable);
    AdminCourseDetailDto getAdminCourseById(Long courseId);
    AdminCourseDetailDto createCourse(AdminCourseRequestDto request);
    AdminCourseDetailDto updateCourse(Long courseId, AdminCourseRequestDto request);
    AdminCourseDetailDto updateCourseStatus(Long courseId, PublishStatus status);
    void deleteCourse(Long courseId);

    // Modules
    AdminModuleDetailDto createModule(Long courseId, AdminModuleRequestDto request);
    AdminModuleDetailDto updateModule(Long moduleId, AdminModuleRequestDto request);
    AdminModuleDetailDto updateModuleStatus(Long moduleId, PublishStatus status);
    void deleteModule(Long moduleId);

    // Lessons
    AdminLessonDetailDto getLessonById(Long lessonId);
    AdminLessonDetailDto createLesson(Long moduleId, AdminLessonRequestDto request);
    AdminLessonDetailDto updateLesson(Long lessonId, AdminLessonRequestDto request);
    AdminLessonDetailDto updateLessonStatus(Long lessonId, PublishStatus status);
    void deleteLesson(Long lessonId);

    // Quizzes & Questions
    AdminQuizDetailDto getQuizById(Long quizId);
    AdminQuizDetailDto createQuiz(Long moduleId, AdminQuizRequestDto request);
    AdminQuizDetailDto updateQuiz(Long quizId, AdminQuizRequestDto request);
    AdminQuizDetailDto updateQuizStatus(Long quizId, PublishStatus status);
    void deleteQuiz(Long quizId);

    AdminQuestionDetailDto addQuestion(Long quizId, AdminQuizQuestionRequestDto request);
    AdminQuestionDetailDto updateQuestion(Long questionId, AdminQuizQuestionRequestDto request);
    void deleteQuestion(Long questionId);
}
