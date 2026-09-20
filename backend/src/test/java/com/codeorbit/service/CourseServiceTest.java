package com.codeorbit.service;

import com.codeorbit.dto.CourseSummaryDto;
import com.codeorbit.dto.LessonPublicDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.impl.CourseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseModuleRepository moduleRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizQuestionRepository questionRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    private Course course;
    private CourseModule module;
    private Lesson lesson;

    @BeforeEach
    void setUp() {
        course = new Course("DSA Track", "dsa", "Master DSA", "Short", "DSA", "BEGINNER", 35, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        module = new CourseModule(course, "Module 1", "mod-1", "Desc", 1, PublishStatus.PUBLISHED);
        module.setId(10L);

        lesson = new Lesson(module, "Intro to Big-O", "intro-big-o", 15, 1, PublishStatus.PUBLISHED,
                "# English Content", "# Hinglish Content", HinglishStatus.PUBLISHED);
        lesson.setId(100L);
    }

    @Test
    @DisplayName("getPublishedCourses - Returns paginated published course list")
    void testGetPublishedCourses() {
        when(courseRepository.findCoursesByFilter(eq(PublishStatus.PUBLISHED), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of(course), PageRequest.of(0, 10), 1));
        when(moduleRepository.findByCourseIdAndStatusOrderByOrderIndexAsc(1L, PublishStatus.PUBLISHED))
                .thenReturn(List.of(module));
        when(lessonRepository.countPublishedLessonsByCourseId(1L)).thenReturn(1L);
        when(lessonRepository.findPublishedLessonsByCourseId(1L)).thenReturn(List.of(lesson));

        PagedResponseDto<CourseSummaryDto> result = courseService.getPublishedCourses(null, null, 0, 10);
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("dsa", result.getContent().get(0).getSlug());
        assertTrue(result.getContent().get(0).isHasHinglish());
    }

    @Test
    @DisplayName("getLessonByCourseAndSlug - Returns Hinglish when requested and published")
    void testGetLessonHinglish() {
        when(lessonRepository.findByCourseSlugAndLessonSlugAndStatus("dsa", "intro-big-o", PublishStatus.PUBLISHED))
                .thenReturn(Optional.of(lesson));
        when(lessonRepository.findPublishedLessonsByCourseId(1L)).thenReturn(List.of(lesson));

        LessonPublicDto result = courseService.getLessonByCourseAndSlug("dsa", "intro-big-o", "hinglish");
        assertNotNull(result);
        assertEquals("# Hinglish Content", result.getContent());
        assertEquals("hinglish", result.getActiveLanguageServed());
        assertFalse(result.isFallback());
    }

    @Test
    @DisplayName("getLessonByCourseAndSlug - Gracefully falls back to English when Hinglish is missing")
    void testGetLessonFallbackToEnglish() {
        lesson.setHinglishStatus(HinglishStatus.MISSING);
        lesson.setContentHinglish(null);

        when(lessonRepository.findByCourseSlugAndLessonSlugAndStatus("dsa", "intro-big-o", PublishStatus.PUBLISHED))
                .thenReturn(Optional.of(lesson));
        when(lessonRepository.findPublishedLessonsByCourseId(1L)).thenReturn(List.of(lesson));

        LessonPublicDto result = courseService.getLessonByCourseAndSlug("dsa", "intro-big-o", "hinglish");
        assertNotNull(result);
        assertEquals("# English Content", result.getContent());
        assertEquals("en", result.getActiveLanguageServed());
        assertTrue(result.isFallback());
    }
}
