export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'Sparkles', count: 8 },
  { id: 'java', name: 'Core Java', icon: 'Coffee', count: 1 },
  { id: 'python', name: 'Python Programming', icon: 'Code2', count: 1 },
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: 'Layers', count: 1 },
  { id: 'web-dev', name: 'React & Web Development', icon: 'Globe', count: 1 },
  { id: 'dbms', name: 'DBMS and SQL', icon: 'Database', count: 1 },
  { id: 'os', name: 'Operating Systems', icon: 'Cpu', count: 1 },
  { id: 'cn', name: 'Computer Networks', icon: 'Network', count: 1 },
  { id: 'interview-prep', name: 'Technical Interview Preparation', icon: 'Briefcase', count: 1 }
];

export const INITIAL_EBOOKS = [
  {
    id: 'core-java-handbook',
    title: 'Core Java & Multithreading Master Handbook',
    subtitle: 'From JVM Internals & Memory Model to Concurrency & Modern Java 21 Features',
    author: 'Prof. Aditya Sharma',
    authorTitle: 'Senior Java Architect & Ex-Oracle',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'java',
    categoryName: 'Core Java',
    price: 199,
    originalPrice: 499,
    rating: 4.9,
    reviewCount: 342,
    pages: 310,
    format: 'PDF • Printable Notes',
    level: 'Beginner to Advanced',
    isBestseller: true,
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/core-java-handbook.pdf',
    shortDescription: 'Comprehensive guide covering JVM memory layout, Garbage Collection algorithms, multi-threading locks, Collections internals, and Java 21 Virtual Threads.',
    description: 'Master Core Java from foundational OOP concepts to deep JVM memory tuning, Garbage Collection algorithms, multi-threading locks, and modern Java 17/21 Virtual Threads. Designed specifically for engineering semester exams and technical placement rounds.',
    highlights: [
      'JVM Architecture, Memory Layout (Heap, Stack, Metaspace), and GC Internals',
      'Multithreading, Java Memory Model, Locks, Semaphores & CompletableFuture',
      'Collections Framework time complexity cheat sheet & internal hashing mechanisms',
      'Java 8 to Java 21 Lambdas, Streams, Records, Pattern Matching & Virtual Threads',
      '50+ Real-world scenario-based interview questions with illustrated diagrams'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'JVM Architecture & Bytecode Execution Model', pages: '1 - 38' },
      { chapter: 'Chapter 2', title: 'Deep-dive OOPs: Polymorphism, Immutability & Class Loaders', pages: '39 - 85' },
      { chapter: 'Chapter 3', title: 'Mastering Java Collections Framework & Performance', pages: '86 - 145' },
      { chapter: 'Chapter 4', title: 'Multithreading, Concurrency Utilities & Thread Pools', pages: '146 - 220' },
      { chapter: 'Chapter 5', title: 'Modern Java (Streams, Lambdas, Virtual Threads)', pages: '221 - 275' },
      { chapter: 'Chapter 6', title: 'Top 50 Product-Company Coding Interview Questions', pages: '276 - 310' }
    ],
    samplePreviewText: `# CHAPTER 1: JVM ARCHITECTURE & BYTECODE

When you execute javac Main.java, the Java compiler produces bytecode (Main.class) rather than native machine code. This architecture makes Java write-once, run-anywhere (WORA).

### 1.1 ClassLoader Subsystem
The JVM ClassLoader subsystem consists of three major loaders:
1. Bootstrap ClassLoader: Loads rt.jar / base modules from jre/lib.
2. Extension / Platform ClassLoader: Loads extensions from jre/lib/ext.
3. Application / System ClassLoader: Loads classes from the application CLASSPATH.

### 1.2 JVM Runtime Data Areas
- Heap Memory: Shared across all threads. Stores all objects and instance variables.
- Stack Area: Thread-private. Every thread has its own call stack containing Stack Frames.
- Metaspace: Replaces PermGen. Stores class metadata in native memory.`,
    fileSize: '14.2 MB',
    lastUpdated: 'August 2026',
    active: true
  },
  {
    id: 'python-programming-guide',
    title: 'Python for Production, Automation & AI Workflows',
    subtitle: 'Type Annotations, Asyncio, FastAPI Microservices & PyTorch Foundations',
    author: 'Pooja Nair',
    authorTitle: 'Full Stack Tech Lead & Python Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    category: 'python',
    categoryName: 'Python Programming',
    price: 199,
    originalPrice: 499,
    rating: 4.93,
    reviewCount: 380,
    pages: 295,
    format: 'PDF + Jupyter Notebooks',
    level: 'Beginner to Intermediate',
    isBestseller: false,
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/python-programming-guide.pdf',
    shortDescription: 'Transition from writing basic Python scripts to production-grade backend services, asynchronous programming, Pydantic schemas, and PyTorch AI pipelines.',
    description: 'Transition from writing basic Python scripts to production-grade backend services and AI inference pipelines. Learn AsyncIO, Pydantic V2, FastAPI, PyTorch basics, and automated web scrapers.',
    highlights: [
      'Modern Python 3.12 type hints, dataclasses, match-case, generators and decorators',
      'Asynchronous programming with AsyncIO, event loop internals, and non-blocking IO',
      'Building robust REST & OpenAPI microservices using FastAPI and Pydantic V2',
      'Data engineering pipelines with NumPy, Pandas vectors, and PyTorch tensor operations',
      'Packaging, unit testing with PyTest, Docker containerization, and CI/CD pipelines'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'Python 3.12 Deep Dive: Beyond Basic Syntax', pages: '1 - 42' },
      { chapter: 'Chapter 2', title: 'Generators, Iterators, Context Managers & Custom Decorators', pages: '43 - 88' },
      { chapter: 'Chapter 3', title: 'Asynchronous Programming with AsyncIO & Concurrency', pages: '89 - 148' },
      { chapter: 'Chapter 4', title: 'Building High-Performance APIs with FastAPI & Pydantic', pages: '149 - 210' },
      { chapter: 'Chapter 5', title: 'Applied Data Manipulation (NumPy, Pandas, PyTorch Tensors)', pages: '211 - 265' },
      { chapter: 'Chapter 6', title: 'Production Best Practices: PyTest, Profiling & Docker', pages: '266 - 295' }
    ],
    samplePreviewText: `# CHAPTER 1: MODERN PYTHON DEEP DIVE

Python's dynamic nature gives flexibility, but production code requires strict typing and deterministic behaviour.

### 1.1 Typing and Generics in Python 3.12
\`\`\`python
from typing import TypeVar, Generic, Sequence

T = TypeVar('T')

class BatchProcessor(Generic[T]):
    def __init__(self, batch_size: int = 64) -> None:
        self.batch_size = batch_size
        self._buffer: list[T] = []

    def add(self, item: T) -> None:
        self._buffer.append(item)
\`\`\`

### 1.2 Under the Hood: The GIL in Python 3.13
Understanding when to use \`threading\` (I/O bound) vs \`multiprocessing\` (CPU bound) vs \`asyncio\` (concurrent network IO).`,
    fileSize: '11.8 MB',
    lastUpdated: 'July 2026',
    active: true
  },
  {
    id: 'dsa-interview-sheet',
    title: 'Ultimate DSA Interview Sheet & Visual Patterns',
    subtitle: '15 Core Algorithm Patterns, 150 Hand-Picked LeetCode Problems & Complexity Cheat Sheets',
    author: 'Vikramaditya Roy',
    authorTitle: 'Ex-Google SDE & Algorithmic Coach',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'dsa',
    categoryName: 'Data Structures & Algorithms',
    price: 299,
    originalPrice: 799,
    rating: 4.98,
    reviewCount: 912,
    pages: 420,
    format: 'PDF • Color Coded Diagrams',
    level: 'Intermediate to Advanced',
    isBestseller: true,
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/dsa-interview-sheet.pdf',
    shortDescription: 'Master Two Pointers, Sliding Window, Monotonic Stacks, Graph Traversals, Tree Recursion, Bitmasking, and Dynamic Programming with visual step-by-step illustrations.',
    description: 'The definitive DSA preparation manual for product-based placement drives (Google, Microsoft, Amazon, Atlassian). Features 15 repeatable algorithm patterns and 150 color-coded solutions with step-by-step recursion trees.',
    highlights: [
      '15 Fundamental Algorithmic Patterns (Sliding Window, 2 Pointers, Top-K, Intervals)',
      'Trees, BSTs, Segment Trees, and Trie data structures with visual diagrams',
      'Graphs: BFS/DFS, Dijkstra, Bellman-Ford, Tarjan SCC, Disjoint Set Union (DSU)',
      'Dynamic Programming classified: 0/1 Knapsack, LCS, LIS, Interval DP & Digit DP',
      'Space & Time complexity cheat sheets for all standard library containers'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'Two Pointers & Sliding Window Visual Mastery', pages: '1 - 55' },
      { chapter: 'Chapter 2', title: 'Monotonic Stacks & Binary Search on Answer Space', pages: '56 - 110' },
      { chapter: 'Chapter 3', title: 'Binary Trees, BSTs, LCA & Serialization', pages: '111 - 180' },
      { chapter: 'Chapter 4', title: 'Graph Algorithms: Shortest Paths, Topological Sort & DSU', pages: '181 - 260' },
      { chapter: 'Chapter 5', title: 'Dynamic Programming Patterns Demystified', pages: '261 - 365' },
      { chapter: 'Chapter 6', title: 'Bit Manipulation, Math, Tries & String Hashing', pages: '366 - 420' }
    ],
    samplePreviewText: `# PATTERN 1: SLIDING WINDOW (DYNAMIC SIZE)

**Problem Statement:** Find the length of the longest substring with at most K distinct characters.

### Algorithmic Template:
1. Initialize \`left = 0\`, \`char_frequency = {}\`, \`max_len = 0\`.
2. Expand \`right\` pointer from \`0\` to \`N - 1\`:
   - Add \`s[right]\` into \`char_frequency\`.
   - While \`len(char_frequency) > K\`:
     - Decrement frequency of \`s[left]\`.
     - If frequency drops to 0, delete from map.
     - Increment \`left\`.
   - Update \`max_len = max(max_len, right - left + 1)\`.`,
    fileSize: '18.4 MB',
    lastUpdated: 'September 2026',
    active: true
  },
  {
    id: 'react-web-development',
    title: 'Modern Full-Stack Engineering with React 18 & Spring Boot',
    subtitle: 'Stateless Architecture, Tailwind CSS, TanStack Query, Redux Toolkit & MySQL Integration',
    author: 'Siddharth Patel',
    authorTitle: 'Principal Frontend Architect & Author',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'web-dev',
    categoryName: 'React & Web Development',
    price: 249,
    originalPrice: 599,
    rating: 4.88,
    reviewCount: 265,
    pages: 350,
    format: 'PDF + Full Source Code repo',
    level: 'Beginner to Intermediate',
    isBestseller: false,
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/react-web-development.pdf',
    shortDescription: 'Build high-converting, blazing fast web apps. React 18 hooks, custom state management, Tailwind design systems, Spring Boot 3 REST endpoints, and security.',
    description: 'Learn modern web engineering from clean React component patterns, Tailwind styling systems, React Router 6, and Vite bundlers to backend Spring Boot REST services, JWT authentication, and MySQL transactional data integrity.',
    highlights: [
      'React 18 Concurrent features, Server/Client components, Hooks and Context API',
      'Tailwind CSS design systems: responsive layouts, custom utility tokens, dark mode',
      'TanStack Query (React Query) for optimistic updates, caching & pagination',
      'Spring Boot 3 REST API design: layered architecture, Bean Validation, JPA',
      'End-to-end e-commerce / digital store project with shopping cart & payment flow'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'React 18 Component Anatomy & Mental Model', pages: '1 - 45' },
      { chapter: 'Chapter 2', title: 'Tailwind CSS Design Systems & Clean UI Architecture', pages: '46 - 95' },
      { chapter: 'Chapter 3', title: 'State Management (Zustand, Redux Toolkit & Context)', pages: '96 - 155' },
      { chapter: 'Chapter 4', title: 'Connecting Spring Boot 3 REST APIs & Axios Layer', pages: '156 - 225' },
      { chapter: 'Chapter 5', title: 'Stateless Authentication (JWT) & Protected Route Guards', pages: '226 - 285' },
      { chapter: 'Chapter 6', title: 'Deploying Production Apps on Vercel & Cloud VPS', pages: '286 - 350' }
    ],
    samplePreviewText: `# CHAPTER 1: REACT 18 STATE RECONCILIATION

React 18 introduces automatic batching for all state updates, whether inside event handlers, promises, timeouts, or native event listeners.

\`\`\`jsx
// Inside React 18: Both state changes trigger ONLY 1 re-render
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

### 1.1 Custom Hook: useLocalStorage
Encapsulate local persistence while ensuring SSR safety and type consistency.`,
    fileSize: '15.6 MB',
    lastUpdated: 'August 2026',
    active: true
  },
  {
    id: 'dbms-sql-handbook',
    title: 'Database Management Systems & SQL Query Mastery',
    subtitle: 'Relational Algebra, B+ Trees, 1NF to BCNF Normalization, Transactions & 100 Query Solutions',
    author: 'Dr. Priya Nambiar',
    authorTitle: 'Professor of Database Engineering & Author',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    category: 'dbms',
    categoryName: 'DBMS and SQL',
    price: 189,
    originalPrice: 449,
    rating: 4.95,
    reviewCount: 420,
    pages: 280,
    format: 'PDF • Solved SQL Practice Set',
    level: 'Beginner to Advanced',
    isBestseller: true,
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/dbms-sql-handbook.pdf',
    shortDescription: 'Master ER diagrams, relational schemas, functional dependencies, indexing internals (B-Trees vs LSM), ACID isolation levels, and 100+ complex SQL interview queries.',
    description: 'A comprehensive handbook for computer science students covering relational database theory, Normalization proofs (1NF to BCNF), indexing mechanics, Transaction serializability, and 100+ real SQL query challenges.',
    highlights: [
      'ER Modelling, Schema design, and Relational Algebra proofs',
      'Step-by-step Normalization (1NF, 2NF, 3NF, BCNF) with lossless join validation',
      'Storage engines: B+ Tree indices, Clustered vs Secondary indexes, and EXPLAIN plans',
      'ACID Properties, Multi-Version Concurrency Control (MVCC) & 2-Phase Locking',
      '100 Solved SQL questions: Window functions, CTEs, self joins & subqueries'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'Relational Database Architecture & ER Design', pages: '1 - 38' },
      { chapter: 'Chapter 2', title: 'Functional Dependencies & Normalization (1NF to BCNF)', pages: '39 - 85' },
      { chapter: 'Chapter 3', title: 'Database Indexing: B+ Trees, Hash & LSM Trees', pages: '86 - 135' },
      { chapter: 'Chapter 4', title: 'Transactions, ACID Properties, MVCC & Deadlocks', pages: '136 - 190' },
      { chapter: 'Chapter 5', title: 'Advanced SQL: Window Functions, Aggregations & CTEs', pages: '191 - 245' },
      { chapter: 'Chapter 6', title: 'Top 100 Product-Company SQL Interview Queries', pages: '246 - 280' }
    ],
    samplePreviewText: `# CHAPTER 5: ADVANCED SQL & WINDOW FUNCTIONS

### Dense Rank vs Rank vs Row Number
\`\`\`sql
SELECT 
    employee_id,
    department_id,
    salary,
    ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC) as row_num,
    DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as dense_rank_val,
    RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as rank_val
FROM employees;
\`\`\`

- **ROW_NUMBER():** Always generates unique sequential numbers (1, 2, 3, 4).
- **DENSE_RANK():** Ties receive the same rank; subsequent rank is incremented by 1 (1, 2, 2, 3).
- **RANK():** Ties receive the same rank; subsequent rank skips positions (1, 2, 2, 4).`,
    fileSize: '13.1 MB',
    lastUpdated: 'August 2026',
    active: true
  },
  {
    id: 'operating-systems-notes',
    title: 'Operating Systems: Core Engineering Revision Notes',
    subtitle: 'Processes, CPU Scheduling, Synchronization, Semaphores, Deadlocks & Memory Management',
    author: 'Karan Malhotra',
    authorTitle: 'Senior Systems Engineer & OS Educator',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    category: 'os',
    categoryName: 'Operating Systems',
    price: 189,
    originalPrice: 399,
    rating: 4.89,
    reviewCount: 310,
    pages: 260,
    format: 'PDF • Handwritten Style Summary',
    level: 'Beginner to Intermediate',
    isBestseller: false,
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/operating-systems-notes.pdf',
    shortDescription: 'High-yield engineering revision handbook. Process lifecycle, context switching, Peterson algorithm, Banker deadlock algorithm, Paging, and Page replacement policies.',
    description: 'Designed for fast revision before semester exams and GATE/Placement rounds. Visual explanations of process synchronization, Peterson solution, Semaphores, Deadlock handling, Paging, TLB hits, and Virtual Memory.',
    highlights: [
      'Process Control Blocks (PCB), Context Switching & CPU Scheduling Algorithms',
      'Process Synchronization: Critical Section Problem, Mutexes & Counting Semaphores',
      'Deadlock: 4 Necessary Conditions, Resource Allocation Graphs & Banker Algorithm',
      'Memory Management: Paging, Inverted Page Tables, Segmentation & TLB hardware',
      'Virtual Memory: FIFO, LRU, Optimal Page Replacement & Thrashing mitigation'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'Processes, Threads, Context Switching & Dual-Mode Ops', pages: '1 - 40' },
      { chapter: 'Chapter 2', title: 'CPU Scheduling Algorithms (FCFS, SJF, RR, Priority)', pages: '41 - 80' },
      { chapter: 'Chapter 3', title: 'Process Synchronization, Mutex, Semaphores & Monitors', pages: '81 - 130' },
      { chapter: 'Chapter 4', title: 'Deadlock Detection, Prevention, Avoidance (Banker Algo)', pages: '131 - 170' },
      { chapter: 'Chapter 5', title: 'Main Memory, Paging, TLB, Segmentation & Virtual Memory', pages: '171 - 225' },
      { chapter: 'Chapter 6', title: 'File Systems, Disk Scheduling & Linux Kernel Basics', pages: '226 - 260' }
    ],
    samplePreviewText: `# CHAPTER 3: CRITICAL SECTION & SEMAPHORES

A Critical Section is a segment of code where shared resources are accessed. Any valid solution must satisfy three criteria:
1. **Mutual Exclusion:** If process Pi is executing in its critical section, no other process can enter.
2. **Progress:** If no process is executing in its critical section and some wish to enter, selection cannot be postponed indefinitely.
3. **Bounded Waiting:** There must be a limit on number of times other processes are allowed to enter their critical sections after a process has requested entry.`,
    fileSize: '10.5 MB',
    lastUpdated: 'July 2026',
    active: true
  },
  {
    id: 'computer-networks-guide',
    title: 'Computer Networks: From OSI & TCP/IP to HTTP/3',
    subtitle: 'Subnetting, Routing Protocols (OSPF/BGP), TCP Handshakes, TLS 1.3 & Socket Programming',
    author: 'Neha Gupta',
    authorTitle: 'Network Security Architect & Author',
    authorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    category: 'cn',
    categoryName: 'Computer Networks',
    price: 189,
    originalPrice: 429,
    rating: 4.87,
    reviewCount: 275,
    pages: 290,
    format: 'PDF + Packet Capture Labs',
    level: 'Beginner to Intermediate',
    isBestseller: false,
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/computer-networks-guide.pdf',
    shortDescription: 'Master modern computer networking concepts. IP subnetting (CIDR), TCP 3-way handshakes, Congestion Control (Tahoe/Reno), DNS lookup trees, TLS 1.3, and HTTP/3 QUIC protocol.',
    description: 'Comprehensive guide through the 5-layer Internet architecture. Detailed protocol packet breakdowns, IP address CIDR calculations, routing algorithms (Dijkstra vs Bellman-Ford), socket programming, and modern HTTP/3 protocols.',
    highlights: [
      'OSI vs TCP/IP layered architecture with protocol headers breakdown',
      'IP Addressing, Classless Inter-Domain Routing (CIDR) & Subnetting cheat sheets',
      'Transport Layer: TCP 3-Way Handshake, 4-Way Teardown & Congestion Control',
      'Application Layer Protocols: DNS resolution hierarchy, HTTP/1.1 vs 2 vs 3 (QUIC)',
      'Network Security: Public Key Cryptography, SSL/TLS 1.3 Handshake & Firewalls'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'Network Layers, Encapsulation & Topologies', pages: '1 - 35' },
      { chapter: 'Chapter 2', title: 'Data Link Layer: Framing, Error Detection & CSMA/CD', pages: '36 - 78' },
      { chapter: 'Chapter 3', title: 'Network Layer: IPv4/IPv6, CIDR Subnetting & Routing', pages: '79 - 145' },
      { chapter: 'Chapter 4', title: 'Transport Layer: TCP Reliability, Flow & Congestion Control', pages: '146 - 205' },
      { chapter: 'Chapter 5', title: 'Application Layer: DNS, HTTP/2, HTTP/3 (QUIC) & WebSockets', pages: '206 - 255' },
      { chapter: 'Chapter 6', title: 'Network Security, TLS 1.3 Encryption & Firewalls', pages: '256 - 290' }
    ],
    samplePreviewText: `# CHAPTER 4: TCP 3-WAY HANDSHAKE & TEARDOWN

TCP is a connection-oriented, reliable, byte-stream protocol.

### 4.1 Establishing Connection (3-Way Handshake)
1. **Client -> Server (SYN):** Client chooses initial sequence number \`seq = x\`, sets \`SYN = 1\`.
2. **Server -> Client (SYN-ACK):** Server chooses initial sequence number \`seq = y\`, sets \`ACK = x + 1\`, \`SYN = 1\`.
3. **Client -> Server (ACK):** Client sends \`ACK = y + 1\`, \`seq = x + 1\`. Connection is now ESTABLISHED.`,
    fileSize: '12.4 MB',
    lastUpdated: 'July 2026',
    active: true
  },
  {
    id: 'technical-interview-prep',
    title: 'Cracking the CSE Campus Placements Handbook',
    subtitle: 'System Design Basics, OOPs Design Patterns, 100 Core CS MCQs & HR Behavioral Frameworks',
    author: 'CodeOrbit Editorial Board',
    authorTitle: 'Senior Tech Recruiters & Staff Engineers',
    authorAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    category: 'interview-prep',
    categoryName: 'Technical Interview Preparation',
    price: 249,
    originalPrice: 599,
    rating: 4.96,
    reviewCount: 650,
    pages: 380,
    format: 'PDF • Placement Cheat Sheet',
    level: 'Final Year Prep',
    isBestseller: true,
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/ebooks/technical-interview-prep.pdf',
    shortDescription: 'The complete placement toolkit for engineering students. System design templates (URL shortener, Rate limiter), Low-Level Design (LLD) patterns, OS/DBMS MCQs, and STAR behavioral answers.',
    description: 'All-in-one placement preparation handbook curated by senior engineers from top product companies. Covers High-Level Design (HLD), Low-Level Design (LLD) class diagrams, 100 high-frequency Core CS interview questions, and behavioral frameworks.',
    highlights: [
      'Low-Level Design (LLD): Parking Lot, Snake & Ladder, Splitwise with UML diagrams',
      'High-Level Design (HLD) basics: Load balancers, caching strategies, rate limiters',
      '100 High-Frequency OS, DBMS, OOPs and Computer Networks technical questions',
      'Behavioral Interview Guide using the STAR framework with sample winning answers',
      'Resume scoring rubric and ATS-friendly template recommendations'
    ],
    tableOfContents: [
      { chapter: 'Chapter 1', title: 'Low-Level Design (LLD) & SOLID Principles in Practice', pages: '1 - 70' },
      { chapter: 'Chapter 2', title: 'Essential High-Level Design (HLD) Architecture Patterns', pages: '71 - 140' },
      { chapter: 'Chapter 3', title: 'Top 100 Core CSE Rapid-Fire Technical Questions', pages: '141 - 220' },
      { chapter: 'Chapter 4', title: 'Live Coding Interview Strategy & Debugging Under Pressure', pages: '221 - 275' },
      { chapter: 'Chapter 5', title: 'Behavioral & HR Rounds: Mastering the STAR Method', pages: '276 - 330' },
      { chapter: 'Chapter 6', title: 'Resume Review Rubric, Portfolio Projects & Offer Negotiation', pages: '331 - 380' }
    ],
    samplePreviewText: `# CHAPTER 1: LOW-LEVEL DESIGN — PARKING LOT SYSTEM

### SOLID Principles Checklist:
- **Single Responsibility:** ParkingFloor only manages spots on its floor; FeeCalculator computes pricing.
- **Open-Closed:** New vehicle types (e.g. Electric Vehicle with charging station) can inherit from base Vehicle without altering core logic.
- **Strategy Pattern:** Flexible parking assignment strategies (e.g. NearestToEntranceStrategy, BestFitStrategy).`,
    fileSize: '16.8 MB',
    lastUpdated: 'September 2026',
    active: true
  }
];

export const MOCK_USERS = {
  student: {
    id: 'user-student-1',
    name: 'Aman Sharma',
    email: 'aman.student@codeorbit.dev',
    role: 'STUDENT',
    college: 'National Institute of Technology (NIT)',
    branch: 'Computer Science & Engineering',
    semester: '6th Semester',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    purchasedEbookIds: ['core-java-handbook', 'dsa-interview-sheet'],
    savedEbookIds: ['react-web-development', 'technical-interview-prep'],
    joinedDate: 'January 2026'
  },
  admin: {
    id: 'user-admin-1',
    name: 'Vikram Rajput',
    email: 'admin@codeorbit.dev',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'October 2025'
  }
};

export const MOCK_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'CO-ORD-98421',
    date: '14 Sep 2026',
    studentName: 'Aman Sharma',
    studentEmail: 'aman.student@codeorbit.dev',
    items: ['Core Java & Multithreading Master Handbook', 'Ultimate DSA Interview Sheet & Visual Patterns'],
    amount: 498,
    status: 'COMPLETED',
    pdfAccessGranted: true,
    paymentMethod: 'UPI (Demo)'
  },
  {
    id: 'ord-102',
    orderNumber: 'CO-ORD-87310',
    date: '02 Sep 2026',
    studentName: 'Aman Sharma',
    studentEmail: 'aman.student@codeorbit.dev',
    items: ['Operating Systems: Core Engineering Revision Notes'],
    amount: 189,
    status: 'COMPLETED',
    pdfAccessGranted: true,
    paymentMethod: 'Card (Demo)'
  }
];
