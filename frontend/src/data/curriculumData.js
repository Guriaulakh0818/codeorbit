// =================================================================
// CodeOrbit Comprehensive 20-Domain Curriculum Catalogue
// Each Domain contains 4 Levels: Beginner, Intermediate, Advanced, Placement Ready (₹29)
// =================================================================

export const CURRICULUM_DATA = [
  // 1. JAVA
  {
    id: 1,
    title: 'Java Master Track',
    slug: 'java',
    track: 'LANGUAGES',
    iconEmoji: '☕',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 40,
    orderIndex: 1,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Master Java from core fundamentals to JVM architecture, Spring backend integration, and FAANG interview prep.',
    description: 'Comprehensive 4-tier Java curriculum designed for engineering students and backend developers. Covers OOPs, multithreading, collections, memory management, and placement coding interview questions.',
    subcourses: [
      { id: 101, curriculumLevel: 'BEGINNER', title: 'Java Programming', slug: 'java-programming', description: 'Core syntax, variables, data types, control flow, loops, methods, arrays, and basic problem solving.', isFree: true, priceInr: 0 },
      { id: 102, curriculumLevel: 'INTERMEDIATE', title: 'Advanced Java', slug: 'advanced-java', description: 'OOPs (Inheritance, Polymorphism, Encapsulation, Abstraction), Interfaces, Exception Handling, Collections Framework, and Generics.', isFree: true, priceInr: 0 },
      { id: 103, curriculumLevel: 'ADVANCED', title: 'Java Backend', slug: 'java-backend', description: 'Multithreading, Concurrency, JVM Internals, Garbage Collection, Java 8+ Streams & Lambdas, JDBC & Spring Boot Integration.', isFree: true, priceInr: 0 },
      { id: 104, curriculumLevel: 'PLACEMENT_READY', title: 'Java Interview Prep', slug: 'java-interview-prep', description: 'Top 100 Java placement interview questions, tricky output questions, memory leak debugging, and coding round challenges.', isFree: false, priceInr: 29 }
    ],
    modules: [
      {
        id: 101,
        title: 'Level 1: Java Programming Foundations',
        slug: 'java-programming-foundations',
        description: 'Java syntax, primitive types, control statements, loops, methods, and 1D/2D arrays.',
        orderIndex: 1,
        curriculumLevel: 'BEGINNER',
        status: 'PUBLISHED',
        lessons: [
          {
            id: 1001,
            title: '1.1 Introduction to Java & JVM Architecture',
            slug: 'java-intro-jvm',
            estimatedMinutes: 20,
            orderIndex: 1,
            status: 'PUBLISHED',
            hinglishStatus: 'PUBLISHED',
            contentEn: `# Introduction to Java & JVM Architecture

Java is a robust, class-based, object-oriented programming language designed to follow the **Write Once, Run Anywhere (WORA)** philosophy.

### How Java Executes
1. **Compilation**: \`javac Main.java\` compiles human-readable source code into platform-independent Bytecode (\`.class\` files).
2. **Execution**: The **Java Virtual Machine (JVM)** interprets or JIT-compiles bytecode into native machine instructions for the host operating system.

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Welcome to CodeOrbit Java Track!");
    }
}
\`\`\``,
            contentHinglish: `# Java Aur JVM Ka Introduction 🇮🇳

Java ek bahut popular aur robust Object-Oriented programming language hai jo **Write Once, Run Anywhere (WORA)** rule follow karti hai.

### Java Code Kaise Run Hota Hai?
1. **Compilation**: \`javac\` compiler aapke \`.java\` code ko platform-independent Bytecode (\`.class\`) me convert karta hai.
2. **Execution**: **JVM (Java Virtual Machine)** is bytecode ko machine code me translate karta hai aur execute karta hai.

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("CodeOrbit Java Course me aapka swagat hai!");
    }
}
\`\`\``,
            codeSnippetJava: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`
          }
        ],
        quizzes: []
      },
      {
        id: 102,
        title: 'Level 2: OOPs & Collections Framework',
        slug: 'java-oops-collections',
        description: 'Deep dive into 4 pillars of OOPs, Interfaces, Abstract Classes, Exception Handling, and the Java Collections Framework (ArrayList, HashMap, HashSet).',
        orderIndex: 2,
        curriculumLevel: 'INTERMEDIATE',
        status: 'PUBLISHED',
        lessons: [],
        quizzes: []
      },
      {
        id: 103,
        title: 'Level 3: Java Backend & Multithreading',
        slug: 'java-backend-multithreading',
        description: 'Java Threads, Synchronization, ExecutorService, Streams API, Functional Interfaces, and Spring Boot connection.',
        orderIndex: 3,
        curriculumLevel: 'ADVANCED',
        status: 'PUBLISHED',
        lessons: [],
        quizzes: []
      },
      {
        id: 104,
        title: 'Level 4: Placement Ready — Java Interview Prep (₹29)',
        slug: 'java-placement-ready',
        description: 'Top 100 Java Interview Questions, JVM Memory Leak Debugging, HashCode/Equals contract, and Live Coding Scenarios.',
        orderIndex: 4,
        curriculumLevel: 'PLACEMENT_READY',
        status: 'PUBLISHED',
        lessons: [],
        quizzes: []
      }
    ]
  },

  // 2. PYTHON
  {
    id: 2,
    title: 'Python Master Track',
    slug: 'python',
    track: 'LANGUAGES',
    iconEmoji: '🐍',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 2,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Master Python programming, OOPs, data structures, backend frameworks, and FAANG interview coding.',
    description: 'Complete Python curriculum covering core programming, OOPs, list comprehensions, decorators, generators, asyncio, FastAPI/Flask, and placement interview challenges.',
    subcourses: [
      { id: 201, curriculumLevel: 'BEGINNER', title: 'Python Programming', slug: 'python-programming', description: 'Syntax, variables, conditionals, loops, functions, lists, tuples, dicts, and file handling.', isFree: true, priceInr: 0 },
      { id: 202, curriculumLevel: 'INTERMEDIATE', title: 'OOP & Libraries', slug: 'oop-and-libraries', description: 'Classes, Objects, Inheritance, Magic Dunder Methods, Decorators, Generators, NumPy, and Pandas.', isFree: true, priceInr: 0 },
      { id: 203, curriculumLevel: 'ADVANCED', title: 'Python Development', slug: 'python-development', description: 'Asyncio, Multiprocessing, Metaclasses, REST APIs with FastAPI/Flask, and PyTest automated testing.', isFree: true, priceInr: 0 },
      { id: 204, curriculumLevel: 'PLACEMENT_READY', title: 'Python Interview Prep', slug: 'python-interview-prep', description: 'Top Python interview questions, tricky output questions, DSA in Python, and machine coding challenges.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 3. C++
  {
    id: 3,
    title: 'C++ Programming Track',
    slug: 'cpp',
    track: 'LANGUAGES',
    iconEmoji: '💻',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 40,
    orderIndex: 3,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Master modern C++, pointers, memory management, STL containers, templates, and low-latency interview prep.',
    description: 'Complete C++ track for competitive programmers, systems engineers, and placement candidates. Covers syntax, pointers, STL, OOP, memory management, and technical interview problems.',
    subcourses: [
      { id: 301, curriculumLevel: 'BEGINNER', title: 'C++ Programming', slug: 'cpp-programming', description: 'Basic syntax, data types, operators, conditionals, loops, functions, arrays, and pointer fundamentals.', isFree: true, priceInr: 0 },
      { id: 302, curriculumLevel: 'INTERMEDIATE', title: 'STL & OOP', slug: 'stl-and-oop', description: 'Standard Template Library (Vectors, Maps, Sets, Queues, Iterators, Algorithms), Classes, Constructors, and Inheritance.', isFree: true, priceInr: 0 },
      { id: 303, curriculumLevel: 'ADVANCED', title: 'Advanced C++', slug: 'advanced-cpp', description: 'Smart Pointers (unique_ptr, shared_ptr), Move Semantics, RAII, Templates, Multithreading, and C++20 features.', isFree: true, priceInr: 0 },
      { id: 304, curriculumLevel: 'PLACEMENT_READY', title: 'C++ Interview Prep', slug: 'cpp-interview-prep', description: 'Virtual tables, memory layout, low-latency coding patterns, pointer arithmetic, and top product company coding rounds.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 4. WEB DEVELOPMENT
  {
    id: 4,
    title: 'Full-Stack Web Development',
    slug: 'web-development',
    track: 'WEB',
    iconEmoji: '🌐',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 45,
    orderIndex: 4,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From HTML/CSS basics to modern JavaScript, Node.js backend, and frontend machine coding rounds.',
    description: 'Master web development from semantic HTML5 and responsive CSS Grid/Flexbox to JavaScript ES6+, asynchronous programming, Node.js/Express, REST APIs, and frontend interview machine coding.',
    subcourses: [
      { id: 401, curriculumLevel: 'BEGINNER', title: 'HTML & CSS', slug: 'html-and-css', description: 'Semantic HTML5, CSS Grid, Flexbox, Responsive Design, CSS Variables, Animations, and Web Accessibility.', isFree: true, priceInr: 0 },
      { id: 402, curriculumLevel: 'INTERMEDIATE', title: 'JavaScript', slug: 'javascript', description: 'ES6+ syntax, DOM manipulation, Event Loop, Closures, Scopes, Promises, Async/Await, and Fetch API.', isFree: true, priceInr: 0 },
      { id: 403, curriculumLevel: 'ADVANCED', title: 'Full-Stack Web Development', slug: 'full-stack-web-dev', description: 'Node.js, Express, REST APIs, JWT Authentication, CORS, Web Security, Performance Optimization, and SSR.', isFree: true, priceInr: 0 },
      { id: 404, curriculumLevel: 'PLACEMENT_READY', title: 'Frontend Interview Prep', slug: 'frontend-interview-prep', description: 'Machine coding rounds, Polyfills (Promise.all, Array.map), Debounce/Throttle, Critical Rendering Path, and UI Design rounds.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 5. REACT
  {
    id: 5,
    title: 'React.js Master Track',
    slug: 'react',
    track: 'WEB',
    iconEmoji: '⚛️',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 5,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From React JSX & Hooks to Server Components, Redux/Zustand, and frontend machine coding interviews.',
    description: 'Master React from JSX, Components, and Hooks to advanced state management, React Fiber reconciliation, performance profiling, and machine coding placement rounds.',
    subcourses: [
      { id: 501, curriculumLevel: 'BEGINNER', title: 'React Basics', slug: 'react-basics', description: 'JSX syntax, Functional Components, Props, State with useState, Event Handling, and Conditional Rendering.', isFree: true, priceInr: 0 },
      { id: 502, curriculumLevel: 'INTERMEDIATE', title: 'React Development', slug: 'react-development', description: 'Hooks (useEffect, useRef, useMemo, useCallback), Custom Hooks, Context API, React Router DOM, and Forms.', isFree: true, priceInr: 0 },
      { id: 503, curriculumLevel: 'ADVANCED', title: 'Advanced React', slug: 'advanced-react', description: 'React Fiber architecture, Server Components, State Management (Redux Toolkit, Zustand), Code Splitting, and Suspense.', isFree: true, priceInr: 0 },
      { id: 504, curriculumLevel: 'PLACEMENT_READY', title: 'React Interview Prep', slug: 'react-interview-prep', description: 'React reconciliation interview questions, machine coding component rounds (Autocomplete, Infinite Scroll, Star Rating), and performance tuning.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 6. SPRING & SPRING BOOT
  {
    id: 6,
    title: 'Spring & Spring Boot Track',
    slug: 'spring-boot',
    track: 'BACKEND',
    iconEmoji: '🌱',
    difficultyLevel: 'INTERMEDIATE_TO_ADVANCED',
    estimatedHours: 40,
    orderIndex: 6,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From Spring IoC/DI to Spring Boot REST APIs, Microservices with Spring Cloud, and backend interviews.',
    description: 'Master enterprise Java with Spring Boot. Covers Dependency Injection, Spring Data JPA, Hibernate, Microservices Architecture, API Gateway, Circuit Breakers, and Spring interview prep.',
    subcourses: [
      { id: 601, curriculumLevel: 'BEGINNER', title: 'Spring Basics', slug: 'spring-basics', description: 'Inversion of Control (IoC), Dependency Injection (DI), Spring Beans Lifecycle, ApplicationContext, and Spring AOP.', isFree: true, priceInr: 0 },
      { id: 602, curriculumLevel: 'INTERMEDIATE', title: 'Spring Boot', slug: 'spring-boot-core', description: 'Spring Boot Starters, Auto-configuration, REST Controllers, Spring Data JPA, Hibernate, Validations, and Exception Handling.', isFree: true, priceInr: 0 },
      { id: 603, curriculumLevel: 'ADVANCED', title: 'Spring Boot Microservices', slug: 'spring-boot-microservices', description: 'Spring Cloud, Eureka Service Discovery, API Gateway, OpenFeign, Resilience4j Circuit Breakers, Distributed Tracing, and Kafka integration.', isFree: true, priceInr: 0 },
      { id: 604, curriculumLevel: 'PLACEMENT_READY', title: 'Spring Boot Interview Prep', slug: 'spring-boot-interview-prep', description: 'Spring Bean Lifecycle, Transaction Propagation (@Transactional), Spring Security JWT architecture, and Real-world Microservices design questions.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 7. SQL
  {
    id: 7,
    title: 'SQL & Database Engineering',
    slug: 'sql',
    track: 'DATABASE',
    iconEmoji: '🗄️',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 30,
    orderIndex: 7,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From basic queries and Joins to Window Functions, Query Execution Plans, and top SQL interview questions.',
    description: 'Comprehensive SQL curriculum covering DDL/DML, complex Joins, CTEs, Window Functions (ROW_NUMBER, RANK, LEAD/LAG), Indexing, Query Optimization, and LeetCode SQL challenges.',
    subcourses: [
      { id: 701, curriculumLevel: 'BEGINNER', title: 'SQL Fundamentals', slug: 'sql-fundamentals', description: 'DDL, DML, SELECT, WHERE, GROUP BY, HAVING, Aggregate Functions (COUNT, SUM, AVG), ORDER BY, and LIMIT.', isFree: true, priceInr: 0 },
      { id: 702, curriculumLevel: 'INTERMEDIATE', title: 'Advanced SQL', slug: 'advanced-sql', description: 'Joins (Inner, Left, Right, Full, Cross), Subqueries, Common Table Expressions (CTEs), and Window Functions (ROW_NUMBER, DENSE_RANK, LAG, LEAD).', isFree: true, priceInr: 0 },
      { id: 703, curriculumLevel: 'ADVANCED', title: 'Database Design', slug: 'database-design', description: 'Relational Schema Design, Normalization (1NF to BCNF), Indexing (B-Tree, Hash), Partitioning, and Query Execution Plans (EXPLAIN ANALYZE).', isFree: true, priceInr: 0 },
      { id: 704, curriculumLevel: 'PLACEMENT_READY', title: 'SQL Interview Prep', slug: 'sql-interview-prep', description: 'Top 50 Product Company SQL Query Challenges, LeetCode Hard SQL, Concurrency, Deadlocks, and High-Performance Query Optimization.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 8. DATA STRUCTURES & ALGORITHMS (DSA)
  {
    id: 8,
    title: 'Data Structures & Algorithms (DSA) Master Track',
    slug: 'dsa',
    track: 'DSA',
    iconEmoji: '🧠',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 45,
    orderIndex: 8,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Zero-to-Hero DSA curriculum for CSE engineering students and product placement interview preparation.',
    description: 'Comprehensive master curriculum covering algorithmic complexity, linear data structures, trees, graphs, dynamic programming, and top interview patterns with verified code examples and assessments in English & Hinglish.',
    subcourses: [
      { id: 801, curriculumLevel: 'BEGINNER', title: 'DSA Fundamentals', slug: 'dsa-fundamentals', description: 'Time & Space Complexity, Big-O Notation, Arrays, Strings, Two Pointers, Sliding Window, and Recursion.', isFree: true, priceInr: 0 },
      { id: 802, curriculumLevel: 'INTERMEDIATE', title: 'Intermediate DSA', slug: 'intermediate-dsa', description: 'Linked Lists, Stacks, Queues, Binary Trees, Binary Search Trees, Heaps / Priority Queues, and Hashing.', isFree: true, priceInr: 0 },
      { id: 803, curriculumLevel: 'ADVANCED', title: 'Advanced DSA', slug: 'advanced-dsa', description: 'Graphs (BFS, DFS, Dijkstra, Bellman-Ford, Kruskal), Dynamic Programming (1D, 2D, Knapsack, LCS, LIS), Tries, and Backtracking.', isFree: true, priceInr: 0 },
      { id: 804, curriculumLevel: 'PLACEMENT_READY', title: 'DSA Placement Prep', slug: 'dsa-placement-prep', description: 'Top 250 FAANG Coding Patterns, Blind 75 / NeetCode 150 In-depth Walkthroughs, and Live Mock Coding Rounds.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 9. SYSTEM DESIGN
  {
    id: 9,
    title: 'System Design & Distributed Systems',
    slug: 'system-design',
    track: 'SYSTEM_DESIGN',
    iconEmoji: '🏗️',
    difficultyLevel: 'INTERMEDIATE_TO_ADVANCED',
    estimatedHours: 40,
    orderIndex: 9,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From LLD design patterns to HLD distributed caching, sharding, message queues, and FAANG architectural rounds.',
    description: 'Master Low-Level Design (LLD with SOLID principles and design patterns) and High-Level Design (HLD for scalable web apps like URL Shortener, Uber, WhatsApp, Netflix, and Amazon).',
    subcourses: [
      { id: 901, curriculumLevel: 'BEGINNER', title: 'Fundamentals', slug: 'system-design-fundamentals', description: 'Client-Server Architecture, Monolith vs Microservices, Vertical vs Horizontal Scaling, Load Balancers, DNS, and CDNs.', isFree: true, priceInr: 0 },
      { id: 902, curriculumLevel: 'INTERMEDIATE', title: 'LLD', slug: 'lld', description: 'Low-Level Design, SOLID Principles, Design Patterns (Singleton, Factory, Strategy, Observer, Decorator), UML Class Diagrams, and Schema Design.', isFree: true, priceInr: 0 },
      { id: 903, curriculumLevel: 'ADVANCED', title: 'HLD', slug: 'hld', description: 'High-Level Design, Distributed Caching (Redis), Database Sharding, Message Queues (Kafka/RabbitMQ), CAP Theorem, and Rate Limiters.', isFree: true, priceInr: 0 },
      { id: 904, curriculumLevel: 'PLACEMENT_READY', title: 'System Design Interview', slug: 'system-design-interview', description: 'Designing URL Shortener, Uber/Ola Dispatch, WhatsApp Chat, YouTube Video Streaming, and Amazon E-Commerce System.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 10. LINUX
  {
    id: 10,
    title: 'Linux & Shell Administration',
    slug: 'linux',
    track: 'DEVOPS',
    iconEmoji: '🐧',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 25,
    orderIndex: 10,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Master Linux terminal commands, bash scripting, system administration, kernel internals, and DevOps interview prep.',
    description: 'Complete Linux guide from fundamental commands and permissions to advanced bash scripting, process management, systemd services, kernel subsystems, and live server debugging.',
    subcourses: [
      { id: 1001, curriculumLevel: 'BEGINNER', title: 'Linux Basics', slug: 'linux-basics', description: 'Linux Filesystem Hierarchy, Commands (ls, cd, cp, mv, rm), Permissions (chmod, chown), grep, find, and piping.', isFree: true, priceInr: 0 },
      { id: 1002, curriculumLevel: 'INTERMEDIATE', title: 'Shell & Administration', slug: 'shell-and-administration', description: 'Bash Shell Scripting, Cron Jobs, Process Management (ps, top, kill), Systemd Services, and Network Tools (curl, netstat, ssh).', isFree: true, priceInr: 0 },
      { id: 1003, curriculumLevel: 'ADVANCED', title: 'Linux Internals', slug: 'linux-internals', description: 'Kernel Architecture, System Calls, Virtual Memory, Inodes, File Descriptors, IPC, and Cgroups / Namespaces for containers.', isFree: true, priceInr: 0 },
      { id: 1004, curriculumLevel: 'PLACEMENT_READY', title: 'Linux Interview Prep', slug: 'linux-interview-prep', description: 'Production server incident debugging, CPU/Memory bottleneck troubleshooting, log parsing with sed/awk, and DevOps technical rounds.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 11. GIT
  {
    id: 11,
    title: 'Git & Version Control Mastery',
    slug: 'git',
    track: 'DEVOPS',
    iconEmoji: '🔧',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 20,
    orderIndex: 11,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Master Git from basic commits and branches to interactive rebasing, bisect, Git hooks, and team workflows.',
    description: 'Comprehensive Git and GitHub training. Covers commits, branching strategies, conflict resolution, interactive rebasing, cherry-pick, reflog recovery, and CI/CD GitHub Actions.',
    subcourses: [
      { id: 1101, curriculumLevel: 'BEGINNER', title: 'Git Basics', slug: 'git-basics', description: 'Version control concepts, init, clone, add, commit, status, log, diff, and .gitignore configuration.', isFree: true, priceInr: 0 },
      { id: 1102, curriculumLevel: 'INTERMEDIATE', title: 'Git & GitHub', slug: 'git-and-github', description: 'Branching, Merging, Merge Conflicts, Pull Requests, Forking, Remote Remotes, Git Stash, and Tags.', isFree: true, priceInr: 0 },
      { id: 1103, curriculumLevel: 'ADVANCED', title: 'Advanced Git', slug: 'advanced-git', description: 'Interactive Rebase, Git Cherry-pick, Git Bisect for bug isolation, Reflog recovery, Submodules, Git Hooks, and GitHub Actions.', isFree: true, priceInr: 0 },
      { id: 1104, curriculumLevel: 'PLACEMENT_READY', title: 'Git Interview Prep', slug: 'git-interview-prep', description: 'Real-world Git disaster recovery, Trunk-based vs GitFlow branching, merge conflict resolution in live tests, and automation workflows.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 12. CLOUD COMPUTING
  {
    id: 12,
    title: 'Cloud Computing (AWS / Azure)',
    slug: 'cloud-computing',
    track: 'CLOUD',
    iconEmoji: '☁️',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 12,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From Cloud fundamentals to AWS/Azure core infrastructure, serverless architecture, and cloud interview prep.',
    description: 'Master Cloud computing concepts, AWS services (EC2, S3, RDS, Lambda, VPC, IAM), Azure cloud architecture, high availability, multi-region scaling, and cloud engineer interview questions.',
    subcourses: [
      { id: 1201, curriculumLevel: 'BEGINNER', title: 'Cloud Fundamentals', slug: 'cloud-fundamentals', description: 'IaaS vs PaaS vs SaaS, Public/Private Cloud, Regions, Availability Zones, Shared Responsibility Model, and Cloud Economics.', isFree: true, priceInr: 0 },
      { id: 1202, curriculumLevel: 'INTERMEDIATE', title: 'AWS/Azure', slug: 'aws-azure', description: 'AWS EC2, S3, RDS, Lambda, VPC, IAM Policies, Security Groups, Azure Virtual Machines, Blob Storage, and CloudWatch.', isFree: true, priceInr: 0 },
      { id: 1203, curriculumLevel: 'ADVANCED', title: 'Cloud Architecture', slug: 'cloud-architecture', description: 'Well-Architected Framework, Auto-scaling, Multi-region Disaster Recovery, Serverless Microservices, and CloudFront CDNs.', isFree: true, priceInr: 0 },
      { id: 1204, curriculumLevel: 'PLACEMENT_READY', title: 'Cloud Interview Prep', slug: 'cloud-interview-prep', description: 'Cloud Cost Optimization, Resilient Architecture Scenarios, Cloud Migration Strategies, and AWS/Azure Solutions Architect Q&A.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 13. TESTING & QA
  {
    id: 13,
    title: 'Software Testing & Automation',
    slug: 'software-testing',
    track: 'TESTING',
    iconEmoji: '🧪',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 30,
    orderIndex: 13,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From Manual Testing and Selenium to Cypress/Playwright, API automation, and QA interview preparation.',
    description: 'Complete QA path covering STLC, Test Cases, Selenium WebDriver, Page Object Model (POM), REST Assured API Testing, Cypress/Playwright automation, and QA placement interviews.',
    subcourses: [
      { id: 1301, curriculumLevel: 'BEGINNER', title: 'Software Testing Basics', slug: 'software-testing-basics', description: 'STLC, Manual Testing, Test Case Writing, Black Box vs White Box Testing, Unit vs Integration Testing, and Bug Lifecycle.', isFree: true, priceInr: 0 },
      { id: 1302, curriculumLevel: 'INTERMEDIATE', title: 'Selenium', slug: 'selenium', description: 'Selenium WebDriver, Locators (XPath, CSS), TestNG / JUnit Framework, Page Object Model (POM), and Data-Driven Testing.', isFree: true, priceInr: 0 },
      { id: 1303, curriculumLevel: 'ADVANCED', title: 'Automation Testing', slug: 'automation-testing', description: 'API Testing with Postman & RestAssured, Cypress / Playwright, CI/CD Pipeline Test Execution, and Performance Testing with JMeter.', isFree: true, priceInr: 0 },
      { id: 1304, curriculumLevel: 'PLACEMENT_READY', title: 'QA Interview Prep', slug: 'qa-interview-prep', description: 'Test Automation Framework Design Machine Tests, Test Estimation, Complex Scenario Bug Isolation, and QA Lead Technical Rounds.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 14. DBMS
  {
    id: 14,
    title: 'Database Management Systems (DBMS)',
    slug: 'dbms',
    track: 'CORE_CS',
    iconEmoji: '📊',
    difficultyLevel: 'INTERMEDIATE',
    estimatedHours: 28,
    orderIndex: 14,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Relational Model, Normalization, ACID Transactions, B+ Trees, and SQL Optimization.',
    description: 'In-depth database management system theory, relational schema design, indexing strategies, and concurrency control.',
    subcourses: [
      { id: 1401, curriculumLevel: 'BEGINNER', title: 'DBMS Fundamentals', slug: 'dbms-fundamentals', description: 'Relational Model, ER Diagrams, Relational Algebra, DDL/DML, Primary & Foreign Keys, and Integrity Constraints.', isFree: true, priceInr: 0 },
      { id: 1402, curriculumLevel: 'INTERMEDIATE', title: 'Transactions & Indexing', slug: 'transactions-and-indexing', description: 'ACID Properties, Schedule Serializability, Concurrency Control (2PL), Deadlock Detection, and B-Trees & B+ Trees.', isFree: true, priceInr: 0 },
      { id: 1403, curriculumLevel: 'ADVANCED', title: 'Database Internals', slug: 'database-internals', description: 'Storage Engine Mechanics, Buffer Pool Management, Write-Ahead Logging (WAL), MVCC, and Distributed Databases & 2PC.', isFree: true, priceInr: 0 },
      { id: 1404, curriculumLevel: 'PLACEMENT_READY', title: 'DBMS Interview Prep', slug: 'dbms-interview-prep', description: 'Database Normalization Deep Dives, Transaction Isolation Levels (Read Uncommitted to Serializable), and Index Tuning.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 15. OPERATING SYSTEMS
  {
    id: 15,
    title: 'Operating Systems (OS) Core Fundamentals',
    slug: 'operating-systems',
    track: 'CORE_CS',
    iconEmoji: '🖥️',
    difficultyLevel: 'INTERMEDIATE',
    estimatedHours: 25,
    orderIndex: 15,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Processes, Threads, CPU Scheduling, Deadlocks, Memory Management, and Virtual Memory.',
    description: 'Master operating system internals for university semester exams and technical interview questions at top product companies.',
    subcourses: [
      { id: 1501, curriculumLevel: 'BEGINNER', title: 'Operating Systems Basics', slug: 'os-basics', description: 'OS Architecture, Dual-Mode Operation (User vs Kernel), System Calls, Process States, and Process Control Block (PCB).', isFree: true, priceInr: 0 },
      { id: 1502, curriculumLevel: 'INTERMEDIATE', title: 'Processes & Threads', slug: 'processes-and-threads-tier', description: 'Multithreading, CPU Scheduling (FCFS, SJF, Round Robin), Inter-Process Communication (IPC), and Synchronization.', isFree: true, priceInr: 0 },
      { id: 1503, curriculumLevel: 'ADVANCED', title: 'OS Internals', slug: 'os-internals', description: 'Memory Management (Paging, Segmentation), Virtual Memory, Page Replacement (FIFO, LRU), File Systems, and Inodes.', isFree: true, priceInr: 0 },
      { id: 1504, curriculumLevel: 'PLACEMENT_READY', title: 'OS Interview Prep', slug: 'os-interview-prep', description: 'Top 50 Core OS Interview Questions, Semaphore vs Mutex Implementation, Thrashing calculations, and Kernel Space concepts.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 16. COMPUTER NETWORKS
  {
    id: 16,
    title: 'Computer Networks (CN) & Protocols',
    slug: 'computer-networks',
    track: 'CORE_CS',
    iconEmoji: '🌐',
    difficultyLevel: 'INTERMEDIATE',
    estimatedHours: 22,
    orderIndex: 16,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'OSI 7-Layer Model, TCP/IP, Routing Algorithms, DNS, HTTP/HTTPS, and Socket Programming.',
    description: 'Complete networking curriculum designed for computer science students covering packet routing, congestion control, and application layer protocols.',
    subcourses: [
      { id: 1601, curriculumLevel: 'BEGINNER', title: 'Computer Networks Basics', slug: 'cn-basics', description: 'OSI 7-Layer Architecture, TCP/IP Protocol Suite, Network Topologies, Physical & Data Link Layer, and Framing & CRC.', isFree: true, priceInr: 0 },
      { id: 1602, curriculumLevel: 'INTERMEDIATE', title: 'TCP/IP', slug: 'tcp-ip', description: 'IPv4 & IPv6 Addressing, Subnetting & CIDR, TCP 3-Way Handshake, TCP Congestion Control (Tahoe, Reno), and UDP vs TCP.', isFree: true, priceInr: 0 },
      { id: 1603, curriculumLevel: 'ADVANCED', title: 'Network Security', slug: 'network-security', description: 'HTTP/1.1 vs HTTP/2 vs HTTP/3, DNS, SSL/TLS Handshake, Asymmetric Cryptography (RSA/AES), Firewalls, and WebSockets.', isFree: true, priceInr: 0 },
      { id: 1604, curriculumLevel: 'PLACEMENT_READY', title: 'CN Interview Prep', slug: 'cn-interview-prep', description: 'What happens when you type google.com in a browser?, Packet Sniffing with Wireshark, and High-Throughput Socket Programming.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 17. CYBER SECURITY
  {
    id: 17,
    title: 'Cyber Security & Ethical Hacking',
    slug: 'cyber-security',
    track: 'SECURITY',
    iconEmoji: '🔐',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 17,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From security fundamentals and OWASP Top 10 to penetration testing and security analyst interviews.',
    description: 'Master Cyber Security principles, encryption algorithms, web vulnerability assessment (SQLi, XSS, CSRF), penetration testing, network sniffing, and security engineering interview prep.',
    subcourses: [
      { id: 1701, curriculumLevel: 'BEGINNER', title: 'Security Fundamentals', slug: 'security-fundamentals', description: 'CIA Triad, Threat Modeling, Symmetric & Asymmetric Encryption, Hashing (SHA-256 vs Bcrypt), Authentication, and Authorization.', isFree: true, priceInr: 0 },
      { id: 1702, curriculumLevel: 'INTERMEDIATE', title: 'Web Security', slug: 'web-security', description: 'OWASP Top 10 (SQL Injection, XSS, CSRF, SSRF, IDOR), Security Headers (CSP, CORS, HSTS), and Session Hijacking.', isFree: true, priceInr: 0 },
      { id: 1703, curriculumLevel: 'ADVANCED', title: 'Ethical Security', slug: 'ethical-security', description: 'Penetration Testing Methodology, Burp Suite, Network Vulnerability Scanning (Nmap), Zero Trust Architecture, and SOC SIEM.', isFree: true, priceInr: 0 },
      { id: 1704, curriculumLevel: 'PLACEMENT_READY', title: 'Security Interview Prep', slug: 'security-interview-prep', description: 'Incident Response Playbooks, Vulnerability Remediation Live Tasks, Secure Code Review Challenges, and Security Analyst Q&A.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 18. AI & MACHINE LEARNING
  {
    id: 18,
    title: 'Artificial Intelligence & Machine Learning',
    slug: 'ai-ml',
    track: 'AI_DATA',
    iconEmoji: '🤖',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 45,
    orderIndex: 18,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From Python math fundamentals and Scikit-Learn to Deep Learning Neural Networks and ML interviews.',
    description: 'Master AI & ML from data exploration, Regression, Classification, and Clustering to Deep Learning with PyTorch, CNNs, Transformers, LLMs, and Machine Learning engineer interview preparation.',
    subcourses: [
      { id: 1801, curriculumLevel: 'BEGINNER', title: 'AI Fundamentals', slug: 'ai-fundamentals', description: 'Introduction to AI, Linear Algebra, Probability & Statistics, Exploratory Data Analysis with Pandas and Matplotlib.', isFree: true, priceInr: 0 },
      { id: 1802, curriculumLevel: 'INTERMEDIATE', title: 'Machine Learning', slug: 'machine-learning', description: 'Supervised Learning (Linear/Logistic Regression, Decision Trees, Random Forests, SVM), Unsupervised (K-Means, PCA), and Scikit-Learn.', isFree: true, priceInr: 0 },
      { id: 1803, curriculumLevel: 'ADVANCED', title: 'Deep Learning', slug: 'deep-learning', description: 'Neural Networks, Backpropagation, CNNs for Vision, Transformers Architecture, PyTorch/TensorFlow, and Large Language Models (LLMs).', isFree: true, priceInr: 0 },
      { id: 1804, curriculumLevel: 'PLACEMENT_READY', title: 'AI/ML Interview Prep', slug: 'ai-ml-interview-prep', description: 'Model Evaluation Metrics (ROC-AUC, Precision/Recall), Overfitting mitigation, and Real-world ML System Design (Recommendation Systems).', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 19. DATA ANALYTICS
  {
    id: 19,
    title: 'Data Analytics & Business Intelligence',
    slug: 'data-analytics',
    track: 'AI_DATA',
    iconEmoji: '📈',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 19,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From Advanced Excel and SQL to Power BI dashboards, Python analytics, and Data Analyst placement prep.',
    description: 'Complete Data Analyst track covering Excel modeling, Pivot tables, SQL analytics, Power BI / Tableau dashboards, DAX, Python data wrangling, and product business case study interviews.',
    subcourses: [
      { id: 1901, curriculumLevel: 'BEGINNER', title: 'Excel & Analytics', slug: 'excel-and-analytics', description: 'Advanced Excel (VLOOKUP, XLOOKUP, INDEX/MATCH), Pivot Tables, Conditional Formatting, Data Cleaning, and Descriptive Statistics.', isFree: true, priceInr: 0 },
      { id: 1902, curriculumLevel: 'INTERMEDIATE', title: 'SQL + Power BI', slug: 'sql-power-bi', description: 'Data Warehousing, Star & Snowflake Schemas, DAX Functions in Power BI, Interactive Dashboard Creation, and KPI Tracking.', isFree: true, priceInr: 0 },
      { id: 1903, curriculumLevel: 'ADVANCED', title: 'Data Analytics', slug: 'advanced-data-analytics', description: 'Python for Analytics, Hypothesis Testing, A/B Testing, Cohort Analysis, Predictive Analytics, and Automated Reporting.', isFree: true, priceInr: 0 },
      { id: 1904, curriculumLevel: 'PLACEMENT_READY', title: 'Data Analyst Placement', slug: 'data-analyst-placement', description: 'Business Case Studies, Metric Tree Decomposition, Product Analytics (CAC, LTV, Churn), and Live SQL Interview Tasks.', isFree: false, priceInr: 29 }
    ],
    modules: []
  },

  // 20. FLUTTER
  {
    id: 20,
    title: 'Flutter & Cross-Platform Mobile Dev',
    slug: 'flutter',
    track: 'MOBILE',
    iconEmoji: '📱',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 20,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From Dart fundamentals and Flutter widgets to Bloc state management, clean architecture, and mobile interview prep.',
    description: 'Master cross-platform mobile development for iOS & Android with Flutter and Dart. Covers widget trees, REST APIs, local storage, Bloc/Provider state management, and mobile interview coding.',
    subcourses: [
      { id: 2001, curriculumLevel: 'BEGINNER', title: 'Flutter Basics', slug: 'flutter-basics', description: 'Dart Language Fundamentals, Widget Tree, Stateless vs Stateful Widgets, Layouts (Row, Column, Stack), and Asset Handling.', isFree: true, priceInr: 0 },
      { id: 2002, curriculumLevel: 'INTERMEDIATE', title: 'App Development', slug: 'app-development', description: 'Navigation & Routing, Forms & Validations, REST API Integration with Dio/Http, Local Storage with Hive/SharedPreferences, and Animations.', isFree: true, priceInr: 0 },
      { id: 2003, curriculumLevel: 'ADVANCED', title: 'Advanced Flutter', slug: 'advanced-flutter', description: 'State Management (Bloc, Provider, Riverpod), Clean Architecture in Flutter, Native Platform Channels, and Performance Profiling.', isFree: true, priceInr: 0 },
      { id: 2004, curriculumLevel: 'PLACEMENT_READY', title: 'Flutter Interview Prep', slug: 'flutter-interview-prep', description: 'Flutter RenderObject & Element Tree internals, App Store / Play Store release pipeline, and Mobile Machine Coding Rounds.', isFree: false, priceInr: 29 }
    ],
    modules: []
  }
];

export const TECH_DOMAINS = [
  { id: 'JAVA', name: 'Java', icon: '☕' },
  { id: 'PYTHON', name: 'Python', icon: '🐍' },
  { id: 'CPP', name: 'C++', icon: '💻' },
  { id: 'WEB', name: 'Web Dev', icon: '🌐' },
  { id: 'REACT', name: 'React', icon: '⚛️' },
  { id: 'SPRING', name: 'Spring Boot', icon: '☕' },
  { id: 'NODE', name: 'Node.js', icon: '🟢' },
  { id: 'DSA', name: 'DSA', icon: '📊' },
  { id: 'DBMS', name: 'DBMS & SQL', icon: '🗄️' },
  { id: 'SYSTEM_DESIGN', name: 'System Design', icon: '🏗️' },
  { id: 'OS', name: 'Operating Systems', icon: '⚙️' },
  { id: 'NETWORKS', name: 'Computer Networks', icon: '🌐' },
  { id: 'DEVOPS', name: 'DevOps & Docker', icon: '🐳' },
  { id: 'CLOUD', name: 'Cloud Computing', icon: '☁️' },
  { id: 'AI_ML', name: 'AI & Machine Learning', icon: '🤖' },
  { id: 'CYBERSECURITY', name: 'Cybersecurity', icon: '🔒' },
  { id: 'GIT', name: 'Git & GitHub', icon: '🐙' },
  { id: 'LINUX', name: 'Linux Mastery', icon: '🐧' },
  { id: 'DATA_ANALYTICS', name: 'Data Analytics', icon: '📈' },
  { id: 'FLUTTER', name: 'Flutter & Mobile', icon: '📱' }
];

export default CURRICULUM_DATA;
