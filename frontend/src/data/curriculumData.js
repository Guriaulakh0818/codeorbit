// =================================================================
// CodeOrbit Comprehensive 20-Domain Curriculum Catalogue
// Each Domain contains 4 Levels: Beginner (4 Modules), Intermediate (4 Modules), 
// Advanced (4 Modules), Placement Ready ₹29 (4 Modules) = 16 Modules Total per Domain!
// =================================================================

// Helper to create standardized 16 modules per domain (4 per tier)
function build16Modules(courseId, domainName, prefixSlug, tier1Concepts, tier2Concepts, tier3Concepts, tier4Concepts) {
  const levels = [
    {
      level: 'BEGINNER',
      tierName: `${domainName} Beginner Foundations`,
      modules: tier1Concepts
    },
    {
      level: 'INTERMEDIATE',
      tierName: `${domainName} Core & Intermediate`,
      modules: tier2Concepts
    },
    {
      level: 'ADVANCED',
      tierName: `${domainName} Advanced Mastery & Systems`,
      modules: tier3Concepts
    },
    {
      level: 'PLACEMENT_READY',
      tierName: `${domainName} Placement Ready & Interview Prep`,
      modules: tier4Concepts
    }
  ];

  const result = [];
  let modIndex = 1;

  levels.forEach((lvl) => {
    lvl.modules.forEach((m, idx) => {
      const globalModId = Number(`${courseId}${String(modIndex).padStart(2, '0')}`);
      const modSlug = `${prefixSlug}-${lvl.level.toLowerCase()}-mod-${idx + 1}`;

      result.push({
        id: globalModId,
        title: `Module ${modIndex}: ${m.title}`,
        slug: modSlug,
        description: m.concepts,
        orderIndex: modIndex,
        curriculumLevel: lvl.level,
        status: 'PUBLISHED',
        lessons: m.lessons || [
          {
            id: Number(`${globalModId}01`),
            title: `1.1 ${m.title} — Overview & Core Syntax`,
            slug: `${modSlug}-lesson-1`,
            estimatedMinutes: 20,
            orderIndex: 1,
            status: 'PUBLISHED',
            hinglishStatus: 'PUBLISHED',
            contentEn: `# ${m.title} — Core Fundamentals\n\nWelcome to **Module ${modIndex}** of the ${domainName} Master Track.\n\n### Concepts Covered in this Module:\n${m.concepts.split(', ').map(c => `- ${c}`).join('\n')}\n\n### Practical Implementation\n\`\`\`text\n// Core architecture and step-by-step concepts\n\`\`\``,
            contentHinglish: `# ${m.title} — Hindi + English Guide 🇮🇳\n\nIs module me hum **${m.title}** ke saare basic se leke advanced concepts detail me samjhenge.\n\n### Is Module Ke Main Topics:\n${m.concepts.split(', ').map(c => `- ${c}`).join('\n')}\n`,
            codeSnippets: [
              {
                id: 'snippet_1',
                title: `${m.title} Quick Start`,
                language: 'java',
                code: `// ${domainName} Example\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Welcome to ${m.title}!");\n    }\n}`,
                explanation: `Basic demonstration of ${m.title}`,
                placement: 'INLINE'
              }
            ]
          }
        ],
        quizzes: []
      });

      modIndex++;
    });
  });

  return result;
}

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
    description: 'Comprehensive 4-tier Java curriculum designed for engineering students and backend developers. Covers 16 comprehensive modules across OOPs, multithreading, collections, memory management, and placement coding interview questions.',
    subcourses: [
      { id: 101, curriculumLevel: 'BEGINNER', title: 'Java Programming', slug: 'java-programming', description: 'Core syntax, variables, data types, control flow, loops, methods, arrays, and basic problem solving.', isFree: true, priceInr: 0 },
      { id: 102, curriculumLevel: 'INTERMEDIATE', title: 'Advanced Java', slug: 'advanced-java', description: 'OOPs (Inheritance, Polymorphism, Encapsulation, Abstraction), Interfaces, Exception Handling, Collections Framework, and Generics.', isFree: true, priceInr: 0 },
      { id: 103, curriculumLevel: 'ADVANCED', title: 'Java Backend', slug: 'java-backend', description: 'Multithreading, Concurrency, JVM Internals, Garbage Collection, Java 8+ Streams & Lambdas, JDBC & Spring Boot Integration.', isFree: true, priceInr: 0 },
      { id: 104, curriculumLevel: 'PLACEMENT_READY', title: 'Java Interview Prep', slug: 'java-interview-prep', description: 'Top 100 Java placement interview questions, tricky output questions, memory leak debugging, and coding round challenges.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(1, 'Java', 'java',
      // Beginner 4 Modules
      [
        { title: 'Java Basics, JDK & JVM Architecture', concepts: 'Introduction to Java, WORA principle, JDK, JRE, JVM internals, compilation vs execution, bytecode, first HelloWorld program, comments, naming conventions' },
        { title: 'Data Types, Variables & Type Casting', concepts: 'Primitive vs reference types, byte, short, int, long, float, double, char, boolean, variable declaration, implicit and explicit type casting, overflow, constants, final keyword' },
        { title: 'Operators, Math & Scanner Input', concepts: 'Arithmetic, relational, logical, bitwise, assignment, ternary operator, precedence and associativity, Math class methods, Scanner class for user input, formatting output' },
        { title: 'Control Flow, Loops & Arrays', concepts: 'if-else conditions, switch-case (classic and modern), for loop, while loop, do-while loop, break and continue, 1D arrays, 2D matrices, array traversal, enhanced for-each loop' }
      ],
      // Intermediate 4 Modules
      [
        { title: 'Object-Oriented Programming (OOPs)', concepts: 'Classes, Objects, State & Behavior, Constructors (Default, Parameterized, Copy), constructor chaining, this keyword, Encapsulation, Access Modifiers (public, private, protected, default)' },
        { title: 'Inheritance, Polymorphism & Interfaces', concepts: 'extends keyword, single, multilevel, hierarchical inheritance, super keyword, method overriding vs overloading, dynamic method dispatch, abstract classes, interfaces, default & static methods' },
        { title: 'Exception Handling & String Architecture', concepts: 'try-catch-finally blocks, throw vs throws, custom exceptions, Checked vs Unchecked exceptions, String immutability, String Pool, StringBuilder, StringBuffer, string manipulation' },
        { title: 'Java Collections Framework & Generics', concepts: 'Collection interface, List (ArrayList, LinkedList, Vector), Set (HashSet, LinkedHashSet, TreeSet), Map (HashMap, LinkedHashMap, TreeMap), Queue, Deque, Iterator, Comparable vs Comparator, Generic classes & methods' }
      ],
      // Advanced 4 Modules
      [
        { title: 'Multithreading, Concurrency & Locks', concepts: 'Thread lifecycle, Thread class, Runnable interface, Synchronization, synchronized blocks, wait/notify/notifyAll, ReentrantLock, volatile keyword, Atomic variables, Deadlock prevention' },
        { title: 'Java 8+ Functional Programming & Streams', concepts: 'Lambda expressions, Functional Interfaces (@FunctionalInterface, Predicate, Function, Consumer, Supplier), Streams API, filter, map, flatMap, reduce, collect, Optional class, Method references' },
        { title: 'JVM Internals, Memory Management & GC', concepts: 'JVM Memory Architecture, Heap Memory (Young Gen, Old Gen, Metaspace), Stack Memory, ClassLoader subsystem, Garbage Collection algorithms (G1, ZGC), memory leak detection, JVisualVM' },
        { title: 'File I/O, JDBC & Spring Boot Integration', concepts: 'File handling, FileInputStream/FileOutputStream, BufferedReader, Serialization & Deserialization, JDBC architecture, Connection, PreparedStatement, ResultSet, Spring Boot REST controllers & JPA connection' }
      ],
      // Placement Ready 4 Modules (₹29)
      [
        { title: 'Top 50 Java Tricky Output & Core Technical Qs', concepts: 'Tricky output questions on inheritance, string equals() vs ==, pass-by-value proof, method overloading resolution order, static block execution flow, auto-boxing edge cases' },
        { title: 'Data Structures Coding Rounds in Java', concepts: 'Custom LinkedList implementation, Stack & Queue implementation using arrays/nodes, Binary Tree traversals (Inorder, Preorder, Postorder), BFS/DFS graphs, sorting algorithms in Java' },
        { title: 'Concurrency, Design Patterns & Architecture Rounds', concepts: 'Producer-Consumer problem with BlockingQueue, Thread-safe Singleton pattern, Factory pattern, Observer pattern, LRU Cache implementation in Java, Immutable class design' },
        { title: 'FAANG & Product Company Mock Technical Rounds', concepts: 'Memory leak debugging scenario questions, Garbage collection tuning, Java Collections internal hashing and collision handling, Mock technical interview feedback rubrics' }
      ]
    )
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
    description: 'Complete 16-module Python curriculum covering core programming, OOPs, list comprehensions, decorators, generators, asyncio, FastAPI/Flask, and placement interview challenges.',
    subcourses: [
      { id: 201, curriculumLevel: 'BEGINNER', title: 'Python Programming', slug: 'python-programming', description: 'Syntax, variables, conditionals, loops, functions, lists, tuples, dicts, and file handling.', isFree: true, priceInr: 0 },
      { id: 202, curriculumLevel: 'INTERMEDIATE', title: 'OOP & Libraries', slug: 'oop-and-libraries', description: 'Classes, Objects, Inheritance, Magic Dunder Methods, Decorators, Generators, NumPy, and Pandas.', isFree: true, priceInr: 0 },
      { id: 203, curriculumLevel: 'ADVANCED', title: 'Python Development', slug: 'python-development', description: 'Asyncio, Multiprocessing, Metaclasses, REST APIs with FastAPI/Flask, and PyTest automated testing.', isFree: true, priceInr: 0 },
      { id: 204, curriculumLevel: 'PLACEMENT_READY', title: 'Python Interview Prep', slug: 'python-interview-prep', description: 'Top Python interview questions, tricky output questions, DSA in Python, and machine coding challenges.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(2, 'Python', 'python',
      // Beginner 4
      [
        { title: 'Python Syntax, Variables & Dynamic Typing', concepts: 'Python interpreter, indentation rules, dynamic typing, variables, data types (int, float, str, bool), print() and input(), type casting, comments' },
        { title: 'Conditionals, Match-Case & Logical Operators', concepts: 'if-elif-else statements, match-case (Python 3.10+), logical operators (and, or, not), identity (is) vs equality (==), membership operators (in, not in)' },
        { title: 'Loops, Iterables & Comprehensions', concepts: 'while loops, for-in loops, range() function, enumerate(), zip(), break, continue, else with loops, list comprehensions, dict comprehensions' },
        { title: 'Data Structures: Lists, Tuples, Dictionaries & Sets', concepts: 'List indexing and slicing, list methods, immutability of tuples, tuple unpacking, dictionary key-value operations, set operations (union, intersection, difference)' }
      ],
      // Intermediate 4
      [
        { title: 'Functions, Scopes (*args, **kwargs) & Lambdas', concepts: 'def statements, return values, positional vs keyword arguments, *args and **kwargs, LEGB variable scope rules, lambda anonymous functions, map, filter, reduce' },
        { title: 'OOP in Python: Classes, Dunder Methods & Properties', concepts: 'Classes, Objects, __init__ constructor, self parameter, class vs instance variables, magic dunder methods (__str__, __repr__, __len__, __add__), @property decorator' },
        { title: 'Inheritance, Polymorphism & Mixins', concepts: 'Single and multiple inheritance, super() resolution, Method Resolution Order (MRO), abstract base classes (abc module), mixins design pattern' },
        { title: 'Decorators, Generators & Context Managers', concepts: 'First-class functions, function closures, writing custom decorators, @functools.wraps, yield keyword, generator expressions, with statement, contextmanager protocol' }
      ],
      // Advanced 4
      [
        { title: 'Asyncio, Coroutines & Concurrency', concepts: 'async and await syntax, event loop architecture, asyncio.gather, tasks and futures, ThreadPoolExecutor, ProcessPoolExecutor, GIL (Global Interpreter Lock)' },
        { title: 'Metaclasses, Descriptors & Memory Internals', concepts: 'type() as a metaclass, writing custom metaclasses, descriptor protocol (__get__, __set__), reference counting, garbage collection in Python, sys and gc modules' },
        { title: 'Web Frameworks: FastAPI & REST APIs', concepts: 'FastAPI fundamentals, Pydantic data schemas, path and query parameters, dependency injection, async endpoints, Swagger UI documentation, JWT authentication' },
        { title: 'Automated Testing, Packaging & PyTest', concepts: 'Unit testing with pytest, fixtures, parameterize tests, mock objects (unittest.mock), virtual environments (venv/poetry), pyproject.toml package building' }
      ],
      // Placement Ready 4 (₹29)
      [
        { title: 'Top 50 Python Tricky Output & Mutable Defaults', concepts: 'Mutable default argument traps, shallow copy vs deep copy, late binding closures, GIL implications in CPU vs I/O bound tasks, dictionary order guarantees' },
        { title: 'Data Structures & Algorithms in Python', concepts: 'Implementing Stack, Queue, LinkedList in Python, heapq priority queue, collections.deque, collections.defaultdict, binary search and two-pointer interview problems' },
        { title: 'Python System Design & Web Architecture Rounds', concepts: 'Building rate-limiter in Python, caching with Redis, Celery task queues, database ORM (SQLAlchemy) connection pooling, microservices architecture' },
        { title: 'Live Python Machine Coding & FAANG Interview Prep', concepts: 'Designing an In-Memory File System, Snake & Ladder machine coding round, Parking Lot system in Python, mock interview feedback and code optimization' }
      ]
    )
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
    description: 'Complete 16-module C++ track for competitive programmers, systems engineers, and placement candidates. Covers syntax, pointers, STL, OOP, memory management, and technical interview problems.',
    subcourses: [
      { id: 301, curriculumLevel: 'BEGINNER', title: 'C++ Programming', slug: 'cpp-programming', description: 'Basic syntax, data types, operators, conditionals, loops, functions, arrays, and pointer fundamentals.', isFree: true, priceInr: 0 },
      { id: 302, curriculumLevel: 'INTERMEDIATE', title: 'STL & OOP', slug: 'stl-and-oop', description: 'Standard Template Library (Vectors, Maps, Sets, Queues, Iterators, Algorithms), Classes, Constructors, and Inheritance.', isFree: true, priceInr: 0 },
      { id: 303, curriculumLevel: 'ADVANCED', title: 'Advanced C++', slug: 'advanced-cpp', description: 'Smart Pointers (unique_ptr, shared_ptr), Move Semantics, RAII, Templates, Multithreading, and C++20 features.', isFree: true, priceInr: 0 },
      { id: 304, curriculumLevel: 'PLACEMENT_READY', title: 'C++ Interview Prep', slug: 'cpp-interview-prep', description: 'Virtual tables, memory layout, low-latency coding patterns, pointer arithmetic, and top product company coding rounds.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(3, 'C++', 'cpp',
      [
        { title: 'C++ Fundamentals, Compilers & cin/cout', concepts: 'Structure of C++ program, g++ compilation, header files, cin and cout fast I/O, primitive types, size of types, const and constexpr' },
        { title: 'Operators, Conditionals & Math Operations', concepts: 'Arithmetic, logical, bitwise operators, if-else, switch statement, ternary operator, cmath library, type casting (static_cast)' },
        { title: 'Loops, Arrays & String Manipulation', concepts: 'for, while, do-while loops, 1D arrays, 2D arrays, C-style strings vs std::string, string traversal, string methods' },
        { title: 'Functions, Pass-by-Value & Pass-by-Reference', concepts: 'Function prototypes, arguments, pass by value vs reference vs pointer, default arguments, inline functions, recursion fundamentals' }
      ],
      [
        { title: 'Pointers, Dynamic Memory & References', concepts: 'Pointer declaration, dereferencing, pointer arithmetic, null pointer, dangling pointer, new and delete operators, dynamic arrays' },
        { title: 'OOP in C++: Classes, Encapsulation & Friends', concepts: 'Classes, Objects, access specifiers, constructor types (default, parameterized, copy), destructor, this pointer, friend functions & classes' },
        { title: 'Inheritance, Polymorphism & Virtual Functions', concepts: 'Modes of inheritance, diamond problem, virtual base class, function overriding, virtual functions, pure virtual functions, abstract classes' },
        { title: 'Standard Template Library (STL) Mastery', concepts: 'std::vector, std::list, std::deque, std::stack, std::queue, std::priority_queue, std::set, std::map, std::unordered_map, STL algorithms' }
      ],
      [
        { title: 'Smart Pointers & RAII Architecture', concepts: 'Resource Acquisition Is Initialization (RAII), std::unique_ptr, std::shared_ptr, std::weak_ptr, circular references, custom deleters' },
        { title: 'Move Semantics, Rvalues & Perfect Forwarding', concepts: 'Lvalues vs Rvalues, rvalue references (&&), std::move, move constructor and move assignment, perfect forwarding with std::forward' },
        { title: 'Templates, Generic Programming & Metaprogramming', concepts: 'Function templates, class templates, template specialization, non-type template parameters, concepts and constraints (C++20)' },
        { title: 'Multithreading, Mutex & Memory Model', concepts: 'std::thread, std::mutex, std::lock_guard, std::unique_lock, std::condition_variable, std::atomic, memory order and barriers' }
      ],
      [
        { title: 'Top 50 C++ Tricky Output & Pointer Arithmetic Qs', concepts: 'Virtual table (vptr/vtable) layout, object slicing, undefined behavior traps, order of constructor/destructor execution' },
        { title: 'DSA Coding Rounds with Modern C++', concepts: 'Linked List reversal, Tree traversals, Graph BFS/DFS, Trie implementation, Segment Tree and Fenwick Tree in modern C++' },
        { title: 'Low-Latency & Memory Optimization Rounds', concepts: 'Cache-friendly data structures, custom memory pools, avoiding dynamic memory allocation in hot paths, SIMD vectorization' },
        { title: 'Live High-Frequency Trading & Systems Mock Rounds', concepts: 'Order book data structure design, lock-free queue implementation, latency profiling, mock technical interview rubrics' }
      ]
    )
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
    modules: build16Modules(4, 'Web Development', 'web-dev',
      [
        { title: 'Semantic HTML5, Document Structure & Forms', concepts: 'HTML5 doctype, semantic tags (header, nav, main, article, section, footer), forms, input types, validations, SEO meta tags' },
        { title: 'CSS3 Fundamentals, Box Model & Typography', concepts: 'CSS selectors, specificity calculation, box model (content, padding, border, margin), box-sizing: border-box, typography, colors' },
        { title: 'Responsive Layouts: CSS Flexbox & Grid', concepts: 'Flex container, flex items, justify-content, align-items, flex-wrap, CSS Grid columns, grid rows, grid areas, media queries' },
        { title: 'Modern CSS: Variables, Transitions & Keyframes', concepts: 'CSS custom properties (variables), transitions, CSS animations with @keyframes, pseudo-classes (:hover, :focus), accessibility' }
      ],
      [
        { title: 'JavaScript ES6+ Syntax, Scopes & Hoisting', concepts: 'let, const, var, temporal dead zone (TDZ), execution context, call stack, hoisting, primitive vs object types, spread/rest operator' },
        { title: 'DOM Manipulation, Events & Event Delegation', concepts: 'querySelector, element creation, classList, event listeners, event bubbling and capturing, event delegation, forms handling' },
        { title: 'Asynchronous JavaScript: Event Loop, Promises & Fetch', concepts: 'Event loop, microtasks vs macrotasks, callback queue, Promises, async/await, error handling with try/catch, Fetch API' },
        { title: 'Closures, Prototypal Inheritance & Modules', concepts: 'Lexical scoping, closures, memoization, prototype chain, Object.create, ES Modules (import/export), browser storage (localStorage, sessionStorage)' }
      ],
      [
        { title: 'Node.js Architecture & Express Backend', concepts: 'Node.js runtime, V8 engine, libuv, Express routing, middleware architecture, request/response lifecycle, CORS configuration' },
        { title: 'REST API Design, CRUD & MongoDB/Postgres', concepts: 'RESTful API principles, HTTP methods and status codes, connecting MongoDB with Mongoose or Postgres with Prisma, CRUD operations' },
        { title: 'Authentication, Security (JWT, OAuth) & Headers', concepts: 'JWT token generation and verification, refresh tokens, bcrypt password hashing, helmet, rate-limiting, CSRF and XSS protection' },
        { title: 'Web Performance, Caching & CI/CD Deployment', concepts: 'Critical rendering path, asset minification, code splitting, HTTP caching (Cache-Control, ETag), deploying on Vercel and Render' }
      ],
      [
        { title: 'JavaScript Polyfills & Machine Coding Prep', concepts: 'Polyfill for Promise.all, Promise.race, Array.prototype.map, filter, reduce, bind, debounce and throttle implementations' },
        { title: 'Frontend UI Machine Coding Rounds', concepts: 'Building an Autocomplete Search Bar, Infinite Scrolling List, Star Rating Component, Drag-and-Drop Kanban Board from scratch' },
        { title: 'Web Security, CORS & Network Debugging Rounds', concepts: 'Deep dive into CORS preflight (OPTIONS), Content Security Policy (CSP), SameSite cookies, WebSocket vs Server-Sent Events' },
        { title: 'Live Frontend Engineering Mock Interviews', concepts: 'Frontend system design (News Feed, Chat Application), performance profiling with Chrome DevTools, mock interview rubrics' }
      ]
    )
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
    description: 'Master React with 16 comprehensive modules from JSX, Components, and Hooks to advanced state management, React Fiber reconciliation, performance profiling, and machine coding placement rounds.',
    subcourses: [
      { id: 501, curriculumLevel: 'BEGINNER', title: 'React Basics', slug: 'react-basics', description: 'JSX syntax, Functional Components, Props, State with useState, Event Handling, and Conditional Rendering.', isFree: true, priceInr: 0 },
      { id: 502, curriculumLevel: 'INTERMEDIATE', title: 'React Development', slug: 'react-development', description: 'useEffect, Custom Hooks, Context API, React Router v6, Forms with React Hook Form, and Tailwind CSS.', isFree: true, priceInr: 0 },
      { id: 503, curriculumLevel: 'ADVANCED', title: 'Advanced React', slug: 'advanced-react', description: 'useMemo, useCallback, React.memo, State Management with Zustand/Redux Toolkit, React Query/TanStack, and Code Splitting.', isFree: true, priceInr: 0 },
      { id: 504, curriculumLevel: 'PLACEMENT_READY', title: 'React Interview Prep', slug: 'react-interview-prep', description: 'React Fiber internals, Virtual DOM reconciliation, Custom Hook machine coding, and Product UI technical rounds.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(5, 'React', 'react',
      [
        { title: 'React Fundamentals, JSX & Component Structure', concepts: 'React library vs frameworks, Vite setup, JSX rules, functional components, component composition, fragment syntax' },
        { title: 'Props, State Management with useState', concepts: 'Props passing, props destructuring, default props, useState hook, state batching, updating state based on previous state' },
        { title: 'Event Handling & Conditional Rendering', concepts: 'Synthetic events, passing arguments to event handlers, ternary rendering, logical && rendering, conditional components' },
        { title: 'Lists, Keys & Form Controls', concepts: 'Rendering lists with map(), significance of unique keys, controlled vs uncontrolled inputs, form submit handling' }
      ],
      [
        { title: 'Side Effects & Lifecycle with useEffect', concepts: 'useEffect dependency array rules, cleanup functions, fetching data inside useEffect, avoiding infinite re-render loops' },
        { title: 'Custom Hooks & Reusable Logic', concepts: 'Writing custom hooks (useFetch, useDebounce, useLocalStorage, useWindowSize), hook composition rules' },
        { title: 'State Sharing with Context API & useReducer', concepts: 'Prop drilling problem, createContext, Provider, useContext, useReducer for complex state management, combining Context with Reducer' },
        { title: 'Routing & Navigation with React Router v6', concepts: 'BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, useSearchParams, protected routes layout' }
      ],
      [
        { title: 'Performance Optimization: useMemo, useCallback & memo', concepts: 'React render cycle, identifying unnecessary re-renders, React.memo, useMemo for expensive calculations, useCallback for function caching' },
        { title: 'Global State Management: Zustand & Redux Toolkit', concepts: 'Zustand store creation, selectors, slice pattern, Redux Toolkit (createSlice, configureStore), useSelector, useDispatch' },
        { title: 'Server State with TanStack React Query', concepts: 'Client vs Server state, useQuery, useMutation, query invalidation, caching and stale-while-revalidate strategy' },
        { title: 'Code Splitting, Lazy Loading & Suspense', concepts: 'React.lazy, Suspense fallback, route-based code splitting, dynamic imports, Error Boundaries' }
      ],
      [
        { title: 'React Internals: Fiber & Virtual DOM Diffing', concepts: 'React Fiber architecture, Reconciliation algorithm, key heuristic, double buffering in Fiber tree, Concurrent Mode features' },
        { title: 'React Machine Coding Coding Rounds', concepts: 'Build an Accordion, Modal with Portal, Debounced Typeahead Search, Multi-step Form, Toast Notification System' },
        { title: 'React System Design & Architecture Rounds', concepts: 'Designing a Scalable Design System, Micro-frontends with Module Federation, Performance monitoring with Web Vitals' },
        { title: 'FAANG React Technical Mock Interviews', concepts: 'Debugging complex memory leaks in React, state management tradeoffs, live machine coding interview rubrics' }
      ]
    )
  },

  // 6. SPRING BOOT
  {
    id: 6,
    title: 'Spring Boot Backend Mastery',
    slug: 'spring-boot',
    track: 'BACKEND',
    iconEmoji: '🍃',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 40,
    orderIndex: 6,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Enterprise Java backend engineering with Spring Boot, JPA, Security, Microservices, and Kafka.',
    description: 'Master Spring Boot from DI/IoC and REST APIs to Spring Data JPA, Spring Security, JWT, Microservices, and backend interview prep.',
    subcourses: [
      { id: 601, curriculumLevel: 'BEGINNER', title: 'Spring Basics', slug: 'spring-basics', description: 'Spring Core, Dependency Injection, Inversion of Control (IoC), Spring Boot Starter, and Auto-configuration.', isFree: true, priceInr: 0 },
      { id: 602, curriculumLevel: 'INTERMEDIATE', title: 'REST APIs & JPA', slug: 'rest-apis-jpa', description: 'Spring MVC, RESTful APIs, Spring Data JPA, Hibernate, Entity Relationships, and PostgreSQL/MySQL integration.', isFree: true, priceInr: 0 },
      { id: 603, curriculumLevel: 'ADVANCED', title: 'Security & Microservices', slug: 'security-microservices', description: 'Spring Security 6, JWT Authentication, Microservices Architecture, Spring Cloud, Kafka, and Redis Caching.', isFree: true, priceInr: 0 },
      { id: 604, curriculumLevel: 'PLACEMENT_READY', title: 'Spring Interview Prep', slug: 'spring-interview-prep', description: 'Spring Bean Lifecycle, JPA N+1 problem optimization, Microservices interview questions, and LLD coding rounds.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(6, 'Spring Boot', 'spring',
      [
        { title: 'Spring Core, IoC Container & Dependency Injection', concepts: 'Inversion of Control (IoC), Dependency Injection types, ApplicationContext, @Component, @Autowired, @Bean, @Configuration' },
        { title: 'Spring Boot Auto-configuration & Starters', concepts: 'Spring Initializr, pom.xml dependencies, application.properties vs YAML, @SpringBootApplication, spring-boot-starter-web' },
        { title: 'RESTful Controllers & Request Mapping', concepts: '@RestController, @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PathVariable, @RequestParam, @RequestBody' },
        { title: 'Data Validation & Global Exception Handling', concepts: 'Hibernate Validator, @NotNull, @Size, @Valid, @ControllerAdvice, @ExceptionHandler, custom ErrorResponse DTOs' }
      ],
      [
        { title: 'Spring Data JPA, Hibernate & Entities', concepts: 'JPA architecture, Hibernate ORM, @Entity, @Table, @Id, @GeneratedValue, JpaRepository methods, custom JPQL queries' },
        { title: 'Entity Relationships & Cascading', concepts: '@OneToOne, @OneToMany, @ManyToOne, @ManyToMany, FetchType (LAZY vs EAGER), CascadeType, orphanRemoval' },
        { title: 'Pagination, Sorting & Specifications', concepts: 'Pageable, PageRequest, Sort, Page<T> return type, Spring Data JPA Specifications, dynamic query filtering' },
        { title: 'Transaction Management & Database Migrations', concepts: '@Transactional propagation levels, isolation levels, rollback rules, Flyway / Liquibase database migrations' }
      ],
      [
        { title: 'Spring Security 6 & JWT Token Authentication', concepts: 'SecurityFilterChain, UserDetailsService, PasswordEncoder (BCrypt), JWT generation & filter, stateless security architecture' },
        { title: 'Role-Based Access Control (RBAC) & OAuth2', concepts: '@PreAuthorize, @Secured, roles vs authorities, OAuth2 Resource Server, Google/GitHub login integration' },
        { title: 'Microservices Architecture with Spring Cloud', concepts: 'Service Discovery (Eureka), API Gateway (Spring Cloud Gateway), FeignClient, Circuit Breaker (Resilience4j), Config Server' },
        { title: 'Distributed Systems: Redis Caching & Apache Kafka', concepts: 'Spring Cache with Redis (@Cacheable, @CacheEvict), Kafka Producer & Consumer (@KafkaListener), asynchronous messaging' }
      ],
      [
        { title: 'Spring Bean Lifecycle & JPA N+1 Optimization', concepts: 'Bean lifecycle callbacks (@PostConstruct, @PreDestroy, BeanPostProcessor), solving JPA N+1 query problem with JOIN FETCH, entity graphs' },
        { title: 'Enterprise Backend System Design Rounds', concepts: 'Designing an E-Commerce Payment Service with idempotency, Distributed lock with Redis Redlock, Saga pattern in Microservices' },
        { title: 'Spring Boot Production Tuning & Actuator', concepts: 'Spring Boot Actuator endpoints, Prometheus & Grafana metrics, JVM heap sizing for Spring containers, connection pool tuning (HikariCP)' },
        { title: 'Live Java Backend FAANG Mock Interviews', concepts: 'Designing URL Shortener, Scalable Notification Service, Concurrency handling in Spring, mock interview rubrics' }
      ]
    )
  },

  // 7. NODE.JS & EXPRESS
  {
    id: 7,
    title: 'Node.js Backend & Systems Track',
    slug: 'nodejs',
    track: 'BACKEND',
    iconEmoji: '🟢',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 7,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Build high-throughput, non-blocking asynchronous backend systems with Node.js, Express, and WebSockets.',
    description: 'Master Node.js with 16 comprehensive modules from event loop internals and Streams to Express.js REST APIs, Microservices, and backend placement prep.',
    subcourses: [
      { id: 701, curriculumLevel: 'BEGINNER', title: 'Node Basics', slug: 'node-basics', description: 'Node.js Runtime, Modules (CommonJS & ESM), NPM, File System, and Event Emitter.', isFree: true, priceInr: 0 },
      { id: 702, curriculumLevel: 'INTERMEDIATE', title: 'Express & Databases', slug: 'express-databases', description: 'Express Routing, Middleware, MongoDB & PostgreSQL integration, JWT Auth, and Error Handling.', isFree: true, priceInr: 0 },
      { id: 703, curriculumLevel: 'ADVANCED', title: 'Advanced Systems', slug: 'advanced-systems', description: 'Streams & Buffers, Cluster & Worker Threads, WebSockets with Socket.io, Microservices, and Redis.', isFree: true, priceInr: 0 },
      { id: 704, curriculumLevel: 'PLACEMENT_READY', title: 'Node Interview Prep', slug: 'node-interview-prep', description: 'Event loop phases deep dive, Memory leak debugging, Rate limiter machine coding, and Backend LLD.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(7, 'Node.js', 'nodejs',
      [
        { title: 'Node.js Runtime Architecture & Event Loop', concepts: 'V8 engine, Libuv, non-blocking I/O, Event Loop phases (timers, I/O callbacks, idle, poll, check, close), process object' },
        { title: 'Modules, NPM & Package Management', concepts: 'CommonJS (require) vs ES Modules (import/export), npm scripts, package.json, semantic versioning, global vs local packages' },
        { title: 'File System (fs) & Path Utilities', concepts: 'fs module (sync vs async vs promises), path resolution, reading and writing files, directory traversal' },
        { title: 'Events & EventEmitter Architecture', concepts: 'EventEmitter class, on, emit, once, removeListener, building custom event-driven workflows' }
      ],
      [
        { title: 'Express.js Framework & Middleware Pipeline', concepts: 'Express application instance, request and response objects, app.use(), custom middleware, third-party middleware (cors, morgan)' },
        { title: 'REST API Design, Routes & Controllers', concepts: 'Route parameters, query strings, body parsing, modular routing with express.Router, MVC project organization' },
        { title: 'Database Integration: MongoDB & PostgreSQL', concepts: 'Mongoose schemas and models with MongoDB, Prisma ORM with PostgreSQL, indexing and transactions' },
        { title: 'Authentication, JWT & Security Middleware', concepts: 'JWT generation and verification, bcrypt hashing, helmet security headers, rate-limiting, centralized error handling' }
      ],
      [
        { title: 'Streams, Buffers & File Processing', concepts: 'Readable, Writable, Transform, Duplex streams, stream.pipe(), pipeline utility, backpressure handling, binary data with Buffer' },
        { title: 'Clustering, Worker Threads & Child Processes', concepts: 'Multi-core scaling with cluster module, worker_threads for CPU-intensive tasks, child_process (spawn, exec, fork)' },
        { title: 'Real-time WebSockets with Socket.io', concepts: 'WebSocket protocol vs HTTP polling, Socket.io rooms, namespaces, broadcasting events, building live chat and collaboration' },
        { title: 'Microservices & Message Queues with RabbitMQ/Redis', concepts: 'Pub/Sub architecture with Redis, RabbitMQ message brokers, distributed task processing with BullMQ' }
      ],
      [
        { title: 'Node.js Event Loop Tricky Output & Internals', concepts: 'process.nextTick vs setImmediate vs setTimeout(0) execution priority order, garbage collection in V8' },
        { title: 'Backend Machine Coding: Rate Limiter & Cache', concepts: 'Implementing Token Bucket & Leaky Bucket rate limiter, In-Memory LRU Cache with TTL from scratch' },
        { title: 'Memory Leak Debugging & Profiling in Node.js', concepts: 'Heap snapshots with Chrome DevTools, identifying unclosed database connections and global variable leaks' },
        { title: 'FAANG Backend Engineering Mock Interviews', concepts: 'Designing Scalable Notification Engine, Real-time Collaborative Document Editor, mock interview rubrics' }
      ]
    )
  },

  // 8. DATA STRUCTURES & ALGORITHMS (DSA)
  {
    id: 8,
    title: 'Data Structures & Algorithms (DSA)',
    slug: 'dsa',
    track: 'CS_CORE',
    iconEmoji: '📊',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 50,
    orderIndex: 8,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1516116211227-bbc1329241b8?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Master Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and FAANG coding interview patterns.',
    description: 'Complete 16-module Data Structures and Algorithms curriculum covering complexity analysis, standard data structures, advanced algorithms, and top coding interview problem patterns.',
    subcourses: [
      { id: 801, curriculumLevel: 'BEGINNER', title: 'DSA Basics', slug: 'dsa-basics', description: 'Time & Space Complexity (Big-O), Arrays, Strings, Searching (Linear/Binary), and Basic Sorting.', isFree: true, priceInr: 0 },
      { id: 802, curriculumLevel: 'INTERMEDIATE', title: 'Core Data Structures', slug: 'core-data-structures', description: 'Linked Lists, Stacks, Queues, Recursion, Backtracking, and Hashing.', isFree: true, priceInr: 0 },
      { id: 803, curriculumLevel: 'ADVANCED', title: 'Trees, Graphs & DP', slug: 'trees-graphs-dp', description: 'Binary Trees, BST, Heaps/Priority Queues, Graph Algorithms (BFS/DFS, Dijkstra), and Dynamic Programming.', isFree: true, priceInr: 0 },
      { id: 804, curriculumLevel: 'PLACEMENT_READY', title: 'DSA Interview Prep', slug: 'dsa-interview-prep', description: 'Top 75 LeetCode Blind Patterns, Sliding Window, Monotonic Stack, Interval Merging, and Hard DP Rounds.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(8, 'DSA', 'dsa',
      [
        { title: 'Time & Space Complexity (Big-O Notation)', concepts: 'Asymptotic analysis, Big-O, Big-Theta, Big-Omega, worst-case vs average-case, calculating time complexity of loops and recursive relations' },
        { title: 'Arrays & Two-Pointer Patterns', concepts: '1D/2D arrays, contiguous memory allocation, two-pointer technique (left/right, slow/fast), Kadane algorithm for maximum subarray sum' },
        { title: 'String Manipulation & Pattern Matching', concepts: 'String reversal, palindrome check, anagrams, substring generation, rolling hash, basic string sliding window' },
        { title: 'Searching & Elementary Sorting Algorithms', concepts: 'Linear search, Binary search on sorted arrays, search in rotated sorted array, Bubble sort, Selection sort, Insertion sort' }
      ],
      [
        { title: 'Linked Lists (Singly, Doubly & Circular)', concepts: 'Node structure, Singly linked list, traversal, insertion, deletion, reverse linked list, detect cycle (Floyd cycle detection algorithm)' },
        { title: 'Stacks & Queues Implementation & Applications', concepts: 'LIFO vs FIFO, Array and LinkedList implementation of Stack/Queue, balanced parentheses, Next Greater Element pattern, Deque' },
        { title: 'Recursion & Backtracking Algorithms', concepts: 'Base case, recursion tree, subset generation, permutations, N-Queens problem, Sudoku solver, combination sum' },
        { title: 'Hashing, Hash Tables & Collision Resolution', concepts: 'Hash functions, Separate chaining, Open addressing (Linear probing), HashMap internal operations, Two Sum problem' }
      ],
      [
        { title: 'Binary Trees & Binary Search Trees (BST)', concepts: 'Tree terminology, Tree traversals (Inorder, Preorder, Postorder, Level-order), Height of tree, Diameter of tree, BST insert, search, delete' },
        { title: 'Heaps, Priority Queues & Tries', concepts: 'Min-Heap and Max-Heap, Heapify algorithm, Priority Queue operations, Kth largest element, Prefix Tree (Trie) insert and search' },
        { title: 'Graph Algorithms: BFS, DFS & Shortest Path', concepts: 'Adjacency list representation, Breadth-First Search (BFS), Depth-First Search (DFS), Topological Sort, Dijkstra shortest path algorithm' },
        { title: 'Dynamic Programming: 1D & 2D Patterns', concepts: 'Overlapping subproblems, optimal substructure, Memoization vs Tabulation, Climbing stairs, 0/1 Knapsack, Longest Common Subsequence (LCS)' }
      ],
      [
        { title: 'Top 75 FAANG Coding Interview Patterns', concepts: 'Sliding Window (variable and fixed size), Monotonic Stack, Monotonic Queue, Binary Search on Answer space' },
        { title: 'Advanced Graph & Tree Interview Questions', concepts: 'Lowest Common Ancestor (LCA), Binary Tree Maximum Path Sum, Disjoint Set Union (DSU / Kruskal algorithm), Word Ladder' },
        { title: 'Hard Dynamic Programming on Trees & Bitmasks', concepts: 'House Robber III (Tree DP), Travelling Salesman Problem (Bitmask DP), Matrix Chain Multiplication' },
        { title: 'Live Coding Round Simulation & Mock Rubrics', concepts: 'Time-bound coding assessments, edge-case validation, writing clean production code under pressure, mock interview rubrics' }
      ]
    )
  },

  // 9. OPERATING SYSTEMS
  {
    id: 9,
    title: 'Operating Systems Mastery',
    slug: 'operating-systems',
    track: 'CS_CORE',
    iconEmoji: '⚙️',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 30,
    orderIndex: 9,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'From processes, threads, and CPU scheduling to virtual memory, deadlocks, and OS technical interviews.',
    description: 'Master Operating Systems with 16 comprehensive modules covering kernel architecture, process management, synchronization, paging, file systems, and core placement interview questions.',
    subcourses: [
      { id: 901, curriculumLevel: 'BEGINNER', title: 'OS Fundamentals', slug: 'os-fundamentals', description: 'OS Architecture, Kernel vs User Mode, System Calls, and Process Management.', isFree: true, priceInr: 0 },
      { id: 902, curriculumLevel: 'INTERMEDIATE', title: 'CPU & Synchronization', slug: 'cpu-and-sync', description: 'CPU Scheduling Algorithms, Threads, Semaphores, Mutex, and Deadlocks.', isFree: true, priceInr: 0 },
      { id: 903, curriculumLevel: 'ADVANCED', title: 'Memory & Storage', slug: 'memory-and-storage', description: 'Virtual Memory, Paging, Page Replacement, File Systems, and Disk Scheduling.', isFree: true, priceInr: 0 },
      { id: 904, curriculumLevel: 'PLACEMENT_READY', title: 'OS Interview Prep', slug: 'os-interview-prep', description: 'Top 50 OS Interview Questions, Dining Philosophers, Banker algorithm, and Core CS Technical Rounds.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(9, 'Operating Systems', 'os',
      [
        { title: 'Introduction to Operating Systems & Architecture', concepts: 'Functions of OS, Kernel vs User mode, Dual-mode operation, Monolithic vs Microkernel architecture, System boot process' },
        { title: 'System Calls & Process Management', concepts: 'System calls (fork, exec, wait, exit), Process state lifecycle, Process Control Block (PCB), Context Switching overhead' },
        { title: 'Inter-Process Communication (IPC)', concepts: 'Shared memory vs Message passing, Pipes, Named Pipes (FIFOs), Message Queues, Sockets IPC' },
        { title: 'Threads & Multi-Threading Models', concepts: 'Process vs Thread, User-level vs Kernel-level threads, Multithreading models (Many-to-One, One-to-One, Many-to-Many)' }
      ],
      [
        { title: 'CPU Scheduling Algorithms', concepts: 'First-Come First-Served (FCFS), Shortest Job First (SJF), Shortest Remaining Time First (SRTF), Round Robin (RR), Priority Scheduling' },
        { title: 'Process Synchronization & Critical Section', concepts: 'Critical section problem, Peterson algorithm, Race conditions, Atomic test-and-set instructions' },
        { title: 'Semaphores, Mutex & Classical Sync Problems', concepts: 'Binary vs Counting Semaphores, Mutex locks, Producer-Consumer problem, Readers-Writers problem, Dining Philosophers' },
        { title: 'Deadlock Detection, Prevention & Avoidance', concepts: 'Deadlock conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait), Resource Allocation Graph, Banker algorithm' }
      ],
      [
        { title: 'Memory Management & Contiguous Allocation', concepts: 'Logical vs Physical address space, Memory Management Unit (MMU), Dynamic loading, Fixed vs Dynamic partitioning, Fragmentation' },
        { title: 'Paging, Segmentation & TLB', concepts: 'Paging concept, Page table structure, Translation Lookaside Buffer (TLB), Multi-level paging, Segmentation' },
        { title: 'Virtual Memory & Page Replacement Algorithms', concepts: 'Demand paging, Page fault handling, Belady anomaly, Page replacement (FIFO, Optimal, Least Recently Used - LRU), Thrashing' },
        { title: 'File Systems & Disk Scheduling Algorithms', concepts: 'File attributes and directory structures, File allocation methods (Contiguous, Linked, Indexed), Disk scheduling (FCFS, SSTF, SCAN, C-SCAN)' }
      ],
      [
        { title: 'Top 50 Core OS Placement Technical Questions', concepts: 'What happens during fork(), Thread vs Process memory layout, Why is Thrashing caused, Thrashing mitigation' },
        { title: 'Classical OS Synchronization Problem Implementations', concepts: 'Writing thread-safe Producer-Consumer code, Read-Write Lock implementation, Deadlock avoidance simulations' },
        { title: 'Linux Kernel & System Call Architecture Rounds', concepts: 'Copy-On-Write (COW) semantics, Virtual memory layout on Linux x86_64, epoll vs select/poll' },
        { title: 'FAANG Core CS Technical Mock Interviews', concepts: 'Operating system design questions, virtual memory performance tradeoffs, mock technical interview rubrics' }
      ]
    )
  },

  // 10. DATABASE MANAGEMENT SYSTEMS (DBMS) & SQL
  {
    id: 10,
    title: 'DBMS & Advanced SQL Master Track',
    slug: 'dbms',
    track: 'CS_CORE',
    iconEmoji: '🗄️',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 10,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Relational database architecture, Normalization (1NF to BCNF), ACID transactions, Indexing, and SQL interview prep.',
    description: 'Master DBMS and SQL with 16 comprehensive modules covering schema design, ER modeling, advanced SQL querying, transactions, concurrency control, and database interview rounds.',
    subcourses: [
      { id: 1001, curriculumLevel: 'BEGINNER', title: 'DBMS Basics', slug: 'dbms-basics', description: 'DBMS Architecture, ER Diagrams, Relational Model, and Fundamental SQL (DDL, DML).', isFree: true, priceInr: 0 },
      { id: 1002, curriculumLevel: 'INTERMEDIATE', title: 'Advanced SQL', slug: 'advanced-sql', description: 'Joins, Subqueries, Aggregations, Group By/Having, Views, and Window Functions.', isFree: true, priceInr: 0 },
      { id: 1003, curriculumLevel: 'ADVANCED', title: 'Normalization & ACID', slug: 'normalization-and-acid', description: 'Functional Dependencies, 1NF to BCNF Normalization, ACID Transactions, Concurrency, and B-Tree Indexing.', isFree: true, priceInr: 0 },
      { id: 1004, curriculumLevel: 'PLACEMENT_READY', title: 'DBMS Interview Prep', slug: 'dbms-interview-prep', description: 'Top 50 SQL Query Interview Questions, Indexing internals, Lock-based protocols, and DB LLD rounds.', isFree: false, priceInr: 29 }
    ],
    modules: build16Modules(10, 'DBMS', 'dbms',
      [
        { title: 'Introduction to DBMS Architecture & ER Modeling', concepts: 'File system vs DBMS, 3-Schema Architecture, Data independence, Entities, Attributes, Relationships, ER diagrams, Cardinality' },
        { title: 'Relational Model & Key Constraints', concepts: 'Relational database concepts, Primary Key, Foreign Key, Candidate Key, Super Key, Unique Key, Referential integrity constraints' },
        { title: 'SQL Fundamentals: DDL, DML & Basic Querying', concepts: 'CREATE, ALTER, DROP, TRUNCATE (DDL), INSERT, UPDATE, DELETE (DML), SELECT, WHERE, ORDER BY, LIMIT, LIKE operators' },
        { title: 'Integrity Constraints & Built-in Functions', concepts: 'NOT NULL, UNIQUE, CHECK, DEFAULT constraints, String functions (CONCAT, SUBSTRING), Date/Time functions, Math functions' }
      ],
      [
        { title: 'SQL Joins & Multi-Table Relationships', concepts: 'INNER JOIN, LEFT (OUTER) JOIN, RIGHT (OUTER) JOIN, FULL OUTER JOIN, CROSS JOIN, SELF JOIN, ON vs WHERE clause' },
        { title: 'Aggregations, Grouping & Filtering (HAVING)', concepts: 'COUNT, SUM, AVG, MIN, MAX aggregate functions, GROUP BY clause, HAVING clause vs WHERE clause filtering' },
        { title: 'Subqueries, Correlated Subqueries & CTEs', concepts: 'Single-row vs Multi-row subqueries, IN, ANY, ALL operators, Correlated subqueries with EXISTS, Common Table Expressions (WITH clause)' },
        { title: 'Advanced Window Functions & Analytical SQL', concepts: 'OVER() clause, PARTITION BY, ORDER BY inside window, ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG(), NTILE()' }
      ],
      [
        { title: 'Functional Dependencies & Normalization (1NF to BCNF)', concepts: 'Functional dependencies, Closure of attribute sets, Finding Candidate Keys, 1NF, 2NF, 3NF, Boyce-Codd Normal Form (BCNF), Lossless decomposition' },
        { title: 'ACID Properties & Transaction States', concepts: 'Atomicity, Consistency, Isolation, Durability, Transaction lifecycle (Active, Partially Committed, Committed, Failed, Aborted)' },
        { title: 'Concurrency Control & Isolation Levels', concepts: 'Schedules (Serial vs Concurrent), Conflict Serializability, Two-Phase Locking (2PL), Isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable)' },
        { title: 'Database Indexing: B-Trees, B+ Trees & Hashing', concepts: 'Primary vs Secondary indexes, Clustered vs Non-Clustered index, B-Tree and B+ Tree internal structure, Hash indexes, Query execution plans (EXPLAIN)' }
      ],
      [
        { title: 'Top 50 Real SQL Coding Interview Questions', concepts: 'Finding Nth highest salary, Duplicate records elimination, Running totals calculation, Consecutive login streaks, Pivot tables' },
        { title: 'Database Schema Design & LLD Technical Rounds', concepts: 'Designing schema for Amazon Orders, Uber Ride Booking, Movie Ticket Booking (BookMyShow), Index selection strategies' },
        { title: 'Database Performance Tuning & Query Optimization', concepts: 'Optimizing slow queries, Index cardinality, preventing full table scans, Connection pooling, Sharding vs Partitioning' },
        { title: 'FAANG DBMS & SQL Technical Mock Interviews', concepts: 'Consistency vs Availability tradeoffs, Distributed transactions (Two-Phase Commit), mock interview rubrics' }
      ]
    )
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
  { id: 'OS', name: 'Operating Systems', icon: '⚙️' }
];

export default CURRICULUM_DATA;
