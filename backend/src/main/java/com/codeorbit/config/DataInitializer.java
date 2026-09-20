package com.codeorbit.config;

import com.codeorbit.entity.*;
import com.codeorbit.repository.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Development seed mechanism to populate initial sample e-books, bootstrap Admin account,
 * and seed the launch course: Data Structures & Algorithms (DSA) with bilingual content.
 */
@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final EbookRepository ebookRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${codeorbit.seed-demo-data:true}")
    private boolean seedDemoData;

    @Value("${app.admin.bootstrap.email:admin@codeorbit.dev}")
    private String adminEmail;

    @Value("${app.admin.bootstrap.password:Admin@CodeOrbit2026!}")
    private String adminPassword;

    @Value("${app.admin.bootstrap.name:CodeOrbit Store Admin}")
    private String adminName;

    public DataInitializer(
            EbookRepository ebookRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            CourseModuleRepository courseModuleRepository,
            LessonRepository lessonRepository,
            QuizRepository quizRepository,
            QuizQuestionRepository quizQuestionRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.ebookRepository = ebookRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        bootstrapAdminUser();
        seedSampleEbooks();
        seedLaunchCourses();
    }

    private void bootstrapAdminUser() {
        if (userRepository.countByRole(Role.ADMIN) == 0) {
            logger.info("No Admin account found. Bootstrapping default Store Admin: {}", adminEmail);
            User admin = new User(
                    adminName,
                    adminEmail.trim().toLowerCase(),
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN
            );
            userRepository.save(admin);
            logger.info("Default Store Admin account successfully created ({})", adminEmail);
        }
    }

    private void seedSampleEbooks() {
        if (!seedDemoData) {
            return;
        }

        if (ebookRepository.count() > 0) {
            return;
        }

        logger.info("Seeding initial sample CSE & IT e-books for local development...");

        List<Ebook> sampleEbooks = List.of(
                new Ebook(
                        "Core Java for Technical Interviews [SAMPLE DEMO]",
                        "Prof. Rahul Sharma",
                        "Java",
                        "Comprehensive master guide covering OOPs principles, Collections framework, JVM internals, Multithreading, and 150+ solved interview coding questions.",
                        new BigDecimal("499.00"),
                        340,
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
                        true
                ),
                new Ebook(
                        "Data Structures & Algorithms in C++ [SAMPLE DEMO]",
                        "Vikramaditya Roy",
                        "DSA",
                        "From Arrays, Linked Lists, Stacks, Queues, Trees, Graphs to Dynamic Programming. Step-by-step visualizations and time-complexity breakdowns.",
                        new BigDecimal("599.00"),
                        450,
                        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80",
                        true
                )
        );

        ebookRepository.saveAll(sampleEbooks);
        logger.info("Successfully seeded {} sample e-books into database.", sampleEbooks.size());
    }

    private void seedLaunchCourses() {
        if (!seedDemoData) {
            return;
        }

        if (courseRepository.count() > 0) {
            return;
        }

        logger.info("Seeding launch course: Data Structures & Algorithms (DSA) Track...");

        // 1. Create Course
        Course dsaCourse = new Course(
                "Data Structures & Algorithms (DSA) Master Track",
                "dsa",
                "Comprehensive master curriculum covering algorithmic complexity, linear data structures, trees, graphs, dynamic programming, and interview patterns with verified code examples and assessments.",
                "Zero-to-Hero DSA curriculum for CSE engineering students and placement preparation.",
                "DSA",
                "BEGINNER_TO_ADVANCED",
                35,
                1,
                PublishStatus.PUBLISHED
        );
        dsaCourse.setCoverImageUrl("https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80");
        dsaCourse = courseRepository.save(dsaCourse);

        // 2. Module 1: Algorithmic Complexity & Foundations
        CourseModule mod1 = new CourseModule(
                dsaCourse,
                "Module 1: Algorithmic Complexity & Foundations",
                "foundations-and-big-o",
                "Understanding time complexity, space complexity, Big-O notation, and asymptotic analysis.",
                1,
                PublishStatus.PUBLISHED
        );
        mod1 = courseModuleRepository.save(mod1);

        // Lesson 1.1
        Lesson l1 = new Lesson(
                mod1,
                "1.1 Introduction to Time & Space Complexity",
                "time-and-space-complexity",
                15,
                1,
                PublishStatus.PUBLISHED,
                "# Introduction to Time & Space Complexity\n\nWhen writing algorithms, we evaluate performance using **Asymptotic Analysis**.\n\n### Big-O Notation\nBig-O represents the upper bound of runtime in the worst-case scenario:\n\n* **O(1)** — Constant time (e.g. array indexing)\n* **O(log N)** — Logarithmic time (e.g. Binary Search)\n* **O(N)** — Linear time (e.g. single loop over array)\n* **O(N log N)** — Linearithmic time (e.g. Merge Sort)\n* **O(N²)** — Quadratic time (e.g. Nested loops)\n\n### Space Complexity\nSpace complexity measures the auxiliary memory required by an algorithm as a function of the input size $N$.",
                "# Time & Space Complexity Ka Introduction\n\nAlgorithm design me hum performance measure karne ke liye **Asymptotic Analysis** use karte hain.\n\n### Big-O Notation Kya Hota Hai?\nBig-O worst-case scenario me runtime ka upper bound batata hai:\n\n* **O(1)** — Constant time (jaise array me index access karna)\n* **O(log N)** — Logarithmic time (jaise Binary Search)\n* **O(N)** — Linear time (jaise array pe ek loop chalana)\n* **O(N log N)** — Merge Sort / Quick Sort\n* **O(N²)** — Quadratic time (jaise nested loops)\n\n### Space Complexity\nSpace complexity ye measure karti hai ki algorithm ko run hone ke liye input size $N$ ke hisaab se kitni extra memory chahiye.",
                HinglishStatus.PUBLISHED
        );
        l1.setCodeSnippetJava("public class ComplexityDemo {\n    public static int findMax(int[] arr) {\n        int max = arr[0]; // O(1) space\n        for (int num : arr) { // O(N) time\n            if (num > max) max = num;\n        }\n        return max;\n    }\n}");
        l1.setCodeSnippetCpp("int findMax(const std::vector<int>& arr) {\n    int maxVal = arr[0];\n    for (int num : arr) {\n        if (num > maxVal) maxVal = num;\n    }\n    return maxVal;\n}");
        l1.setCodeSnippetPython("def find_max(arr):\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val");
        lessonRepository.save(l1);

        // Lesson 1.2
        Lesson l2 = new Lesson(
                mod1,
                "1.2 Two Pointers Pattern",
                "two-pointers-pattern",
                20,
                2,
                PublishStatus.PUBLISHED,
                "# Two Pointers Pattern\n\nThe two-pointer technique uses two indices to traverse an iterable simultaneously, usually from opposite ends towards the center or in the same direction.\n\n### Pair Sum in Sorted Array\nGiven a sorted array of integers `numbers` and a target `target`, return the 1-based indices of the two numbers such that they add up to target.",
                "# Two Pointers Pattern\n\nTwo-pointer technique me hum do indices (pointers) use karte hain jo array ko simultaneously traverse karte hain—ya to dono ends se center ki taraf, ya same direction me.\n\n### Sorted Array Me Pair Sum\nAgar array already sorted hai, to nested loops O(N²) ke bajaye hum Two Pointers se ise O(N) time aur O(1) space me solve kar sakte hain.",
                HinglishStatus.PUBLISHED
        );
        l2.setCodeSnippetJava("public int[] twoSum(int[] numbers, int target) {\n    int left = 0, right = numbers.length - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return new int[]{left + 1, right + 1};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return new int[]{};\n}");
        l2.setCodeSnippetCpp("std::vector<int> twoSum(std::vector<int>& numbers, int target) {\n    int left = 0, right = numbers.size() - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return {left + 1, right + 1};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return {};\n}");
        l2.setCodeSnippetPython("def two_sum(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        curr_sum = numbers[left] + numbers[right]\n        if curr_sum == target:\n            return [left + 1, right + 1]\n        elif curr_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []");
        lessonRepository.save(l2);

        // 3. Module 1 Quiz
        Quiz q1 = new Quiz(
                mod1,
                "Module 1 Assessment: Complexity & Two Pointers",
                "module-1-quiz",
                "Test your understanding of algorithmic complexity and the two-pointer technique.",
                80,
                null,
                PublishStatus.PUBLISHED
        );
        q1 = quizRepository.save(q1);

        QuizQuestion qq1 = new QuizQuestion(
                q1,
                "What is the time complexity of searching an element in a balanced binary search tree of N elements?",
                "Balanced Binary Search Tree (BST) me N elements me se kisi element ko search karne ki time complexity kya hoti hai?",
                null,
                "[{\"id\":\"opt_a\",\"text_en\":\"O(1)\",\"text_hinglish\":\"O(1)\"},{\"id\":\"opt_b\",\"text_en\":\"O(log N)\",\"text_hinglish\":\"O(log N)\"},{\"id\":\"opt_c\",\"text_en\":\"O(N)\",\"text_hinglish\":\"O(N)\"},{\"id\":\"opt_d\",\"text_en\":\"O(N^2)\",\"text_hinglish\":\"O(N^2)\"}]",
                "opt_b",
                "In a balanced BST, each comparison eliminates half of the remaining subtrees, resulting in O(log N) operations.",
                "Balanced BST me har comparison ke baad aadha tree eliminate ho jata hai, isliye time complexity O(log N) hoti hai.",
                1
        );
        quizQuestionRepository.save(qq1);

        QuizQuestion qq2 = new QuizQuestion(
                q1,
                "What is the prerequisite for applying the two-pointer opposite-direction technique for the Two Sum problem in O(N) time?",
                "Two Sum problem ko Two-Pointer technique se O(N) time me solve karne ke liye array me kya property honi zaroori hai?",
                null,
                "[{\"id\":\"opt_a\",\"text_en\":\"Array elements must be all positive\",\"text_hinglish\":\"Saare elements positive hone chahiye\"},{\"id\":\"opt_b\",\"text_en\":\"Array must be sorted\",\"text_hinglish\":\"Array pehle se sorted hona chahiye\"},{\"id\":\"opt_c\",\"text_en\":\"Array must have even length\",\"text_hinglish\":\"Array ki length even honi chahiye\"},{\"id\":\"opt_d\",\"text_en\":\"No duplicates allowed\",\"text_hinglish\":\"Duplicates nahi hone chahiye\"}]",
                "opt_b",
                "The two-pointer technique relies on monotonicity (sorted order) to decide whether to increment left or decrement right.",
                "Two-pointer technique sorted order (monotonicity) par depend karti hai jisse sum compare karke left++ ya right-- decide hota hai.",
                2
        );
        quizQuestionRepository.save(qq2);

        logger.info("Successfully seeded launch DSA track with {} modules and {} questions.", 1, 2);
    }
}
