package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.entity.PublishStatus;
import com.codeorbit.service.AdminCurriculumService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/curriculum")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCurriculumController {

    private final AdminCurriculumService curriculumService;

    public AdminCurriculumController(AdminCurriculumService curriculumService) {
        this.curriculumService = curriculumService;
    }

    // ==========================================
    // COURSES
    // ==========================================

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<PagedResponseDto<CourseSummaryDto>>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String track,
            @RequestParam(required = false) PublishStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderIndex") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PagedResponseDto<CourseSummaryDto> response = curriculumService.getAllAdminCourses(search, track, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<AdminCourseDetailDto>> getCourseById(@PathVariable Long id) {
        AdminCourseDetailDto response = curriculumService.getAdminCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<AdminCourseDetailDto>> createCourse(@Valid @RequestBody AdminCourseRequestDto request) {
        AdminCourseDetailDto response = curriculumService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created successfully", response));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<AdminCourseDetailDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody AdminCourseRequestDto request
    ) {
        AdminCourseDetailDto response = curriculumService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", response));
    }

    @PatchMapping("/courses/{id}/status")
    public ResponseEntity<ApiResponse<AdminCourseDetailDto>> updateCourseStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        PublishStatus status = PublishStatus.valueOf(payload.get("status").toUpperCase());
        AdminCourseDetailDto response = curriculumService.updateCourseStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Course status updated to " + status, response));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        curriculumService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }

    // ==========================================
    // MODULES
    // ==========================================

    @PostMapping("/courses/{courseId}/modules")
    public ResponseEntity<ApiResponse<AdminModuleDetailDto>> createModule(
            @PathVariable Long courseId,
            @Valid @RequestBody AdminModuleRequestDto request
    ) {
        AdminModuleDetailDto response = curriculumService.createModule(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Module created successfully", response));
    }

    @PutMapping("/modules/{moduleId}")
    public ResponseEntity<ApiResponse<AdminModuleDetailDto>> updateModule(
            @PathVariable Long moduleId,
            @Valid @RequestBody AdminModuleRequestDto request
    ) {
        AdminModuleDetailDto response = curriculumService.updateModule(moduleId, request);
        return ResponseEntity.ok(ApiResponse.success("Module updated successfully", response));
    }

    @PatchMapping("/modules/{moduleId}/status")
    public ResponseEntity<ApiResponse<AdminModuleDetailDto>> updateModuleStatus(
            @PathVariable Long moduleId,
            @RequestBody Map<String, String> payload
    ) {
        PublishStatus status = PublishStatus.valueOf(payload.get("status").toUpperCase());
        AdminModuleDetailDto response = curriculumService.updateModuleStatus(moduleId, status);
        return ResponseEntity.ok(ApiResponse.success("Module status updated to " + status, response));
    }

    @DeleteMapping("/modules/{moduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteModule(@PathVariable Long moduleId) {
        curriculumService.deleteModule(moduleId);
        return ResponseEntity.ok(ApiResponse.success("Module deleted successfully", null));
    }

    // ==========================================
    // LESSONS
    // ==========================================

    @GetMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse<AdminLessonDetailDto>> getLessonById(@PathVariable Long id) {
        AdminLessonDetailDto response = curriculumService.getLessonById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/modules/{moduleId}/lessons")
    public ResponseEntity<ApiResponse<AdminLessonDetailDto>> createLesson(
            @PathVariable Long moduleId,
            @Valid @RequestBody AdminLessonRequestDto request
    ) {
        AdminLessonDetailDto response = curriculumService.createLesson(moduleId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lesson created successfully", response));
    }

    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<AdminLessonDetailDto>> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody AdminLessonRequestDto request
    ) {
        AdminLessonDetailDto response = curriculumService.updateLesson(lessonId, request);
        return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", response));
    }

    @PatchMapping("/lessons/{lessonId}/status")
    public ResponseEntity<ApiResponse<AdminLessonDetailDto>> updateLessonStatus(
            @PathVariable Long lessonId,
            @RequestBody Map<String, String> payload
    ) {
        PublishStatus status = PublishStatus.valueOf(payload.get("status").toUpperCase());
        AdminLessonDetailDto response = curriculumService.updateLessonStatus(lessonId, status);
        return ResponseEntity.ok(ApiResponse.success("Lesson status updated to " + status, response));
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long lessonId) {
        curriculumService.deleteLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted successfully", null));
    }

    // ==========================================
    // QUIZZES & QUESTIONS
    // ==========================================

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<ApiResponse<AdminQuizDetailDto>> getQuizById(@PathVariable Long id) {
        AdminQuizDetailDto response = curriculumService.getQuizById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/modules/{moduleId}/quizzes")
    public ResponseEntity<ApiResponse<AdminQuizDetailDto>> createQuiz(
            @PathVariable Long moduleId,
            @Valid @RequestBody AdminQuizRequestDto request
    ) {
        AdminQuizDetailDto response = curriculumService.createQuiz(moduleId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quiz created successfully", response));
    }

    @PutMapping("/quizzes/{quizId}")
    public ResponseEntity<ApiResponse<AdminQuizDetailDto>> updateQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody AdminQuizRequestDto request
    ) {
        AdminQuizDetailDto response = curriculumService.updateQuiz(quizId, request);
        return ResponseEntity.ok(ApiResponse.success("Quiz updated successfully", response));
    }

    @PatchMapping("/quizzes/{quizId}/status")
    public ResponseEntity<ApiResponse<AdminQuizDetailDto>> updateQuizStatus(
            @PathVariable Long quizId,
            @RequestBody Map<String, String> payload
    ) {
        PublishStatus status = PublishStatus.valueOf(payload.get("status").toUpperCase());
        AdminQuizDetailDto response = curriculumService.updateQuizStatus(quizId, status);
        return ResponseEntity.ok(ApiResponse.success("Quiz status updated to " + status, response));
    }

    @DeleteMapping("/quizzes/{quizId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(@PathVariable Long quizId) {
        curriculumService.deleteQuiz(quizId);
        return ResponseEntity.ok(ApiResponse.success("Quiz deleted successfully", null));
    }

    @PostMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<ApiResponse<AdminQuestionDetailDto>> addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody AdminQuizQuestionRequestDto request
    ) {
        AdminQuestionDetailDto response = curriculumService.addQuestion(quizId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Question added successfully", response));
    }

    @PutMapping("/questions/{questionId}")
    public ResponseEntity<ApiResponse<AdminQuestionDetailDto>> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody AdminQuizQuestionRequestDto request
    ) {
        AdminQuestionDetailDto response = curriculumService.updateQuestion(questionId, request);
        return ResponseEntity.ok(ApiResponse.success("Question updated successfully", response));
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long questionId) {
        curriculumService.deleteQuestion(questionId);
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully", null));
    }
}
