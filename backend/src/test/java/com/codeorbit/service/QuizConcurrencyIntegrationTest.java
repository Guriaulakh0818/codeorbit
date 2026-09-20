package com.codeorbit.service;

import com.codeorbit.dto.QuizAnswerSubmissionDto;
import com.codeorbit.dto.QuizSubmissionRequestDto;
import com.codeorbit.dto.QuizSubmissionResultDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class QuizConcurrencyIntegrationTest {

    @Autowired
    private QuizService quizService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseModuleRepository moduleRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository questionRepository;

    @Autowired
    private UserQuizTrackerRepository trackerRepository;

    @Autowired
    private UserQuizAttemptRepository attemptRepository;

    private User testUser;
    private Quiz testQuiz;

    @BeforeEach
    void setUp() {
        // Create isolated test user
        String email = "concurrency.test." + System.currentTimeMillis() + "@codeorbit.dev";
        testUser = new User("Concurrent Tester", email, "passwordHash", Role.STUDENT);
        testUser = userRepository.save(testUser);

        // Create course, module, quiz and question
        Course course = new Course("Concurrency Course", "conc-course-" + System.currentTimeMillis(), "Desc", "Short", "DSA", "BEGINNER", 10, 1, PublishStatus.PUBLISHED);
        course = courseRepository.save(course);

        CourseModule module = new CourseModule(course, "Concurrency Module", "conc-mod", "Desc", 1, PublishStatus.PUBLISHED);
        module = moduleRepository.save(module);

        testQuiz = new Quiz(module, "Concurrency Quiz", "conc-quiz-" + System.currentTimeMillis(), "Desc", 80, null, PublishStatus.PUBLISHED);
        testQuiz = quizRepository.save(testQuiz);

        QuizQuestion q = new QuizQuestion(
                testQuiz,
                "What is O(1)?",
                null,
                null,
                "[{\"id\":\"opt_a\",\"text_en\":\"Constant Time\"},{\"id\":\"opt_b\",\"text_en\":\"Linear Time\"}]",
                "opt_a",
                "Explanation",
                null,
                1
        );
        questionRepository.save(q);
    }

    @Test
    @DisplayName("Concurrent Quiz Submissions - Atomic tracker locking guarantees strictly unique attempt numbers")
    void testConcurrentSubmissionsAtomicAttemptNumbers() throws InterruptedException, ExecutionException {
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);

        UserPrincipal principal = UserPrincipal.create(testUser);

        List<QuizQuestion> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(testQuiz.getId());
        Long qId = questions.get(0).getId();

        QuizSubmissionRequestDto requestPayload = new QuizSubmissionRequestDto("en", List.of(
                new QuizAnswerSubmissionDto(qId, "opt_a")
        ));

        List<Callable<QuizSubmissionResultDto>> tasks = new ArrayList<>();
        for (int i = 0; i < threadCount; i++) {
            tasks.add(() -> {
                startLatch.await(); // Simultaneous release
                return quizService.submitQuizAttempt(principal, testQuiz.getId(), requestPayload);
            });
        }

        // Trigger simultaneous submissions
        startLatch.countDown();
        List<Future<QuizSubmissionResultDto>> futures = executor.invokeAll(tasks);

        Set<Integer> attemptNumbers = new HashSet<>();
        for (Future<QuizSubmissionResultDto> f : futures) {
            QuizSubmissionResultDto res = f.get();
            assertNotNull(res);
            assertTrue(res.getAttemptNumber() >= 1 && res.getAttemptNumber() <= threadCount);
            attemptNumbers.add(res.getAttemptNumber());
        }

        executor.shutdown();

        // Verify: All 10 attempt numbers are strictly unique (no collisions)
        assertEquals(threadCount, attemptNumbers.size(), "Each concurrent submission must receive a unique attempt number");

        // Verify: Database tracker and attempts count
        UserQuizTracker tracker = trackerRepository.findByUserIdAndQuizId(testUser.getId(), testQuiz.getId()).orElseThrow();
        assertEquals(threadCount, tracker.getAttemptsCount());

        List<UserQuizAttempt> dbAttempts = attemptRepository.findByUserIdAndQuizIdOrderByAttemptNumberDesc(testUser.getId(), testQuiz.getId());
        assertEquals(threadCount, dbAttempts.size());
    }
}
