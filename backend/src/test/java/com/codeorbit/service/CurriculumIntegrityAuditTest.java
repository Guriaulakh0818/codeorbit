package com.codeorbit.service;

import com.codeorbit.config.seed.*;
import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.ForbiddenException;
import com.codeorbit.repository.*;
import com.codeorbit.service.impl.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CurriculumIntegrityAuditTest {

    @Mock
    private SubcourseRepository subcourseRepository;
    @Mock
    private CourseModuleRepository courseModuleRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuizQuestionRepository quizQuestionRepository;
    @Mock
    private UserLessonProgressRepository progressRepository;
    @Mock
    private UserQuizTrackerRepository trackerRepository;
    @Mock
    private PlacementReadyEntitlementRepository entitlementRepository;
    @Mock
    private PlacementKitRepository kitRepository;
    @Mock
    private PlacementKitCategoryRepository categoryRepository;
    @Mock
    private PlacementKitQuestionRepository questionRepository;
    @Mock
    private PlacementKitOptionRepository optionRepository;
    @Mock
    private PlacementKitPaymentRepository paymentRepository;
    @Mock
    private PlacementKitEntitlementRepository kitEntitlementRepository;
    @Mock
    private PlacementKitProgressRepository kitProgressRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RazorpayGatewayService razorpayGatewayService;
    @Mock
    private UserQuizAttemptRepository attemptRepository;
    @Mock
    private UserQuizAttemptAnswerRepository attemptAnswerRepository;

    private CurriculumSeedHelper seedHelper;

    private CurriculumProgressionServiceImpl progressionService;
    private PlacementKitServiceImpl placementKitService;
    private QuizSubmissionTransactionalServiceImpl submissionService;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        seedHelper = new CurriculumSeedHelper(
                subcourseRepository, courseModuleRepository, lessonRepository, quizRepository, quizQuestionRepository
        );

        progressionService = new CurriculumProgressionServiceImpl(
                courseModuleRepository, quizRepository, lessonRepository,
                progressRepository, trackerRepository, entitlementRepository
        );

        placementKitService = new PlacementKitServiceImpl(
                kitRepository, categoryRepository, questionRepository, optionRepository,
                paymentRepository, kitEntitlementRepository, kitProgressRepository,
                userRepository, razorpayGatewayService
        );

        submissionService = new QuizSubmissionTransactionalServiceImpl(
                userRepository, quizRepository, quizQuestionRepository, trackerRepository,
                attemptRepository, attemptAnswerRepository, objectMapper, progressionService
        );
    }

    @Test
    @DisplayName("Audit Dimension 1 & 2: Subcourse Count & Free/Paid Pricing Boundaries")
    void testSubcourseStructureAndPricingBoundaries() {
        Course dsa = new Course("DSA Track", "dsa", "DSA Description", "Short Desc", "DSA", "BEGINNER_TO_ADVANCED", 40, 1, PublishStatus.PUBLISHED);

        when(subcourseRepository.save(any(Subcourse.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Subcourse b = seedHelper.createSubcourse(dsa, CurriculumLevel.BEGINNER, "Beginner", "dsa-b", "desc", 0, true, 1);
        Subcourse i = seedHelper.createSubcourse(dsa, CurriculumLevel.INTERMEDIATE, "Intermediate", "dsa-i", "desc", 0, true, 2);
        Subcourse a = seedHelper.createSubcourse(dsa, CurriculumLevel.ADVANCED, "Advanced", "dsa-a", "desc", 0, true, 3);
        Subcourse p = seedHelper.createSubcourse(dsa, CurriculumLevel.PLACEMENT_READY, "Placement Ready", "dsa-p", "desc", 29, false, 4);

        assertThat(b.isFree()).isTrue();
        assertThat(b.getPriceInr()).isZero();

        assertThat(i.isFree()).isTrue();
        assertThat(i.getPriceInr()).isZero();

        assertThat(a.isFree()).isTrue();
        assertThat(a.getPriceInr()).isZero();

        assertThat(p.isFree()).isFalse();
        assertThat(p.getPriceInr()).isEqualTo(29);
    }

    @Test
    @DisplayName("Audit Dimension 3: 4 Modules per Subcourse (16 Modules per Subject)")
    void testModuleCountsPerSubject() {
        Course osCourse = new Course("OS Core", "operating-systems", "OS Desc", "Short", "OS", "BEGINNER_TO_ADVANCED", 30, 2, PublishStatus.PUBLISHED);
        Subcourse b = new Subcourse(osCourse, CurriculumLevel.BEGINNER, "OS Beginner", "os-b", "desc", 0, true, 1, PublishStatus.PUBLISHED);

        when(courseModuleRepository.save(any(CourseModule.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<CourseModule> modules = new ArrayList<>();
        for (int m = 1; m <= 4; m++) {
            CourseModule mod = seedHelper.createModule(osCourse, b, CurriculumLevel.BEGINNER, "Mod " + m, "os-b-mod" + m, "desc", m);
            modules.add(mod);
        }

        assertThat(modules).hasSize(4);
        assertThat(modules.get(0).getOrderIndex()).isEqualTo(1);
        assertThat(modules.get(3).getOrderIndex()).isEqualTo(4);
    }

    @Test
    @DisplayName("Audit Dimension 4: Lesson Content Bilingual Integrity & Code Snippets")
    void testLessonBilingualContentAndCodeSnippets() {
        Course dbmsCourse = new Course("DBMS", "dbms", "DBMS Desc", "Short", "DBMS", "BEGINNER_TO_ADVANCED", 30, 3, PublishStatus.PUBLISHED);
        CourseModule mod = new CourseModule(dbmsCourse, "Relational Model", "relational-model", "desc", 1, PublishStatus.PUBLISHED);

        when(lessonRepository.save(any(Lesson.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Lesson l = seedHelper.createLesson(mod, "1.1 SQL Basics", "sql-basics", 15, 1,
                "# SQL Basics\nComplete text here.",
                "# SQL Basics Hinglish\nComplete Hinglish text.",
                "public class DmlDemo {}",
                "int main() { return 0; }",
                "def dml_demo(): pass"
        );

        assertThat(l.getContentEn()).doesNotContain("TODO").doesNotContain("Lorem ipsum");
        assertThat(l.getContentHinglish()).doesNotContain("TODO").doesNotContain("Coming soon");
        assertThat(l.getHinglishStatus()).isEqualTo(HinglishStatus.PUBLISHED);
        assertThat(l.getCodeSnippetJava()).isNotEmpty();
        assertThat(l.getCodeSnippetCpp()).isNotEmpty();
        assertThat(l.getCodeSnippetPython()).isNotEmpty();
    }

    @Test
    @DisplayName("Audit Dimension 5 & 6: Module Quizzes (10 Qs) & Level Final Quizzes (25 Qs) at 80% Threshold")
    void testQuizQuestionCountsAndPassingThresholds() {
        Course netCourse = new Course("Networks", "computer-networks", "Net Desc", "Short", "NETWORKS", "BEGINNER_TO_ADVANCED", 30, 4, PublishStatus.PUBLISHED);
        Subcourse b = new Subcourse(netCourse, CurriculumLevel.BEGINNER, "Net Beginner", "cn-b", "desc", 0, true, 1, PublishStatus.PUBLISHED);
        CourseModule mod = new CourseModule(netCourse, "OSI Model", "osi-model", "desc", 1, PublishStatus.PUBLISHED);

        when(quizRepository.save(any(Quiz.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Quiz modQuiz = seedHelper.createModuleQuiz(mod, b, CurriculumLevel.BEGINNER, "Mod 1 Quiz", "cn-mod1-quiz", "Desc", 80);
        Quiz finalQuiz = seedHelper.createFinalQuiz(mod, b, CurriculumLevel.BEGINNER, "Level Final Quiz", "cn-b-final-quiz", "Desc", 80);

        assertThat(modQuiz.getMinPassScorePercentage()).isEqualTo(80);
        assertThat(modQuiz.getQuizType()).isEqualTo(QuizType.MODULE_QUIZ);

        assertThat(finalQuiz.getMinPassScorePercentage()).isEqualTo(80);
        assertThat(finalQuiz.getQuizType()).isEqualTo(QuizType.LEVEL_FINAL_QUIZ);
    }

    @Test
    @DisplayName("Audit Dimension 7: Sequential Module Progression Locking")
    void testSequentialModuleLocking() {
        Course dsa = new Course("DSA", "dsa", "DSA Desc", "Short", "DSA", "BEGINNER_TO_ADVANCED", 40, 1, PublishStatus.PUBLISHED);
        dsa.setId(1L);

        CourseModule mod1 = new CourseModule(dsa, "Mod 1", "mod-1", "desc", 1, PublishStatus.PUBLISHED);
        mod1.setId(10L);
        mod1.setCurriculumLevel(CurriculumLevel.BEGINNER);

        CourseModule mod2 = new CourseModule(dsa, "Mod 2", "mod-2", "desc", 2, PublishStatus.PUBLISHED);
        mod2.setId(20L);
        mod2.setCurriculumLevel(CurriculumLevel.BEGINNER);

        Quiz mod1Quiz = new Quiz(mod1, "Mod 1 Quiz", "mod-1-quiz", "desc", 80, 5, PublishStatus.PUBLISHED);
        mod1Quiz.setId(100L);
        mod1Quiz.setQuizType(QuizType.MODULE_QUIZ);

        // Module 1 is always unlocked for beginner
        assertThat(progressionService.isModuleUnlocked(101L, mod1)).isTrue();

        // Module 2 is locked when Module 1 Quiz is NOT passed
        when(courseModuleRepository.findByCourseIdAndCurriculumLevelAndOrderIndex(1L, CurriculumLevel.BEGINNER, 1))
                .thenReturn(Optional.of(mod1));
        when(quizRepository.findByModuleIdAndStatus(10L, PublishStatus.PUBLISHED))
                .thenReturn(List.of(mod1Quiz));
        when(trackerRepository.findByUserIdAndQuizId(101L, 100L))
                .thenReturn(Optional.empty());

        assertThat(progressionService.isModuleUnlocked(101L, mod2)).isFalse();

        // Module 2 unlocks when Module 1 Quiz is passed with >= 80%
        UserQuizTracker passedTracker = new UserQuizTracker(new User(), mod1Quiz);
        passedTracker.setHasPassed(true);
        passedTracker.setHighestScorePercentage(new BigDecimal("90.0"));
        when(trackerRepository.findByUserIdAndQuizId(101L, 100L))
                .thenReturn(Optional.of(passedTracker));

        assertThat(progressionService.isModuleUnlocked(101L, mod2)).isTrue();
    }

    @Test
    @DisplayName("Audit Dimension 8: Final Quiz Unlock Requires All Module Quizzes Passed in Level")
    void testFinalQuizUnlockCondition() {
        Course dsa = new Course("DSA", "dsa", "desc", "short", "DSA", "BEGINNER_TO_ADVANCED", 40, 1, PublishStatus.PUBLISHED);
        dsa.setId(1L);

        CourseModule mod1 = new CourseModule(dsa, "Mod 1", "mod-1", "desc", 1, PublishStatus.PUBLISHED);
        mod1.setId(10L);
        mod1.setCurriculumLevel(CurriculumLevel.BEGINNER);

        Quiz q1 = new Quiz(mod1, "Q1", "q1", "desc", 80, null, PublishStatus.PUBLISHED);
        q1.setId(11L);
        q1.setQuizType(QuizType.MODULE_QUIZ);

        Quiz finalQuiz = new Quiz(mod1, "Final", "final", "desc", 80, null, PublishStatus.PUBLISHED);
        finalQuiz.setId(99L);
        finalQuiz.setQuizType(QuizType.LEVEL_FINAL_QUIZ);
        finalQuiz.setCurriculumLevel(CurriculumLevel.BEGINNER);

        when(quizRepository.findModuleQuizzesByCourseAndLevel(1L, CurriculumLevel.BEGINNER))
                .thenReturn(List.of(q1));

        // When q1 is not passed
        when(trackerRepository.findByUserIdAndQuizId(102L, 11L))
                .thenReturn(Optional.empty());

        assertThat(progressionService.isQuizUnlocked(102L, finalQuiz)).isFalse();

        // When q1 is passed
        UserQuizTracker tracker = new UserQuizTracker();
        tracker.setHasPassed(true);
        tracker.setHighestScorePercentage(new BigDecimal("85.0"));
        when(trackerRepository.findByUserIdAndQuizId(102L, 11L))
                .thenReturn(Optional.of(tracker));

        assertThat(progressionService.isQuizUnlocked(102L, finalQuiz)).isTrue();
    }

    @Test
    @DisplayName("Audit Dimension 9: Placement Ready Gating (Paid Subcourse Enforcement)")
    void testPlacementReadySubcourseAccessEnforcement() {
        Course course = new Course("DSA", "dsa", "desc", "short", "DSA", "BEGINNER_TO_ADVANCED", 40, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        CourseModule prMod = new CourseModule(course, "Placement Module", "pr-mod", "desc", 1, PublishStatus.PUBLISHED);
        prMod.setCurriculumLevel(CurriculumLevel.PLACEMENT_READY);

        // When user has not paid for placement ready
        when(entitlementRepository.existsByUserIdAndCourseId(103L, 1L)).thenReturn(false);

        assertThat(progressionService.hasPlacementReadyAccess(103L, 1L)).isFalse();

        assertThatThrownBy(() -> progressionService.validateModuleAccess(103L, prMod))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("Placement Ready access requires purchase");
    }

    @Test
    @DisplayName("Audit Dimension 10: Placement Prep Kits (10 Kits) Public DTO Strips Model Answers for Non-Purchased Users")
    void testPlacementKitNonEntitledMasking() {
        PlacementKit kit = new PlacementKit("full-stack-developer-kit", "Full Stack Kit", "Full Stack", "Short", "Full", 1);
        kit.setId(501L);

        PlacementKitCategory cat = new PlacementKitCategory(kit, "Frontend", "frontend", "desc", 1);
        cat.setId(601L);

        PlacementKitQuestion qSample = new PlacementKitQuestion(
                cat, "Sample Question?", PlacementKitQuestionType.MCQ, "EASY", "Answer Hidden for Sample", "Explanation", 1, true
        );
        qSample.setId(701L);

        PlacementKitQuestion qPaid = new PlacementKitQuestion(
                cat, "Paid Secret Question?", PlacementKitQuestionType.INTERVIEW, "HARD", "Top Secret Model Answer", "Deep explanation", 2, false
        );
        qPaid.setId(702L);

        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(kit));
        when(categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(501L)).thenReturn(List.of(cat));
        when(questionRepository.countByKitId(501L)).thenReturn(2L);
        when(questionRepository.findByCategoryIdAndActiveTrueOrderByOrderIndexAsc(601L)).thenReturn(List.of(qSample, qPaid));
        when(questionRepository.findSampleQuestionsByKitId(501L)).thenReturn(List.of(qSample));
        when(optionRepository.findByQuestionIdOrderByOrderIndexAsc(701L)).thenReturn(Collections.emptyList());

        // Anonymous un-entitled user
        PlacementKitDetailDto detail = placementKitService.getKitBySlug("full-stack-developer-kit", null);

        assertThat(detail.isPurchased()).isFalse();
        assertThat(detail.getCategories()).hasSize(1);
        assertThat(detail.getSampleQuestions()).hasSize(1);

        PlacementKitQuestionDto sampleDto = detail.getSampleQuestions().get(0);
        assertThat(sampleDto.isSample()).isTrue();
        // For unentitled users, sample questions have model answer stripped to prevent scraping
        assertThat(sampleDto.getModelAnswer()).isNull();
        assertThat(sampleDto.getExplanation()).isNull();
    }

    @Test
    @DisplayName("Audit Dimension 11: Quiz Submission Scoring & 80% Threshold Pass/Fail Logic")
    void testQuizScoringCalculations() {
        User user = new User("Student", "s@test.com", "pass", Role.STUDENT);
        user.setId(104L);

        Course course = new Course("DSA", "dsa", "desc", "short", "DSA", "BEGINNER_TO_ADVANCED", 40, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        CourseModule mod = new CourseModule(course, "Mod", "mod", "desc", 1, PublishStatus.PUBLISHED);
        mod.setId(10L);
        mod.setCurriculumLevel(CurriculumLevel.BEGINNER);

        Quiz quiz = new Quiz(mod, "Test Quiz", "test-quiz", "desc", 80, null, PublishStatus.PUBLISHED);
        quiz.setId(801L);
        quiz.setQuizType(QuizType.MODULE_QUIZ);

        String optJson1 = seedHelper.buildOptionsJson("A", "A", "B", "B", "C", "C", "D", "D");
        String optJson2 = seedHelper.buildOptionsJson("A", "A", "B", "B", "C", "C", "D", "D");

        QuizQuestion q1 = new QuizQuestion(quiz, "Q1", "Q1", null, optJson1, "opt_a", "exp", "exp", 1);
        q1.setId(901L);
        QuizQuestion q2 = new QuizQuestion(quiz, "Q2", "Q2", null, optJson2, "opt_b", "exp", "exp", 2);
        q2.setId(902L);

        when(userRepository.findById(104L)).thenReturn(Optional.of(user));
        when(quizRepository.findById(801L)).thenReturn(Optional.of(quiz));
        when(quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(801L)).thenReturn(List.of(q1, q2));
        when(trackerRepository.findByUserIdAndQuizIdForUpdate(104L, 801L)).thenReturn(Optional.empty());
        when(trackerRepository.saveAndFlush(any(UserQuizTracker.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(attemptRepository.save(any(UserQuizAttempt.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Submit 1 correct out of 2 = 50% (< 80% -> FAIL)
        QuizSubmissionRequestDto failRequest = new QuizSubmissionRequestDto();
        QuizAnswerSubmissionDto ans1 = new QuizAnswerSubmissionDto(); ans1.setQuestionId(901L); ans1.setSelectedOptionId("opt_a");
        QuizAnswerSubmissionDto ans2 = new QuizAnswerSubmissionDto(); ans2.setQuestionId(902L); ans2.setSelectedOptionId("opt_d"); // wrong
        failRequest.setAnswers(List.of(ans1, ans2));

        QuizSubmissionResultDto failResult = submissionService.executeSubmissionInNewTransaction(104L, 801L, failRequest);
        assertThat(failResult.getCorrectAnswers()).isEqualTo(1);
        assertThat(failResult.getTotalQuestions()).isEqualTo(2);
        assertThat(failResult.getScorePercentage().intValue()).isEqualTo(50);
        assertThat(failResult.isPassed()).isFalse();

        // Submit 2 correct out of 2 = 100% (>= 80% -> PASS)
        QuizSubmissionRequestDto passRequest = new QuizSubmissionRequestDto();
        QuizAnswerSubmissionDto pAns1 = new QuizAnswerSubmissionDto(); pAns1.setQuestionId(901L); pAns1.setSelectedOptionId("opt_a");
        QuizAnswerSubmissionDto pAns2 = new QuizAnswerSubmissionDto(); pAns2.setQuestionId(902L); pAns2.setSelectedOptionId("opt_b"); // correct
        passRequest.setAnswers(List.of(pAns1, pAns2));

        QuizSubmissionResultDto passResult = submissionService.executeSubmissionInNewTransaction(104L, 801L, passRequest);
        assertThat(passResult.getCorrectAnswers()).isEqualTo(2);
        assertThat(passResult.getTotalQuestions()).isEqualTo(2);
        assertThat(passResult.getScorePercentage().intValue()).isEqualTo(100);
        assertThat(passResult.isPassed()).isTrue();
    }
}
