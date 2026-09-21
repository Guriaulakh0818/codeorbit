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

        // 2. Module 1: Algorithmic Complexity & Foundations (Beginner Level)
        CourseModule mod1 = new CourseModule(
                dsaCourse,
                "Module 1: Algorithmic Complexity & Foundations",
                "foundations-and-big-o",
                "Understanding time complexity, space complexity, Big-O notation, and asymptotic analysis.",
                1,
                PublishStatus.PUBLISHED
        );
        mod1.setCurriculumLevel(CurriculumLevel.BEGINNER);
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

        // 3. Module 1 Quiz (10-Question Module Quiz, 75% Passing Threshold)
        Quiz q1 = new Quiz(
                mod1,
                "Module 1 Assessment: Complexity & Two Pointers",
                "module-1-quiz",
                "Test your understanding of algorithmic complexity and the two-pointer technique (10 Questions, 75% to pass).",
                75,
                null,
                PublishStatus.PUBLISHED
        );
        q1.setQuizType(QuizType.MODULE_QUIZ);
        q1.setCurriculumLevel(CurriculumLevel.BEGINNER);
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

        // Beginner Final Quiz (25 Questions, 80% passing threshold)
        Quiz begFinalQuiz = new Quiz(
                mod1,
                "Beginner Level Comprehensive Assessment (25 Questions)",
                "dsa-beginner-final-quiz",
                "Grand evaluation of foundational Big-O analysis and two-pointer algorithms. 80% required to graduate Beginner level.",
                80,
                null,
                PublishStatus.PUBLISHED
        );
        begFinalQuiz.setQuizType(QuizType.LEVEL_FINAL_QUIZ);
        begFinalQuiz.setCurriculumLevel(CurriculumLevel.BEGINNER);
        quizRepository.save(begFinalQuiz);

        // 3. Module 2: Trees & Graph Traversal (Intermediate Level)
        CourseModule mod2 = new CourseModule(
                dsaCourse,
                "Module 2: Non-Linear Structures — Trees & Graphs",
                "trees-and-graphs",
                "Binary Search Trees, BFS, DFS, and topological sorting with placement problem patterns.",
                2,
                PublishStatus.PUBLISHED
        );
        mod2.setCurriculumLevel(CurriculumLevel.INTERMEDIATE);
        mod2 = courseModuleRepository.save(mod2);

        Lesson l3 = new Lesson(
                mod2,
                "2.1 Tree Traversals: Inorder, Preorder, and Postorder",
                "tree-traversals-inorder-preorder-postorder",
                25,
                1,
                PublishStatus.PUBLISHED,
                "# Tree Traversals (DFS)\n\nTree traversal visits all nodes in a hierarchical tree data structure.\n\n* **Inorder (L-Root-R)**: Yields sorted order for BST.\n* **Preorder (Root-L-R)**: Used to clone trees.\n* **Postorder (L-R-Root)**: Used for subtree deletion.",
                "# Tree Traversals (DFS)\n\nTree traversal ka matlab tree ke har ek node ko systematically visit karna hota hai.\n\n* **Inorder (Left -> Root -> Right)**: Binary Search Tree me sorted order deta hai.\n* **Preorder (Root -> Left -> Right)**: Tree copy karne me use hota hai.\n* **Postorder (Left -> Right -> Root)**: Bottom-up deletion me use hota hai.",
                HinglishStatus.PUBLISHED
        );
        l3.setCodeSnippetJava("public void inorder(TreeNode root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.val + \" \");\n    inorder(root.right);\n}");
        l3.setCodeSnippetPython("def inorder(root):\n    if not root: return\n    inorder(root.left)\n    print(root.val, end=' ')\n    inorder(root.right)");
        lessonRepository.save(l3);

        Quiz q2 = new Quiz(
                mod2,
                "Module 2 Assessment: Trees & Graph Traversal",
                "trees-and-graphs-quiz",
                "Test your mastery of recursive traversals and graph algorithms (10 Questions, 75% to pass).",
                75,
                null,
                PublishStatus.PUBLISHED
        );
        q2.setQuizType(QuizType.MODULE_QUIZ);
        q2.setCurriculumLevel(CurriculumLevel.INTERMEDIATE);
        quizRepository.save(q2);

        // 4. Module 3: Dynamic Programming & Advanced Algorithms (Advanced Level)
        CourseModule mod3 = new CourseModule(
                dsaCourse,
                "Module 3: Dynamic Programming Mastery",
                "dynamic-programming-mastery",
                "Memoization, 1D/2D Tabulation, 0/1 Knapsack, and Longest Common Subsequence.",
                3,
                PublishStatus.PUBLISHED
        );
        mod3.setCurriculumLevel(CurriculumLevel.ADVANCED);
        mod3 = courseModuleRepository.save(mod3);

        Lesson l4 = new Lesson(
                mod3,
                "3.1 Dynamic Programming 0/1 Knapsack Pattern",
                "0-1-knapsack-dp-pattern",
                30,
                1,
                PublishStatus.PUBLISHED,
                "# 0/1 Knapsack Problem\n\nGiven weights and values of items, determine the maximum value that can fit into a knapsack of capacity $W$.\n\n### Recurrence Relation\n$$DP[i][w] = \\max(DP[i-1][w], \\text{val}[i] + DP[i-1][w - \\text{wt}[i]])$$",
                "# 0/1 Knapsack Problem\n\nItems ke weights aur values diye hote hain, aur hume capacity $W$ ke andar maximum profit calculate karna hota hai.",
                HinglishStatus.PUBLISHED
        );
        lessonRepository.save(l4);

        Quiz q3 = new Quiz(
                mod3,
                "Module 3 Assessment: Dynamic Programming",
                "dp-mastery-quiz",
                "Test your understanding of state transitions and memoization (10 Questions, 75% to pass).",
                75,
                null,
                PublishStatus.PUBLISHED
        );
        q3.setQuizType(QuizType.MODULE_QUIZ);
        q3.setCurriculumLevel(CurriculumLevel.ADVANCED);
        quizRepository.save(q3);

        // Advanced Level Final Quiz (25 Questions, 80% passing threshold - Unlocks ₹9 Certificate)
        Quiz advFinalQuiz = new Quiz(
                mod3,
                "Advanced Level Comprehensive Assessment (25 Questions)",
                "dsa-advanced-final-quiz",
                "Grand graduation assessment across Beginner, Intermediate, and Advanced DSA. Score 80%+ to unlock Verified Certificate.",
                80,
                null,
                PublishStatus.PUBLISHED
        );
        advFinalQuiz.setQuizType(QuizType.LEVEL_FINAL_QUIZ);
        advFinalQuiz.setCurriculumLevel(CurriculumLevel.ADVANCED);
        quizRepository.save(advFinalQuiz);

        // 5. Module 4: Placement Ready Track (₹29 Paid Unlock)
        CourseModule mod4 = new CourseModule(
                dsaCourse,
                "Placement Ready: Top Product Company Interview Problems",
                "placement-ready-interview-problems",
                "Targeted Google, Amazon, Microsoft, and Uber technical interview problems and live coding patterns.",
                4,
                PublishStatus.PUBLISHED
        );
        mod4.setCurriculumLevel(CurriculumLevel.PLACEMENT_READY);
        courseModuleRepository.save(mod4);

        logger.info("Successfully seeded complete 4-tier DSA curriculum (Beginner, Intermediate, Advanced, Placement Ready).");

        // -------------------------------------------------------------
        // 2. Seed Operating Systems (OS) Track
        // -------------------------------------------------------------
        Course osCourse = new Course(
                "Operating Systems (OS) Core Curriculum",
                "operating-systems",
                "Master fundamental OS concepts: Process Management, Threads, CPU Scheduling, Mutex & Semaphores, Virtual Memory Paging, Page Replacement, and Deadlock Prevention.",
                "Complete OS syllabus for semester exams and technical interviews.",
                "OS",
                "INTERMEDIATE",
                25,
                2,
                PublishStatus.PUBLISHED
        );
        osCourse.setCoverImageUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80");
        osCourse = courseRepository.save(osCourse);

        CourseModule osMod1 = new CourseModule(
                osCourse,
                "Module 1: Process Management & CPU Scheduling",
                "process-and-cpu-scheduling",
                "Process states, PCB, context switching, FCFS, SJF, Round Robin, and Priority Scheduling.",
                1,
                PublishStatus.PUBLISHED
        );
        osMod1.setCurriculumLevel(CurriculumLevel.BEGINNER);
        osMod1 = courseModuleRepository.save(osMod1);

        Lesson osL1 = new Lesson(
                osMod1,
                "1.1 Process Lifecycle & Context Switching",
                "process-lifecycle-and-context-switching",
                15,
                1,
                PublishStatus.PUBLISHED,
                "# Process Lifecycle & Context Switching\n\nA **Process** is a program in execution. The operating system manages processes using the **Process Control Block (PCB)**.\n\n### 5-State Process Model\n1. **New**: The process is being created.\n2. **Ready**: Loaded into main memory and waiting for CPU assignment.\n3. **Running**: Instructions are being executed on the CPU.\n4. **Waiting/Blocked**: Waiting for an I/O event or signal.\n5. **Terminated**: Finished execution.\n\n### Context Switching\nSaving the state of the currently running process and loading the saved state of the next ready process. This involves saving CPU registers, program counter, and stack pointer into the PCB.",
                "# Process Lifecycle Aur Context Switching\n\n**Process** ka matlab hota hai 'program in execution'. Operating system har process ko **Process Control Block (PCB)** ke through track karta hai.\n\n### 5-State Process Model\n1. **New**: Naya process create ho raha hai.\n2. **Ready**: RAM me load ho chuka hai aur CPU ka wait kar raha hai.\n3. **Running**: CPU instructions execute kar raha hai.\n4. **Waiting/Blocked**: Kisi I/O ya signal ka wait kar raha hai.\n5. **Terminated**: Execution complete ho gaya.\n\n### Context Switching Kya Hai?\nCurrent process ke state (registers, program counter) ko PCB me save karke agle ready process ke state ko CPU me load karna.",
                HinglishStatus.PUBLISHED
        );
        osL1.setCodeSnippetCpp("// Process structure representation in C++\nstruct PCB {\n    int pid;\n    int programCounter;\n    int registers[8];\n    int priority;\n    enum State { NEW, READY, RUNNING, WAITING, TERMINATED } state;\n};");
        osL1.setCodeSnippetJava("public enum ProcessState {\n    NEW, READY, RUNNING, WAITING, TERMINATED;\n}\n\npublic class ProcessControlBlock {\n    private int pid;\n    private ProcessState state;\n    private int programCounter;\n}");
        lessonRepository.save(osL1);

        // -------------------------------------------------------------
        // 3. Seed Database Management Systems (DBMS) Track
        // -------------------------------------------------------------
        Course dbmsCourse = new Course(
                "Database Management Systems (DBMS) & SQL",
                "dbms",
                "Comprehensive DBMS guide covering Relational Model, SQL Mastery, Normalization (1NF, 2NF, 3NF, BCNF), Indexing with B+ Trees, ACID Properties, and Concurrency Control.",
                "Zero-to-Hero DBMS notes for CSE students and backend developers.",
                "DBMS",
                "BEGINNER_TO_ADVANCED",
                30,
                3,
                PublishStatus.PUBLISHED
        );
        dbmsCourse.setCoverImageUrl("https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80");
        dbmsCourse = courseRepository.save(dbmsCourse);

        CourseModule dbmsMod1 = new CourseModule(
                dbmsCourse,
                "Module 1: Relational Model & ACID Transactions",
                "relational-model-and-acid",
                "Tables, Primary/Foreign Keys, ACID properties, and Transaction Isolation Levels.",
                1,
                PublishStatus.PUBLISHED
        );
        dbmsMod1.setCurriculumLevel(CurriculumLevel.BEGINNER);
        dbmsMod1 = courseModuleRepository.save(dbmsMod1);

        Lesson dbmsL1 = new Lesson(
                dbmsMod1,
                "1.1 ACID Properties in Database Transactions",
                "acid-properties-in-database-transactions",
                20,
                1,
                PublishStatus.PUBLISHED,
                "# ACID Properties in Database Transactions\n\nA **Transaction** is a logical unit of work. To maintain database integrity, all transactions must satisfy **ACID** properties:\n\n### 1. Atomicity\n'All or nothing' — either all operations in the transaction succeed, or the entire transaction is rolled back.\n\n### 2. Consistency\nThe database must transition from one valid state to another valid state, satisfying all schema constraints.\n\n### 3. Isolation\nConcurrent transactions execute independently without interfering with each other.\n\n### 4. Durability\nOnce a transaction commits, its updates are permanently recorded in non-volatile storage even in the event of a system crash.",
                "# DBMS Me ACID Properties\n\nDatabase me **Transaction** ka matlab hota hai kaam ka ek complete set. Data integrity ensure karne ke liye har transaction ko **ACID** rules follow karne padte hain:\n\n### 1. Atomicity (All or Nothing)\nYa to transaction ke saare steps complete honge, ya fir ek bhi nahi hoga (Rollback).\n\n### 2. Consistency\nTransaction se pehle aur baad me database hamesha valid state aur rules me hona chahiye.\n\n### 3. Isolation\nEk sath chalne wale multiple transactions ek doosre ke kaam me interfere nahi karte.\n\n### 4. Durability\nEk baar transaction commit ho gaya, to system crash hone par bhi data safe aur permanent rehta hai.",
                HinglishStatus.PUBLISHED
        );
        dbmsL1.setCodeSnippetJava("// Spring Boot @Transactional ensures ACID properties\n@Transactional(isolation = Isolation.READ_COMMITTED)\npublic void transferFunds(Long fromId, Long toId, BigDecimal amount) {\n    accountRepository.debit(fromId, amount);\n    accountRepository.credit(toId, amount);\n}");
        lessonRepository.save(dbmsL1);

        // -------------------------------------------------------------
        // 4. Seed Computer Networks Track
        // -------------------------------------------------------------
        Course cnCourse = new Course(
                "Computer Networks & Protocols",
                "computer-networks",
                "Master the OSI 7-Layer Model, TCP/IP Suite, Subnetting, TCP 3-Way Handshake, Flow & Congestion Control, DNS, HTTP/2, HTTP/3, and WebSockets.",
                "Complete computer networks curriculum for campus placements.",
                "NETWORKS",
                "INTERMEDIATE",
                28,
                4,
                PublishStatus.PUBLISHED
        );
        cnCourse.setCoverImageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80");
        cnCourse = courseRepository.save(cnCourse);

        CourseModule cnMod1 = new CourseModule(
                cnCourse,
                "Module 1: OSI & TCP/IP Network Models",
                "osi-and-tcp-ip-models",
                "Deep dive into 7 OSI layers and the 4-layer TCP/IP Internet protocol stack.",
                1,
                PublishStatus.PUBLISHED
        );
        cnMod1.setCurriculumLevel(CurriculumLevel.BEGINNER);
        cnMod1 = courseModuleRepository.save(cnMod1);

        Lesson cnL1 = new Lesson(
                cnMod1,
                "1.1 OSI 7-Layer Architecture Explained",
                "osi-7-layer-architecture-explained",
                20,
                1,
                PublishStatus.PUBLISHED,
                "# OSI 7-Layer Architecture Explained\n\nThe **Open Systems Interconnection (OSI)** model characterizes computing network communications into 7 distinct layers:\n\n1. **Application Layer (Layer 7)**: HTTP, HTTPS, FTP, DNS, SMTP.\n2. **Presentation Layer (Layer 6)**: Encryption (TLS/SSL), Compression, Data formatting.\n3. **Session Layer (Layer 5)**: Authentication, session management.\n4. **Transport Layer (Layer 4)**: End-to-end communication via TCP (reliable) and UDP (connectionless).\n5. **Network Layer (Layer 3)**: Logical addressing (IP) and packet routing.\n6. **Data Link Layer (Layer 2)**: Physical addressing (MAC), frames, and switch forwarding.\n7. **Physical Layer (Layer 1)**: Raw bits over cables, fiber optics, or radio waves.",
                "# OSI 7-Layer Model Detail Me\n\n**OSI (Open Systems Interconnection)** model network communication ko 7 layers me divide karta hai:\n\n1. **Application Layer (L7)**: End-user apps jaise Browser (HTTP, HTTPS, DNS).\n2. **Presentation Layer (L6)**: Encryption (SSL/TLS) aur data formatting.\n3. **Session Layer (L5)**: Connection session maintain karna.\n4. **Transport Layer (L4)**: End-to-end data delivery (TCP reliable ya UDP fast).\n5. **Network Layer (L3)**: IP Addressing aur Routers ke through best path find karna.\n6. **Data Link Layer (L2)**: MAC Address aur Switches ke through frame delivery.\n7. **Physical Layer (L1)**: Wires aur signals ke through 0 aur 1 (bits) bhejna.",
                HinglishStatus.PUBLISHED
        );
        lessonRepository.save(cnL1);

        logger.info("Successfully seeded launch Computer Science curriculum tracks (DSA, OS, DBMS, Networks).");
    }
}
