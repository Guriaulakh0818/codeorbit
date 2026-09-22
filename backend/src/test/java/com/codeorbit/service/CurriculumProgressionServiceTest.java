package com.codeorbit.service;

import com.codeorbit.entity.*;
import com.codeorbit.exception.ForbiddenException;
import com.codeorbit.repository.*;
import com.codeorbit.service.impl.CurriculumProgressionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CurriculumProgressionServiceTest {

    @Mock
    private CourseModuleRepository courseModuleRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private UserLessonProgressRepository progressRepository;

    @Mock
    private UserQuizTrackerRepository trackerRepository;

    @Mock
    private PlacementReadyEntitlementRepository entitlementRepository;

    @InjectMocks
    private CurriculumProgressionServiceImpl progressionService;

    private Course course;
    private Subcourse begSubcourse;
    private Subcourse intSubcourse;
    private Subcourse advSubcourse;
    private Subcourse prSubcourse;

    private CourseModule begMod1;
    private CourseModule begMod2;
    private CourseModule intMod1;
    private CourseModule prMod1;

    private Quiz begMod1Quiz;
    private Quiz begMod2Quiz;
    private Quiz begFinalQuiz;
    private Quiz prMod1Quiz;

    @BeforeEach
    void setUp() {
        course = new Course("DSA Track", "dsa", "DSA Master Track", "Short", "DSA", "BEGINNER", 35, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        begSubcourse = new Subcourse(course, CurriculumLevel.BEGINNER, "DSA Beginner", "dsa-beg", "Beg", 0, true, 1, PublishStatus.PUBLISHED);
        begSubcourse.setId(100L);

        intSubcourse = new Subcourse(course, CurriculumLevel.INTERMEDIATE, "DSA Intermediate", "dsa-int", "Int", 0, true, 2, PublishStatus.PUBLISHED);
        intSubcourse.setId(200L);

        advSubcourse = new Subcourse(course, CurriculumLevel.ADVANCED, "DSA Advanced", "dsa-adv", "Adv", 0, true, 3, PublishStatus.PUBLISHED);
        advSubcourse.setId(300L);

        prSubcourse = new Subcourse(course, CurriculumLevel.PLACEMENT_READY, "DSA Placement Ready", "dsa-pr", "PR", 29, false, 4, PublishStatus.PUBLISHED);
        prSubcourse.setId(400L);

        begMod1 = new CourseModule(course, "Module 1", "mod-1", "Mod 1", 1, PublishStatus.PUBLISHED);
        begMod1.setId(10L);
        begMod1.setCurriculumLevel(CurriculumLevel.BEGINNER);
        begMod1.setSubcourse(begSubcourse);

        begMod2 = new CourseModule(course, "Module 2", "mod-2", "Mod 2", 2, PublishStatus.PUBLISHED);
        begMod2.setId(20L);
        begMod2.setCurriculumLevel(CurriculumLevel.BEGINNER);
        begMod2.setSubcourse(begSubcourse);

        intMod1 = new CourseModule(course, "Intermediate Module 1", "int-mod-1", "Int Mod 1", 1, PublishStatus.PUBLISHED);
        intMod1.setId(30L);
        intMod1.setCurriculumLevel(CurriculumLevel.INTERMEDIATE);
        intMod1.setSubcourse(intSubcourse);

        prMod1 = new CourseModule(course, "Placement Module 1", "pr-mod-1", "PR Mod 1", 1, PublishStatus.PUBLISHED);
        prMod1.setId(40L);
        prMod1.setCurriculumLevel(CurriculumLevel.PLACEMENT_READY);
        prMod1.setSubcourse(prSubcourse);

        begMod1Quiz = new Quiz(begMod1, "Module 1 Quiz", "mod-1-quiz", "Quiz 1", 80, 5, PublishStatus.PUBLISHED);
        begMod1Quiz.setId(101L);
        begMod1Quiz.setQuizType(QuizType.MODULE_QUIZ);
        begMod1Quiz.setCurriculumLevel(CurriculumLevel.BEGINNER);
        begMod1Quiz.setSubcourse(begSubcourse);

        begMod2Quiz = new Quiz(begMod2, "Module 2 Quiz", "mod-2-quiz", "Quiz 2", 80, 5, PublishStatus.PUBLISHED);
        begMod2Quiz.setId(102L);
        begMod2Quiz.setQuizType(QuizType.MODULE_QUIZ);
        begMod2Quiz.setCurriculumLevel(CurriculumLevel.BEGINNER);
        begMod2Quiz.setSubcourse(begSubcourse);

        begFinalQuiz = new Quiz(begMod2, "Beginner Level Final Exam", "beg-final-exam", "25 Questions", 80, 5, PublishStatus.PUBLISHED);
        begFinalQuiz.setId(109L);
        begFinalQuiz.setQuizType(QuizType.LEVEL_FINAL_QUIZ);
        begFinalQuiz.setCurriculumLevel(CurriculumLevel.BEGINNER);
        begFinalQuiz.setSubcourse(begSubcourse);

        prMod1Quiz = new Quiz(prMod1, "Placement Module 1 Quiz", "pr-mod-1-quiz", "PR Quiz 1", 80, 5, PublishStatus.PUBLISHED);
        prMod1Quiz.setId(140L);
        prMod1Quiz.setQuizType(QuizType.MODULE_QUIZ);
        prMod1Quiz.setCurriculumLevel(CurriculumLevel.PLACEMENT_READY);
        prMod1Quiz.setSubcourse(prSubcourse);
    }

    @Test
    @DisplayName("Beginner Module 1 is open by default (guest or logged-in student)")
    void testBeginnerModule1_OpenByDefault() {
        assertDoesNotThrow(() -> progressionService.validateModuleAccess(null, begMod1));
        assertDoesNotThrow(() -> progressionService.validateModuleAccess(1L, begMod1));
    }

    @Test
    @DisplayName("Beginner Module 2 throws ForbiddenException when Module 1 quiz is not passed")
    void testBeginnerModule2_LockedWhenModule1QuizNotPassed() {
        when(courseModuleRepository.findByCourseIdAndCurriculumLevelAndOrderIndex(1L, CurriculumLevel.BEGINNER, 1))
                .thenReturn(Optional.of(begMod1));
        when(quizRepository.findByModuleIdAndStatus(10L, PublishStatus.PUBLISHED))
                .thenReturn(List.of(begMod1Quiz));
        when(trackerRepository.findByUserIdAndQuizId(50L, 101L))
                .thenReturn(Optional.empty());

        ForbiddenException ex = assertThrows(ForbiddenException.class,
                () -> progressionService.validateModuleAccess(50L, begMod2));
        assertTrue(ex.getMessage().contains("locked"));
    }

    @Test
    @DisplayName("Beginner Module 2 unlocks when Module 1 quiz is passed with >= 80% score")
    void testBeginnerModule2_UnlocksWhenModule1QuizPassed() {
        when(courseModuleRepository.findByCourseIdAndCurriculumLevelAndOrderIndex(1L, CurriculumLevel.BEGINNER, 1))
                .thenReturn(Optional.of(begMod1));
        when(quizRepository.findByModuleIdAndStatus(10L, PublishStatus.PUBLISHED))
                .thenReturn(List.of(begMod1Quiz));

        User user = new User();
        user.setId(50L);
        UserQuizTracker tracker = new UserQuizTracker(user, begMod1Quiz);
        tracker.setHasPassed(true);
        tracker.setHighestScorePercentage(new BigDecimal("80.00"));

        when(trackerRepository.findByUserIdAndQuizId(50L, 101L))
                .thenReturn(Optional.of(tracker));

        assertDoesNotThrow(() -> progressionService.validateModuleAccess(50L, begMod2));
    }

    @Test
    @DisplayName("Intermediate Module 1 is locked if Beginner 25Q Final Exam is not passed")
    void testIntermediateModule1_LockedWhenBeginnerFinalNotPassed() {
        when(quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(1L, QuizType.LEVEL_FINAL_QUIZ, CurriculumLevel.BEGINNER))
                .thenReturn(List.of(begFinalQuiz));
        when(trackerRepository.findByUserIdAndQuizId(50L, 109L))
                .thenReturn(Optional.empty());

        ForbiddenException ex = assertThrows(ForbiddenException.class,
                () -> progressionService.validateModuleAccess(50L, intMod1));
        assertTrue(ex.getMessage().contains("locked"));
    }

    @Test
    @DisplayName("Intermediate Module 1 unlocks when Beginner 25Q Final Exam is passed with >= 80%")
    void testIntermediateModule1_UnlocksWhenBeginnerFinalPassed() {
        when(quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(1L, QuizType.LEVEL_FINAL_QUIZ, CurriculumLevel.BEGINNER))
                .thenReturn(List.of(begFinalQuiz));

        User user = new User();
        user.setId(50L);
        UserQuizTracker tracker = new UserQuizTracker(user, begFinalQuiz);
        tracker.setHasPassed(true);
        tracker.setHighestScorePercentage(new BigDecimal("84.00"));

        when(trackerRepository.findByUserIdAndQuizId(50L, 109L))
                .thenReturn(Optional.of(tracker));

        assertDoesNotThrow(() -> progressionService.validateModuleAccess(50L, intMod1));
    }

    @Test
    @DisplayName("Placement Ready Module 1 throws ForbiddenException if user has not purchased entitlement (Paywall)")
    void testPlacementReadyModule1_Unpaid_ThrowsForbiddenException() {
        when(entitlementRepository.existsByUserIdAndCourseId(50L, 1L)).thenReturn(false);

        ForbiddenException ex = assertThrows(ForbiddenException.class,
                () -> progressionService.validateModuleAccess(50L, prMod1));
        assertTrue(ex.getMessage().contains("requires purchase"));
    }

    @Test
    @DisplayName("Placement Ready Module 1 is accessible when user has paid entitlement")
    void testPlacementReadyModule1_Paid_Accessible() {
        when(entitlementRepository.existsByUserIdAndCourseId(50L, 1L)).thenReturn(true);
        // Prerequisite: Advanced level final quiz empty in test -> allows progression
        when(quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(1L, QuizType.LEVEL_FINAL_QUIZ, CurriculumLevel.ADVANCED))
                .thenReturn(List.of());

        assertDoesNotThrow(() -> progressionService.validateModuleAccess(50L, prMod1));
    }

    @Test
    @DisplayName("Placement Ready Quiz throws ForbiddenException if user has not purchased entitlement")
    void testPlacementReadyQuiz_Unpaid_ThrowsForbiddenException() {
        when(entitlementRepository.existsByUserIdAndCourseId(50L, 1L)).thenReturn(false);

        ForbiddenException ex = assertThrows(ForbiddenException.class,
                () -> progressionService.validateQuizAccess(50L, prMod1Quiz));
        assertTrue(ex.getMessage().contains("requires purchase"));
    }

    @Test
    @DisplayName("Certificate Eligibility granularly verifies Beginner, Intermediate, and Advanced module and final quizzes")
    void testCertificateEligibility_GranularVerification() {
        when(quizRepository.findModuleQuizzesByCourseAndLevel(1L, CurriculumLevel.BEGINNER)).thenReturn(List.of(begMod1Quiz));
        when(quizRepository.findModuleQuizzesByCourseAndLevel(1L, CurriculumLevel.INTERMEDIATE)).thenReturn(List.of());
        when(quizRepository.findModuleQuizzesByCourseAndLevel(1L, CurriculumLevel.ADVANCED)).thenReturn(List.of());

        when(quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(1L, QuizType.LEVEL_FINAL_QUIZ, CurriculumLevel.BEGINNER))
                .thenReturn(List.of(begFinalQuiz));
        when(quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(1L, QuizType.LEVEL_FINAL_QUIZ, CurriculumLevel.INTERMEDIATE))
                .thenReturn(List.of());
        when(quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(1L, QuizType.LEVEL_FINAL_QUIZ, CurriculumLevel.ADVANCED))
                .thenReturn(List.of());

        User user = new User();
        user.setId(50L);
        UserQuizTracker t1 = new UserQuizTracker(user, begMod1Quiz);
        t1.setHasPassed(true);
        t1.setHighestScorePercentage(new BigDecimal("80.00"));

        UserQuizTracker tf = new UserQuizTracker(user, begFinalQuiz);
        tf.setHasPassed(true);
        tf.setHighestScorePercentage(new BigDecimal("80.00"));

        when(trackerRepository.findByUserIdAndQuizId(50L, 101L)).thenReturn(Optional.of(t1));
        when(trackerRepository.findByUserIdAndQuizId(50L, 109L)).thenReturn(Optional.of(tf));

        when(lessonRepository.countPublishedLessonsByCourseIdAndLevels(anyLong(), any())).thenReturn(10L);
        when(progressRepository.countCompletedPublishedLessonsByLevels(anyLong(), anyLong(), any())).thenReturn(10L);

        boolean eligible = progressionService.isEligibleForCertificate(50L, 1L);
        assertTrue(eligible, "Student should be eligible when all required quizzes are passed with >=80%");
    }
}
