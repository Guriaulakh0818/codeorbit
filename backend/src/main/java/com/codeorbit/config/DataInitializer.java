package com.codeorbit.config;

import com.codeorbit.config.seed.*;
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
 * and seed the launch courses (DSA, OS, DBMS, Networks) with complete multi-tier curriculum.
 */
@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final EbookRepository ebookRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PlacementKitRepository placementKitRepository;
    private final PlacementKitCategoryRepository placementKitCategoryRepository;
    private final PlacementKitQuestionRepository placementKitQuestionRepository;
    private final PlacementKitOptionRepository placementKitOptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final DsaCurriculumData dsaCurriculumData;
    private final OsCurriculumData osCurriculumData;
    private final DbmsCurriculumData dbmsCurriculumData;
    private final NetworksCurriculumData networksCurriculumData;

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
            PlacementKitRepository placementKitRepository,
            PlacementKitCategoryRepository placementKitCategoryRepository,
            PlacementKitQuestionRepository placementKitQuestionRepository,
            PlacementKitOptionRepository placementKitOptionRepository,
            PasswordEncoder passwordEncoder,
            DsaCurriculumData dsaCurriculumData,
            OsCurriculumData osCurriculumData,
            DbmsCurriculumData dbmsCurriculumData,
            NetworksCurriculumData networksCurriculumData
    ) {
        this.ebookRepository = ebookRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.placementKitRepository = placementKitRepository;
        this.placementKitCategoryRepository = placementKitCategoryRepository;
        this.placementKitQuestionRepository = placementKitQuestionRepository;
        this.placementKitOptionRepository = placementKitOptionRepository;
        this.passwordEncoder = passwordEncoder;
        this.dsaCurriculumData = dsaCurriculumData;
        this.osCurriculumData = osCurriculumData;
        this.dbmsCurriculumData = dbmsCurriculumData;
        this.networksCurriculumData = networksCurriculumData;
    }

    @Override
    public void run(String... args) {
        bootstrapAdminUser();
        seedSampleEbooks();
        seedLaunchCourses();
        seedPlacementKits();
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

        logger.info("Seeding 4 Launch CS Tracks: DSA, OS, DBMS, Networks with full 4-tier curriculum...");

        // 1. Data Structures & Algorithms
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
        dsaCurriculumData.seedDsaCurriculum(dsaCourse);

        // 2. Operating Systems
        Course osCourse = new Course(
                "Operating Systems (OS) Core Curriculum",
                "operating-systems",
                "Master fundamental OS concepts: Process Management, Threads, CPU Scheduling, Mutex & Semaphores, Virtual Memory Paging, Page Replacement, and Deadlock Prevention.",
                "Complete OS syllabus for semester exams and technical interviews.",
                "OS",
                "BEGINNER_TO_ADVANCED",
                25,
                2,
                PublishStatus.PUBLISHED
        );
        osCourse.setCoverImageUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80");
        osCourse = courseRepository.save(osCourse);
        osCurriculumData.seedOsCurriculum(osCourse);

        // 3. Database Management Systems
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
        dbmsCurriculumData.seedDbmsCurriculum(dbmsCourse);

        // 4. Computer Networks
        Course netCourse = new Course(
                "Computer Networks & Protocols",
                "computer-networks",
                "Master the OSI 7-Layer Model, TCP/IP Suite, Subnetting, TCP 3-Way Handshake, Flow & Congestion Control, DNS, HTTP/2, HTTP/3, and WebSockets.",
                "Complete computer networks curriculum for campus placements.",
                "NETWORKS",
                "BEGINNER_TO_ADVANCED",
                28,
                4,
                PublishStatus.PUBLISHED
        );
        netCourse.setCoverImageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80");
        netCourse = courseRepository.save(netCourse);
        networksCurriculumData.seedNetworksCurriculum(netCourse);

        logger.info("Successfully seeded all 4 CS courses with 16 modules, module quizzes (10 Qs), and level final quizzes (25 Qs) each.");
    }

    private void seedPlacementKits() {
        if (!seedDemoData || placementKitRepository.count() > 0) {
            return;
        }

        logger.info("Seeding 10 Role-Based Placement Preparation Kits (₹99 per kit)...");

        // 1. Full Stack Developer Kit
        createKit(
                "full-stack-developer-kit",
                "Full Stack Developer Placement Kit",
                "Full Stack Developer",
                "Master React, Node.js, Spring Boot, REST APIs, SQL, System Design, and full-stack technical interview patterns.",
                "Complete role-oriented placement kit for aspiring Full Stack Engineers. Includes end-to-end web architecture, frontend component lifecycles, backend concurrency, database schema normalization, authentication (JWT/OAuth), and real-world system design questions.",
                1,
                "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Frontend & React Architecture", "frontend-react", "Virtual DOM, React Hooks, State Management, and Component Optimization", List.of(
                                new QuestionData("What is the primary difference between state and props in React?", PlacementKitQuestionType.MCQ, "EASY", "Props are immutable and passed from parent to child, while state is mutable and managed internally within the component.", "Props are read-only configuration objects passed down component trees. State represents internal dynamic data that triggers re-rendering upon modification.", true, List.of(
                                        new OptionData("Props are mutable; state is immutable", false),
                                        new OptionData("Props are passed from parent components; state is managed locally", true),
                                        new OptionData("State can only be used in class components", false),
                                        new OptionData("Props trigger re-rendering but state does not", false)
                                )),
                                new QuestionData("Explain how React's Virtual DOM reconciliation algorithm operates.", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "React uses a heuristic O(n) diffing algorithm comparing the previous and next Virtual DOM trees to compute minimal batch DOM mutations.", "React compares element types and keys. When an element type changes, it tears down the entire subtree. With identical types, it only updates changed attributes.", false, List.of()),
                                new QuestionData("What is prop drilling in React and how can it be avoided?", PlacementKitQuestionType.SHORT_ANSWER, "MEDIUM", "Prop drilling is passing props through intermediate components that do not need them. It is avoided using React Context API or state libraries (Redux, Zustand).", "Context provides a way to pass data through the component tree without manually passing props at every level.", false, List.of())
                        )),
                        new CategoryData("Backend Services & REST APIs", "backend-rest", "HTTP protocols, REST constraints, Middleware, and Microservices", List.of(
                                new QuestionData("Which HTTP status code is most appropriate for a resource successfully created on the server?", PlacementKitQuestionType.MCQ, "EASY", "201 Created", "HTTP 201 Created indicates the request succeeded and resulted in a new resource creation with a Location header.", true, List.of(
                                        new OptionData("200 OK", false),
                                        new OptionData("201 Created", true),
                                        new OptionData("202 Accepted", false),
                                        new OptionData("204 No Content", false)
                                )),
                                new QuestionData("Explain the difference between idempotent and non-idempotent HTTP methods.", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "An idempotent HTTP method (GET, PUT, DELETE) produces identical server state regardless of how many times it is executed. POST is non-idempotent.", "In payment and order processing, idempotency keys ensure requests retried over faulty networks do not cause duplicate charges.", false, List.of())
                        )),
                        new CategoryData("Database Design & SQL", "database-sql", "Relational schemas, indexing, ACID transactions, and query optimization", List.of(
                                new QuestionData("What problem does database indexing solve and what is its trade-off?", PlacementKitQuestionType.MCQ, "MEDIUM", "Indexes speed up SELECT queries via B-Trees but slow down INSERT/UPDATE/DELETE writes.", "B-Tree indexes provide O(log N) lookup time at the expense of additional disk storage and index maintenance overhead during write operations.", true, List.of(
                                        new OptionData("Speeds up writes but slows down reads", false),
                                        new OptionData("Speeds up reads at the cost of slower writes and extra storage", true),
                                        new OptionData("Eliminates database deadlocks", false),
                                        new OptionData("Guarantees ACID transactions automatically", false)
                                ))
                        ))
                )
        );

        // 2. Frontend Developer Kit
        createKit(
                "frontend-developer-kit",
                "Frontend Developer Placement Kit",
                "Frontend Developer",
                "Master modern JavaScript (ES6+), React, CSS Layouts, Web Performance, Browser Internals, and DOM APIs.",
                "Targeted preparation for Frontend Engineer and UI/UX Developer roles. Covers JavaScript event loops, closures, promises, React performance profiling, Webpack/Vite bundling, accessibility (a11y), and CSS Grid/Flexbox challenges.",
                2,
                "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("JavaScript Core & Event Loop", "js-event-loop", "Closures, Prototypes, Asynchronous JavaScript, and Microtasks", List.of(
                                new QuestionData("What is the output order of Console logs with setTimeout(0) and Promise.resolve()?", PlacementKitQuestionType.MCQ, "MEDIUM", "Synchronous code -> Microtask (Promise) -> Macrotask (setTimeout)", "Promises resolve in the microtask queue which is drained immediately after synchronous execution and before the macrotask (timer) queue.", true, List.of(
                                        new OptionData("setTimeout -> Promise -> Synchronous", false),
                                        new OptionData("Synchronous -> Promise.resolve -> setTimeout", true),
                                        new OptionData("Promise.resolve -> setTimeout -> Synchronous", false),
                                        new OptionData("Random depending on browser thread speed", false)
                                )),
                                new QuestionData("Explain the concept of Closures in JavaScript with a real-world use case.", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "A closure gives a function access to its outer lexical scope even after the outer function has closed. Used for data privacy, currying, and memoization.", "Closures preserve references to variables in enclosing scopes, enabling factory functions and private module state.", true, List.of()),
                                new QuestionData("What is event bubbling versus event capturing in the DOM?", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "Capturing goes from window down to target element; bubbling travels upwards from target element to window.", "Event delegation relies on event bubbling to handle events on multiple child nodes via a single parent listener.", true, List.of())
                        )),
                        new CategoryData("CSS & Modern Responsive Design", "css-responsive", "Flexbox, Grid, CSS Specificity, and Animation Performance", List.of(
                                new QuestionData("Which CSS property triggers GPU compositing without layout reflow?", PlacementKitQuestionType.MCQ, "MEDIUM", "transform and opacity", "Changing transform or opacity skips Layout and Paint stages, operating directly on the Compositor thread for 60fps animations.", false, List.of(
                                        new OptionData("width and height", false),
                                        new OptionData("top and left", false),
                                        new OptionData("transform and opacity", true),
                                        new OptionData("margin and padding", false)
                                ))
                        ))
                )
        );

        // 3. Backend Developer Kit
        createKit(
                "backend-developer-kit",
                "Backend Developer Placement Kit",
                "Backend Developer",
                "Deep dive into high-concurrency server architecture, caching, distributed locks, database indexing, and API security.",
                "Crafted for Backend Engineer, API Engineer, and Systems Developer interviews. Focuses on concurrency models, multi-threading, Redis caching strategies, connection pooling, SQL transaction isolation levels, and message queues.",
                3,
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Concurrency & Server Architecture", "concurrency-server", "Threads, Locks, Connection Pooling, and Asynchronous I/O", List.of(
                                new QuestionData("What is the difference between optimistic locking and pessimistic locking?", PlacementKitQuestionType.MCQ, "MEDIUM", "Optimistic locking checks for version conflicts on commit; pessimistic locking acquires database row locks upfront.", "Optimistic locking is ideal for high-read/low-contention workloads using a version column, avoiding lock overhead.", true, List.of(
                                        new OptionData("Optimistic locking locks all tables immediately", false),
                                        new OptionData("Optimistic uses version checks on update; pessimistic uses database row locks", true),
                                        new OptionData("Pessimistic locking is only available in NoSQL", false),
                                        new OptionData("They are identical in performance", false)
                                )),
                                new QuestionData("How do you prevent the Cache Stampede (Thundering Herd) problem in high-traffic APIs?", PlacementKitQuestionType.INTERVIEW, "HARD", "Use distributed mutex locking (e.g. Redis Redlock), probabilistic early expiration (XFetch), or background cache pre-warming.", "When a hot key expires, thousands of concurrent requests hit the database simultaneously. Locking ensures only one worker recomputes the cache.", true, List.of()),
                                new QuestionData("Explain the 4 ACID properties in relational database transactions.", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "Atomicity (all-or-nothing), Consistency (rules preserved), Isolation (concurrent safety), Durability (persisted on crash).", "ACID ensures reliable transaction processing even in the event of system failures.", true, List.of())
                        ))
                )
        );

        // 4. App Developer Kit
        createKit(
                "app-developer-kit",
                "Mobile App Developer Placement Kit",
                "App Developer",
                "Comprehensive preparation for Android & Flutter mobile engineering interviews, app lifecycles, state, and offline persistence.",
                "Covers Android Activities/Fragments, ViewModel, Jetpack Compose, Flutter Widgets, InheritedWidget, Bloc/Provider state management, background work managers, local SQLite/Room storage, and mobile performance.",
                4,
                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Mobile Architecture & Lifecycles", "mobile-architecture", "Activity/Fragment Lifecycles, ViewModel, and Process Death", List.of(
                                new QuestionData("Why should long-running asynchronous tasks not hold a direct reference to an Android Activity Context?", PlacementKitQuestionType.MCQ, "MEDIUM", "It causes memory leaks when the Activity is destroyed during configuration changes.", "If a background task outlives the Activity and holds its reference, Garbage Collection cannot reclaim the Activity's memory.", true, List.of(
                                        new OptionData("It causes an immediate ANR (Application Not Responding)", false),
                                        new OptionData("It causes memory leaks because the Activity cannot be garbage collected", true),
                                        new OptionData("Android OS terminates the app process immediately", false),
                                        new OptionData("Context references are automatically cleared by JVM", false)
                                )),
                                new QuestionData("Explain the difference between hot reload and hot restart in Flutter.", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "Hot reload injects updated source code into the running Dart VM preserving app state; hot restart reloads the entire VM destroying state.", "Hot reload significantly speeds up UI iteration by maintaining current widget state.", true, List.of()),
                                new QuestionData("How do you handle offline synchronization in mobile applications?", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "Implement a local-first repository with Room/SQLite, queue mutations in a sync table, and dispatch via WorkManager when network restores.", "Local-first architecture ensures instant UI responsiveness regardless of cellular connectivity.", true, List.of())
                        ))
                )
        );

        // 5. Data Analyst Kit
        createKit(
                "data-analyst-kit",
                "Data Analyst Placement Kit",
                "Data Analyst",
                "Master Advanced SQL (Window Functions, CTEs), Data Wrangling, Statistics, Power BI, Excel, and Business Metrics.",
                "Tailored for Data Analyst, Business Intelligence Engineer, and Analytics Consultant interviews. Focuses on SQL window functions (RANK, DENSE_RANK, LEAD, LAG), aggregate reporting, data cleansing, statistical hypothesis testing, and dashboard storytelling.",
                5,
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Advanced SQL & Window Functions", "sql-analytics", "Window partitions, rolling averages, cohort analysis, and subqueries", List.of(
                                new QuestionData("What is the difference between RANK() and DENSE_RANK() in SQL?", PlacementKitQuestionType.MCQ, "EASY", "RANK() skips rank numbers after duplicate values, while DENSE_RANK() does not skip ranks.", "For values (100, 100, 90), RANK produces 1, 1, 3 whereas DENSE_RANK produces 1, 1, 2.", true, List.of(
                                        new OptionData("RANK is only used for strings; DENSE_RANK for numbers", false),
                                        new OptionData("RANK leaves gaps in sequence for ties; DENSE_RANK maintains consecutive numbering", true),
                                        new OptionData("DENSE_RANK requires an ORDER BY clause but RANK does not", false),
                                        new OptionData("They produce identical outputs in all SQL dialects", false)
                                )),
                                new QuestionData("Write an explanation of how a Common Table Expression (CTE) improves complex query readability.", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "CTEs create temporary named result sets defined with the WITH clause, breaking down deeply nested subqueries into modular readable steps.", "CTEs also enable recursive queries for hierarchical data structures like org charts.", true, List.of()),
                                new QuestionData("How do you detect and handle outliers in a business revenue dataset?", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "Use Interquartile Range (IQR) bounds [Q1 - 1.5*IQR, Q3 + 1.5*IQR] or Z-scores (|Z| > 3). Decide whether to winsorize, investigate data entry errors, or separate genuine anomalies.", "Outliers can severely distort mean and variance metrics, requiring robust medians and segmented analyses.", true, List.of())
                        ))
                )
        );

        // 6. Java Developer Kit
        createKit(
                "java-developer-kit",
                "Java Developer Placement Kit",
                "Java Developer",
                "Crack Java interviews with JVM internals, Garbage Collection, Spring Boot, Collections Framework, and Multithreading.",
                "Designed specifically for Core Java and Java Backend Developer placement drives (TCS, Infosys, Wipro, Cognizant, Amazon, Capgemini). Covers JVM memory spaces (Heap/Metaspace), ConcurrentHashMap, Streams API, Spring Dependency Injection, and Hibernate.",
                6,
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Core Java & JVM Internals", "java-core", "Memory areas, String pool, Immutability, and Garbage Collectors (G1, ZGC)", List.of(
                                new QuestionData("Why is the String class immutable in Java?", PlacementKitQuestionType.MCQ, "EASY", "For Security, Thread Safety, String Pool caching, and HashMap key consistency.", "Immutability allows String literals to be safely shared in the String Constant Pool without concurrency corruption.", true, List.of(
                                        new OptionData("To prevent subclasses from extending Object", false),
                                        new OptionData("For security, caching in the String Pool, thread safety, and hashcode stability", true),
                                        new OptionData("Because Java does not support mutable objects", false),
                                        new OptionData("To reduce memory usage on 32-bit JVMs", false)
                                )),
                                new QuestionData("How does ConcurrentHashMap achieve thread safety in Java 8+ without locking the entire map?", PlacementKitQuestionType.INTERVIEW, "HARD", "It uses CAS (Compare-And-Swap) for empty bucket insertions and synchronized blocks on individual bucket node heads rather than table-wide segment locks.", "This fine-grained bucket-level synchronization allows simultaneous concurrent reads without locking and parallel writes across different hash bins.", true, List.of()),
                                new QuestionData("Explain the difference between fail-fast and fail-safe iterators in Java Collections.", PlacementKitQuestionType.SHORT_ANSWER, "MEDIUM", "Fail-fast iterators throw ConcurrentModificationException if the collection is structurally modified during iteration (e.g. ArrayList). Fail-safe iterators operate on a clone (e.g. CopyOnWriteArrayList).", "Fail-fast iterators use an internal modCount field to detect concurrent modifications immediately.", true, List.of())
                        ))
                )
        );

        // 7. Python Developer Kit
        createKit(
                "python-developer-kit",
                "Python Developer Placement Kit",
                "Python Developer",
                "Master Pythonic programming, GIL internals, Generators, Decorators, FastAPI/Django, and Algorithmic problem solving.",
                "Created for Python Engineer, Backend Python, and Automation Developer placement rounds. Features Python memory management (reference counting & cyclic GC), asyncio event loop, list comprehensions vs generators, and object-oriented Python.",
                7,
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Python Fundamentals & Memory Management", "python-core", "GIL, Generators, Decorators, and Memory Reference Counting", List.of(
                                new QuestionData("What is the Global Interpreter Lock (GIL) in CPython?", PlacementKitQuestionType.MCQ, "MEDIUM", "A mutex that prevents multiple native threads from executing Python bytecodes simultaneously in a single process.", "The GIL ensures thread-safe CPython memory management at the expense of true multi-core parallelism for CPU-bound tasks.", true, List.of(
                                        new OptionData("A security firewall for Python network sockets", false),
                                        new OptionData("A mutex preventing simultaneous multi-threaded Python bytecode execution in CPython", true),
                                        new OptionData("A compiler optimization for faster loop execution", false),
                                        new OptionData("A garbage collector for cyclic references", false)
                                )),
                                new QuestionData("Explain how Python generator functions differ from regular functions using the yield keyword.", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "Regular functions compute all values and return them in memory; generator functions use yield to produce values lazily on-demand saving substantial memory.", "Generators implement the iterator protocol automatically, resuming execution right after the last yield statement.", true, List.of()),
                                new QuestionData("What are Python decorators and how do they work under the hood?", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "A decorator is a callable that takes a function as an argument and returns an enhanced wrapper function without modifying the original source code.", "Decorators leverage first-class functions and closures in Python to add cross-cutting concerns like logging and authentication.", true, List.of())
                        ))
                )
        );

        // 8. QA Automation Engineer Kit
        createKit(
                "qa-automation-engineer-kit",
                "QA Automation Engineer Placement Kit",
                "QA Automation Engineer",
                "Excel in Software Testing, Selenium WebDriver, TestNG, API Testing (Postman/RestAssured), and Automation Frameworks.",
                "Structured for SDET (Software Development Engineer in Test) and QA Automation roles. Covers Page Object Model (POM), XPath/CSS locators, implicit vs explicit waits, test pyramid, test data factories, and CI/CD test execution.",
                8,
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Selenium & Test Automation Frameworks", "selenium-frameworks", "Page Object Model, Waits, Locators, and TestNG Assertions", List.of(
                                new QuestionData("Why is Explicit Wait preferred over Thread.sleep() or Implicit Wait in Selenium?", PlacementKitQuestionType.MCQ, "EASY", "Explicit wait dynamically polls until a specific expected condition is met, avoiding unnecessary delay.", "Thread.sleep halts execution unconditionally, wasting time. Explicit wait checks at polling intervals (default 500ms) and resumes immediately once ready.", true, List.of(
                                        new OptionData("Implicit wait is deprecated in Selenium 4", false),
                                        new OptionData("Explicit wait dynamically polls for specific conditions and proceeds as soon as ready", true),
                                        new OptionData("Thread.sleep speeds up test execution", false),
                                        new OptionData("Explicit wait runs test cases in parallel", false)
                                )),
                                new QuestionData("Explain the Page Object Model (POM) design pattern in test automation.", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "POM creates an object repository for web UI elements. Each web page is represented by a class containing element locators and action methods, decoupling test scripts from UI changes.", "POM enhances test maintenance: when a button ID changes, only the corresponding Page class needs modification.", true, List.of()),
                                new QuestionData("What is the difference between Smoke Testing and Sanity Testing?", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "Smoke testing verifies critical core functionality of a fresh build; Sanity testing verifies specific bug fixes or localized modules after minor changes.", "Smoke tests determine build stability for further testing; sanity tests verify regression on specific features.", true, List.of())
                        ))
                )
        );

        // 9. DevOps Engineer Kit
        createKit(
                "devops-engineer-kit",
                "DevOps Engineer Placement Kit",
                "DevOps Engineer",
                "Master Linux System Administration, Docker, Kubernetes, CI/CD Pipelines (GitHub Actions/Jenkins), and Cloud Basics.",
                "Targeted at Junior DevOps, Cloud Support, and Site Reliability Engineer (SRE) placement drives. Focuses on container lifecycles, Docker multi-stage builds, Linux file permissions, systemd services, Git branching, and zero-downtime rolling deployments.",
                9,
                "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Docker & Containerization", "docker-containers", "Images, Layers, Multi-stage builds, Volumes, and Networking", List.of(
                                new QuestionData("What is the main benefit of Multi-Stage Builds in Docker?", PlacementKitQuestionType.MCQ, "MEDIUM", "Produces lightweight production images by leaving build-time dependencies behind in intermediate stages.", "Multi-stage builds allow compiling code with heavy SDKs in a builder stage and copying only the final binary into a minimal scratch/alpine runtime container.", true, List.of(
                                        new OptionData("Runs multiple containers inside a single pod", false),
                                        new OptionData("Minimizes final image size and reduces attack surface by isolating runtime artifacts", true),
                                        new OptionData("Increases Docker daemon CPU limits", false),
                                        new OptionData("Eliminates the need for docker-compose", false)
                                )),
                                new QuestionData("Explain the difference between a Process and a Container in Linux.", PlacementKitQuestionType.INTERVIEW, "HARD", "A container is a regular Linux process running with isolated Namespaces (PID, Mount, Net) and restricted resource limits enforced by Cgroups.", "Containers do not require hypervisor virtualization or guest OS kernels; they share the host Linux kernel directly.", true, List.of()),
                                new QuestionData("What is the purpose of a Reverse Proxy (such as NGINX) in production deployments?", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "A reverse proxy handles SSL termination, load balancing, request routing, caching, and protects upstream origin servers from direct public access.", "NGINX serves as an edge gateway distributing traffic across backend application instances.", true, List.of())
                        ))
                )
        );

        // 10. General CS Jobs & Placement Kit
        createKit(
                "general-cs-placement-kit",
                "General CS & Campus Placement Kit",
                "General Placement",
                "All-in-one preparation for campus placement drives covering DSA, OS, DBMS, Computer Networks, and Technical HR.",
                "The ultimate master kit for college campus placement drives (Mass Recruiters, Product Companies, and Technical Services). Features high-frequency questions across Core CS subjects: Deadlocks, Indexing, TCP 3-way handshakes, Trees, Graphs, and Behavioral STAR interview techniques.",
                10,
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
                List.of(
                        new CategoryData("Core Computer Science Essentials", "core-cs", "High-frequency interview questions across OS, DBMS, Networks, and DSA", List.of(
                                new QuestionData("Which 4 conditions must hold simultaneously for a Deadlock to occur in an Operating System?", PlacementKitQuestionType.MCQ, "MEDIUM", "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait (Coffman Conditions).", "Eliminating any one of these four Coffman conditions prevents deadlocks from occurring in OS scheduling.", true, List.of(
                                        new OptionData("Starvation, Thrashing, Paging, Fragmentation", false),
                                        new OptionData("Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait", true),
                                        new OptionData("FIFO, Round Robin, Priority, Multilevel Feedback", false),
                                        new OptionData("Read, Write, Execute, Append permissions", false)
                                )),
                                new QuestionData("Explain how the TCP 3-Way Handshake establishes a reliable connection.", PlacementKitQuestionType.INTERVIEW, "MEDIUM", "Client sends SYN (seq=x) -> Server replies SYN-ACK (seq=y, ack=x+1) -> Client sends ACK (ack=y+1). Both sides synchronize sequence numbers before data exchange begins.", "The 3-way handshake prevents duplicate old connection requests from establishing phantom server states.", true, List.of()),
                                new QuestionData("What is the STAR method for behavioral and HR interviews?", PlacementKitQuestionType.SHORT_ANSWER, "EASY", "Situation (context), Task (challenge), Action (your specific initiative), Result (quantifiable outcome).", "The STAR framework structures interview answers concisely to showcase leadership, problem-solving, and impact.", true, List.of())
                        ))
                )
        );

        logger.info("Successfully seeded all 10 Role-Based Placement Preparation Kits with categories, questions, and options.");
    }

    private void createKit(
            String slug,
            String title,
            String role,
            String shortDesc,
            String fullDesc,
            int orderIndex,
            String imageUrl,
            List<CategoryData> categoryDataList
    ) {
        PlacementKit kit = new PlacementKit(slug, title, role, shortDesc, fullDesc, orderIndex);
        kit.setCoverImageUrl(imageUrl);
        kit = placementKitRepository.save(kit);

        int catIndex = 1;
        for (CategoryData cd : categoryDataList) {
            PlacementKitCategory cat = new PlacementKitCategory(kit, cd.title, cd.slug, cd.description, catIndex++);
            cat = placementKitCategoryRepository.save(cat);

            int qIndex = 1;
            for (QuestionData qd : cd.questions) {
                PlacementKitQuestion q = new PlacementKitQuestion(
                        cat, qd.questionText, qd.type, qd.difficulty, qd.modelAnswer, qd.explanation, qIndex++, qd.isSample
                );
                q = placementKitQuestionRepository.save(q);

                if (qd.options != null && !qd.options.isEmpty()) {
                    int optIndex = 1;
                    for (OptionData od : qd.options) {
                        PlacementKitOption opt = new PlacementKitOption(q, od.text, od.isCorrect, optIndex++);
                        placementKitOptionRepository.save(opt);
                    }
                }
            }
        }
    }

    private static class CategoryData {
        String title;
        String slug;
        String description;
        List<QuestionData> questions;

        CategoryData(String title, String slug, String description, List<QuestionData> questions) {
            this.title = title;
            this.slug = slug;
            this.description = description;
            this.questions = questions;
        }
    }

    private static class QuestionData {
        String questionText;
        PlacementKitQuestionType type;
        String difficulty;
        String modelAnswer;
        String explanation;
        boolean isSample;
        List<OptionData> options;

        QuestionData(String questionText, PlacementKitQuestionType type, String difficulty, String modelAnswer, String explanation, boolean isSample, List<OptionData> options) {
            this.questionText = questionText;
            this.type = type;
            this.difficulty = difficulty;
            this.modelAnswer = modelAnswer;
            this.explanation = explanation;
            this.isSample = isSample;
            this.options = options;
        }
    }

    private static class OptionData {
        String text;
        boolean isCorrect;

        OptionData(String text, boolean isCorrect) {
            this.text = text;
            this.isCorrect = isCorrect;
        }
    }
}

