package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.service.CourseService;
import com.codeorbit.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final QuizService quizService;

    public CourseController(CourseService courseService, QuizService quizService) {
        this.courseService = courseService;
        this.quizService = quizService;
    }

    /**
     * GET /api/courses
     * Public course catalog browsing with optional track filter, keyword search, and pagination.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponseDto<CourseSummaryDto>>> getPublishedCourses(
            @RequestParam(required = false) String track,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponseDto<CourseSummaryDto> response = courseService.getPublishedCourses(track, search, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/courses/{slug}
     * Public course detail and syllabus tree with modules and lessons.
     */
    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CourseDetailDto>> getCourseDetail(@PathVariable String slug) {
        CourseDetailDto detail = courseService.getCourseDetailBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    /**
     * GET /api/courses/{slug}/lessons/{lessonSlug}
     * Public lesson player endpoint supporting bilingual content with explicit English fallback.
     */
    @GetMapping("/{slug}/lessons/{lessonSlug}")
    public ResponseEntity<ApiResponse<LessonPublicDto>> getLessonDetail(
            @PathVariable String slug,
            @PathVariable String lessonSlug,
            @RequestParam(defaultValue = "en") String lang
    ) {
        LessonPublicDto lesson = courseService.getLessonByCourseAndSlug(slug, lessonSlug, lang);
        return ResponseEntity.ok(ApiResponse.success(lesson));
    }

    /**
     * GET /api/courses/{slug}/quizzes/{quizSlug}
     * Public quiz endpoint with randomized options and stripped answer keys.
     */
    @GetMapping("/{slug}/quizzes/{quizSlug}")
    public ResponseEntity<ApiResponse<QuizPublicDto>> getPublicQuiz(
            @PathVariable String slug,
            @PathVariable String quizSlug,
            @RequestParam(defaultValue = "en") String lang
    ) {
        QuizPublicDto quiz = quizService.getPublicQuizByCourseAndSlug(slug, quizSlug, lang);
        return ResponseEntity.ok(ApiResponse.success(quiz));
    }
}
