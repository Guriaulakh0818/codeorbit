package com.codeorbit.service;

import com.codeorbit.dto.QuizAnswerSubmissionDto;
import com.codeorbit.dto.QuizSubmissionRequestDto;
import com.codeorbit.dto.QuizSubmissionResultDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.impl.QuizSubmissionTransactionalServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuizScoringAndThresholdTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @Mock
    private UserQuizTrackerRepository trackerRepository;

    @Mock
    private UserQuizAttemptRepository attemptRepository;

    @Mock
    private UserQuizAttemptAnswerRepository attemptAnswerRepository;

    @Mock
    private CurriculumProgressionService progressionService;

    private ObjectMapper objectMapper = new ObjectMapper();

    private QuizSubmissionTransactionalServiceImpl submissionService;

    private User user;
    private Course course;
    private CourseModule module;

    @BeforeEach
    void setUp() {
        submissionService = new QuizSubmissionTransactionalServiceImpl(
                userRepository,
                quizRepository,
                quizQuestionRepository,
                trackerRepository,
                attemptRepository,
                attemptAnswerRepository,
                objectMapper,
                progressionService
        );

        user = new User("Rohan Verma", "rohan@student.edu", "hashed_pwd", Role.STUDENT);
        user.setId(101L);

        course = new Course("DSA Track", "dsa", "Master DSA", "Short", "DSA", "BEGINNER", 35, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        module = new CourseModule(course, "Arrays", "arrays", "Array fundamentals", 1, PublishStatus.PUBLISHED);
        module.setCurriculumLevel(CurriculumLevel.BEGINNER);
        module.setId(10L);
    }

    private List<QuizQuestion> createMockQuestions(Quiz quiz, int count) {
        List<QuizQuestion> questions = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            QuizQuestion q = new QuizQuestion();
            q.setId((long) i);
            q.setQuiz(quiz);
            q.setOrderIndex(i);
            q.setPromptEn("Question " + i);
            q.setCorrectOptionId("opt_a");
            q.setOptionsJson("[{\"id\":\"opt_a\",\"text_en\":\"Correct A\"},{\"id\":\"opt_b\",\"text_en\":\"Wrong B\"}]");
            q.setExplanationEn("Explanation " + i);
            questions.add(q);
        }
        return questions;
    }

    private QuizSubmissionRequestDto createSubmissionRequest(List<QuizQuestion> questions, int correctAnswersCount) {
        List<QuizAnswerSubmissionDto> answers = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            QuizQuestion q = questions.get(i);
            String selectedOption = (i < correctAnswersCount) ? "opt_a" : "opt_b";
            answers.add(new QuizAnswerSubmissionDto(q.getId(), selectedOption));
        }
        QuizSubmissionRequestDto req = new QuizSubmissionRequestDto();
        req.setLanguage("en");
        req.setAnswers(answers);
        return req;
    }

    @Test
    @DisplayName("Module Quiz (10 Qs, 80% threshold): 8/10 correct gives 80.00% and PASSES")
    void testModuleQuiz_8Of10_Passes80PercentBoundary() {
        Quiz moduleQuiz = new Quiz(module, "Arrays Quiz", "arrays-quiz", "10 Qs", 80, 5, PublishStatus.PUBLISHED);
        moduleQuiz.setId(50L);
        moduleQuiz.setQuizType(QuizType.MODULE_QUIZ);
        moduleQuiz.setCurriculumLevel(CurriculumLevel.BEGINNER);

        List<QuizQuestion> questions = createMockQuestions(moduleQuiz, 10);

        when(userRepository.findById(101L)).thenReturn(Optional.of(user));
        when(quizRepository.findById(50L)).thenReturn(Optional.of(moduleQuiz));
        when(quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(50L)).thenReturn(questions);
        when(trackerRepository.findByUserIdAndQuizIdForUpdate(101L, 50L)).thenReturn(Optional.empty());
        when(trackerRepository.saveAndFlush(any())).thenAnswer(inv -> inv.getArgument(0));
        when(attemptRepository.save(any())).thenAnswer(inv -> {
            UserQuizAttempt a = inv.getArgument(0);
            a.setId(999L);
            return a;
        });

        QuizSubmissionRequestDto request = createSubmissionRequest(questions, 8); // 8 of 10 correct = 80%
        QuizSubmissionResultDto result = submissionService.executeSubmissionInNewTransaction(101L, 50L, request);

        assertNotNull(result);
        assertEquals(10, result.getTotalQuestions());
        assertEquals(8, result.getCorrectAnswers());
        assertEquals(0, new BigDecimal("80.00").compareTo(result.getScorePercentage()));
        assertEquals(80, result.getPassThresholdPercentage());
        assertTrue(result.isPassed(), "8/10 on 80% threshold quiz must pass");
    }

    @Test
    @DisplayName("Module Quiz (10 Qs, 80% threshold): 7/10 correct gives 70.00% and FAILS")
    void testModuleQuiz_7Of10_Fails80PercentBoundary() {
        Quiz moduleQuiz = new Quiz(module, "Arrays Quiz", "arrays-quiz", "10 Qs", 80, 5, PublishStatus.PUBLISHED);
        moduleQuiz.setId(50L);
        moduleQuiz.setQuizType(QuizType.MODULE_QUIZ);
        moduleQuiz.setCurriculumLevel(CurriculumLevel.BEGINNER);

        List<QuizQuestion> questions = createMockQuestions(moduleQuiz, 10);

        when(userRepository.findById(101L)).thenReturn(Optional.of(user));
        when(quizRepository.findById(50L)).thenReturn(Optional.of(moduleQuiz));
        when(quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(50L)).thenReturn(questions);
        when(trackerRepository.findByUserIdAndQuizIdForUpdate(101L, 50L)).thenReturn(Optional.empty());
        when(trackerRepository.saveAndFlush(any())).thenAnswer(inv -> inv.getArgument(0));
        when(attemptRepository.save(any())).thenAnswer(inv -> {
            UserQuizAttempt a = inv.getArgument(0);
            a.setId(999L);
            return a;
        });

        QuizSubmissionRequestDto request = createSubmissionRequest(questions, 7); // 7 of 10 correct = 70%
        QuizSubmissionResultDto result = submissionService.executeSubmissionInNewTransaction(101L, 50L, request);

        assertNotNull(result);
        assertEquals(10, result.getTotalQuestions());
        assertEquals(7, result.getCorrectAnswers());
        assertEquals(0, new BigDecimal("70.00").compareTo(result.getScorePercentage()));
        assertEquals(80, result.getPassThresholdPercentage());
        assertFalse(result.isPassed(), "7/10 on 80% threshold quiz must fail");
    }

    @Test
    @DisplayName("Level Final Quiz (25 Qs, 80% threshold): 20/25 correct gives 80.00% and PASSES")
    void testLevelFinalQuiz_20Of25_Passes80PercentBoundary() {
        Quiz finalQuiz = new Quiz(module, "Beginner Level Final Exam", "beginner-final-exam", "25 Qs", 80, 5, PublishStatus.PUBLISHED);
        finalQuiz.setId(60L);
        finalQuiz.setQuizType(QuizType.LEVEL_FINAL_QUIZ);
        finalQuiz.setCurriculumLevel(CurriculumLevel.BEGINNER);

        List<QuizQuestion> questions = createMockQuestions(finalQuiz, 25);

        when(userRepository.findById(101L)).thenReturn(Optional.of(user));
        when(quizRepository.findById(60L)).thenReturn(Optional.of(finalQuiz));
        when(quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(60L)).thenReturn(questions);
        when(trackerRepository.findByUserIdAndQuizIdForUpdate(101L, 60L)).thenReturn(Optional.empty());
        when(trackerRepository.saveAndFlush(any())).thenAnswer(inv -> inv.getArgument(0));
        when(attemptRepository.save(any())).thenAnswer(inv -> {
            UserQuizAttempt a = inv.getArgument(0);
            a.setId(1000L);
            return a;
        });

        QuizSubmissionRequestDto request = createSubmissionRequest(questions, 20); // 20 of 25 correct = 80%
        QuizSubmissionResultDto result = submissionService.executeSubmissionInNewTransaction(101L, 60L, request);

        assertNotNull(result);
        assertEquals(25, result.getTotalQuestions());
        assertEquals(20, result.getCorrectAnswers());
        assertEquals(0, new BigDecimal("80.00").compareTo(result.getScorePercentage()));
        assertEquals(80, result.getPassThresholdPercentage());
        assertTrue(result.isPassed(), "20/25 on 80% threshold quiz must pass");
    }

    @Test
    @DisplayName("Level Final Quiz (25 Qs, 80% threshold): 19/25 correct gives 76.00% and FAILS")
    void testLevelFinalQuiz_19Of25_Fails80PercentBoundary() {
        Quiz finalQuiz = new Quiz(module, "Beginner Level Final Exam", "beginner-final-exam", "25 Qs", 80, 5, PublishStatus.PUBLISHED);
        finalQuiz.setId(60L);
        finalQuiz.setQuizType(QuizType.LEVEL_FINAL_QUIZ);
        finalQuiz.setCurriculumLevel(CurriculumLevel.BEGINNER);

        List<QuizQuestion> questions = createMockQuestions(finalQuiz, 25);

        when(userRepository.findById(101L)).thenReturn(Optional.of(user));
        when(quizRepository.findById(60L)).thenReturn(Optional.of(finalQuiz));
        when(quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(60L)).thenReturn(questions);
        when(trackerRepository.findByUserIdAndQuizIdForUpdate(101L, 60L)).thenReturn(Optional.empty());
        when(trackerRepository.saveAndFlush(any())).thenAnswer(inv -> inv.getArgument(0));
        when(attemptRepository.save(any())).thenAnswer(inv -> {
            UserQuizAttempt a = inv.getArgument(0);
            a.setId(1000L);
            return a;
        });

        QuizSubmissionRequestDto request = createSubmissionRequest(questions, 19); // 19 of 25 correct = 76%
        QuizSubmissionResultDto result = submissionService.executeSubmissionInNewTransaction(101L, 60L, request);

        assertNotNull(result);
        assertEquals(25, result.getTotalQuestions());
        assertEquals(19, result.getCorrectAnswers());
        assertEquals(0, new BigDecimal("76.00").compareTo(result.getScorePercentage()));
        assertEquals(80, result.getPassThresholdPercentage());
        assertFalse(result.isPassed(), "19/25 on 80% threshold quiz must fail");
    }
}
