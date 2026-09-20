package com.codeorbit.controller;

import com.codeorbit.dto.CourseSummaryDto;
import com.codeorbit.dto.LessonPublicDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.dto.QuizPublicDto;
import com.codeorbit.dto.QuizQuestionOptionDto;
import com.codeorbit.dto.QuizQuestionPublicDto;
import com.codeorbit.service.CourseService;
import com.codeorbit.service.QuizService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @MockBean
    private QuizService quizService;

    @Test
    @DisplayName("GET /api/courses - Public access should return published courses")
    void testGetPublishedCourses() throws Exception {
        CourseSummaryDto course = new CourseSummaryDto();
        course.setId(1L);
        course.setTitle("Data Structures & Algorithms");
        course.setSlug("dsa");
        course.setTrack("DSA");

        PagedResponseDto<CourseSummaryDto> paged = new PagedResponseDto<>(List.of(course), 0, 10, 1L, 1, true);
        when(courseService.getPublishedCourses(any(), any(), anyInt(), anyInt())).thenReturn(paged);

        mockMvc.perform(get("/api/courses").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].slug").value("dsa"));
    }

    @Test
    @DisplayName("GET /api/courses/{slug}/lessons/{lessonSlug} - Public access returns bilingual content and fallback info")
    void testGetLessonDetail() throws Exception {
        LessonPublicDto lesson = new LessonPublicDto();
        lesson.setId(10L);
        lesson.setTitle("Two Pointers");
        lesson.setSlug("two-pointers");
        lesson.setContent("English text");
        lesson.setActiveLanguageServed("en");
        lesson.setFallback(false);

        when(courseService.getLessonByCourseAndSlug(eq("dsa"), eq("two-pointers"), anyString())).thenReturn(lesson);

        mockMvc.perform(get("/api/courses/dsa/lessons/two-pointers?lang=en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Two Pointers"))
                .andExpect(jsonPath("$.data.activeLanguageServed").value("en"));
    }

    @Test
    @DisplayName("GET /api/courses/{slug}/quizzes/{quizSlug} - Never exposes correctOptionId or explanation")
    void testGetPublicQuizStripsAnswers() throws Exception {
        QuizPublicDto quiz = new QuizPublicDto();
        quiz.setId(5L);
        quiz.setTitle("Module 1 Assessment");
        quiz.setSlug("module-1-quiz");

        QuizQuestionPublicDto q = new QuizQuestionPublicDto();
        q.setId(100L);
        q.setPrompt("What is Big-O?");
        q.setOptions(List.of(new QuizQuestionOptionDto("opt_a", "Option A"), new QuizQuestionOptionDto("opt_b", "Option B")));
        quiz.setQuestions(List.of(q));

        when(quizService.getPublicQuizByCourseAndSlug(eq("dsa"), eq("module-1-quiz"), anyString())).thenReturn(quiz);

        mockMvc.perform(get("/api/courses/dsa/quizzes/module-1-quiz?lang=en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.questions[0].correctOptionId").doesNotExist())
                .andExpect(jsonPath("$.data.questions[0].explanation").doesNotExist())
                .andExpect(jsonPath("$.data.questions[0].prompt").value("What is Big-O?"));
    }
}
