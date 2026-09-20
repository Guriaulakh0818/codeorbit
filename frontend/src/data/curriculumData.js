export const CURRICULUM_DATA = [
  {
    id: 1,
    title: 'Data Structures & Algorithms (DSA) Master Track',
    slug: 'dsa',
    track: 'DSA',
    difficultyLevel: 'BEGINNER_TO_ADVANCED',
    estimatedHours: 35,
    orderIndex: 1,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Zero-to-Hero DSA curriculum for CSE engineering students and placement interview preparation.',
    description: 'Comprehensive master curriculum covering algorithmic complexity, linear data structures, trees, graphs, dynamic programming, and top interview patterns with verified code examples and assessments in English & Hinglish.',
    modules: [
      {
        id: 101,
        title: 'Module 1: Algorithmic Complexity & Foundations',
        slug: 'foundations-and-big-o',
        description: 'Understanding time complexity, space complexity, Big-O notation, and asymptotic analysis.',
        orderIndex: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 1001,
            title: '1.1 Introduction to Time & Space Complexity',
            slug: 'time-and-space-complexity',
            estimatedMinutes: 15,
            orderIndex: 1,
            status: 'PUBLISHED',
            hinglishStatus: 'PUBLISHED',
            contentEn: `# Introduction to Time & Space Complexity

When writing algorithms, we evaluate performance using **Asymptotic Analysis**. It allows us to compare efficiency independently of machine hardware or clock speeds.

### Big-O Notation
Big-O represents the upper bound of runtime in the worst-case scenario:

* **O(1)** — Constant time (e.g., direct array indexing like \`arr[0]\`)
* **O(log N)** — Logarithmic time (e.g., Binary Search over sorted arrays)
* **O(N)** — Linear time (e.g., single loop over $N$ elements)
* **O(N log N)** — Linearithmic time (e.g., Merge Sort and Quick Sort average)
* **O(N²)** — Quadratic time (e.g., Nested loops over array pairs)

### Space Complexity
Space complexity measures the total auxiliary memory required by an algorithm as a function of the input size $N$. Variables and recursion stack frames contribute to space complexity.

\`\`\`java
public class ComplexityDemo {
    public static int findMax(int[] arr) {
        int max = arr[0]; // O(1) auxiliary space
        for (int num : arr) { // O(N) time complexity
            if (num > max) max = num;
        }
        return max;
    }
}
\`\`\``,
            contentHinglish: `# Time & Space Complexity Ka Introduction 🇮🇳

Jab hum koi algorithm ya code likhte hain, to uski performance measure karne ke liye **Asymptotic Analysis** use karte hain. Isse hum bina kisi computer hardware ya CPU speed par depend kiye code ki efficiency samajh sakte hain.

### Big-O Notation Kya Hota Hai?
Big-O worst-case scenario me runtime ka maximum limit (upper bound) batata hai:

* **O(1)** — Constant time (jaise array me direct index access karna: \`arr[0]\`)
* **O(log N)** — Logarithmic time (jaise sorted array me Binary Search chalana)
* **O(N)** — Linear time (jaise pure array par ek single \`for\` loop chalana)
* **O(N log N)** — Merge Sort aur Quick Sort ka time
* **O(N²)** — Quadratic time (jaise nested loops chalana: loop ke andar loop)

### Space Complexity Kya Hai?
Space complexity ye measure karti hai ki algorithm ko run hone ke liye input size $N$ ke hisaab se kitni extra (auxiliary) memory chahiye hoti hai. Variables aur recursion call stack space me count hote hain.

\`\`\`java
public class ComplexityDemo {
    public static int findMax(int[] arr) {
        int max = arr[0]; // O(1) extra space
        for (int num : arr) { // O(N) time loop
            if (num > max) max = num;
        }
        return max;
    }
}
\`\`\``,
            codeSnippetJava: `public class ComplexityDemo {\n    public static int findMax(int[] arr) {\n        int max = arr[0];\n        for (int num : arr) {\n            if (num > max) max = num;\n        }\n        return max;\n    }\n}`,
            codeSnippetCpp: `int findMax(const std::vector<int>& arr) {\n    int maxVal = arr[0];\n    for (int num : arr) {\n        if (num > maxVal) maxVal = num;\n    }\n    return maxVal;\n}`,
            codeSnippetPython: `def find_max(arr):\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val`
          },
          {
            id: 1002,
            title: '1.2 Two Pointers Pattern',
            slug: 'two-pointers-pattern',
            estimatedMinutes: 20,
            orderIndex: 2,
            status: 'PUBLISHED',
            hinglishStatus: 'PUBLISHED',
            contentEn: `# Two Pointers Pattern

The two-pointer technique uses two indices to traverse an iterable simultaneously, usually from opposite ends towards the center or in the same direction at varying speeds.

### Pair Sum in Sorted Array
Given a sorted array of integers \`numbers\` and an integer \`target\`, find two numbers such that they add up to the target.

\`\`\`java
public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}
\`\`\`

### Time & Space Complexity
* **Time Complexity**: **O(N)** — We examine each array element at most once.
* **Space Complexity**: **O(1)** — Only two integer variables are allocated.`,
            contentHinglish: `# Two Pointers Pattern 🇮🇳

Two-pointer technique ek bahut popular algorithmic pattern hai jisme hum do indices (pointers) use karte hain jo array ko simultaneously traverse karte hain—ya to opposite ends se center ki taraf, ya same direction me alag speed se.

### Sorted Array Me Pair Sum Dhoondna
Maan lijiye aapke paas ek sorted array hai aur ek \`target\` sum diya hai. Hume wo do elements dhoondne hain jinka sum target ke barabar ho.

\`\`\`java
public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        else if (sum < target) left++; // sum chhota hai to left aage badhao
        else right--; // sum bada hai to right peeche lao
    }
    return new int[]{};
}
\`\`\`

### Time & Space Complexity Analysis
* **Time Complexity**: **O(N)** — Har element ko hum zyada se zyada ek baar scan karte hain.
* **Space Complexity**: **O(1)** — Koi extra array create nahi kiya gaya, bas 2 variables use hue hain.`,
            codeSnippetJava: `public int[] twoSum(int[] numbers, int target) {\n    int left = 0, right = numbers.length - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return new int[]{left + 1, right + 1};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return new int[]{};\n}`,
            codeSnippetCpp: `std::vector<int> twoSum(std::vector<int>& numbers, int target) {\n    int left = 0, right = numbers.size() - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return {left + 1, right + 1};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return {};\n}`,
            codeSnippetPython: `def two_sum(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        curr_sum = numbers[left] + numbers[right]\n        if curr_sum == target:\n            return [left + 1, right + 1]\n        elif curr_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []`
          }
        ],
        quizzes: [
          {
            id: 1,
            title: 'Module 1 Assessment: Complexity & Two Pointers',
            slug: 'module-1-quiz',
            description: 'Test your understanding of algorithmic complexity and the two-pointer technique.',
            minPassScorePercentage: 80,
            status: 'PUBLISHED',
            questions: [
              {
                id: 3001,
                promptEn: 'What is the time complexity of searching an element in a balanced binary search tree of N elements?',
                promptHinglish: 'Balanced Binary Search Tree (BST) me N elements me se kisi element ko search karne ki time complexity kya hoti hai?',
                codeContext: '',
                options: [
                  { id: 'opt_a', text: 'O(1)', text_en: 'O(1)', text_hinglish: 'O(1)' },
                  { id: 'opt_b', text: 'O(log N)', text_en: 'O(log N)', text_hinglish: 'O(log N)' },
                  { id: 'opt_c', text: 'O(N)', text_en: 'O(N)', text_hinglish: 'O(N)' },
                  { id: 'opt_d', text: 'O(N^2)', text_en: 'O(N^2)', text_hinglish: 'O(N^2)' }
                ],
                correctOptionId: 'opt_b',
                explanationEn: 'In a balanced BST, each comparison eliminates half of the remaining subtrees, resulting in O(log N) operations.',
                explanationHinglish: 'Balanced BST me har comparison ke baad aadha tree eliminate ho jata hai, isliye time complexity O(log N) hoti hai.'
              },
              {
                id: 3002,
                promptEn: 'What is the prerequisite for applying the two-pointer opposite-direction technique for the Two Sum problem in O(N) time?',
                promptHinglish: 'Two Sum problem ko Two-Pointer technique se O(N) time me solve karne ke liye array me kya property honi zaroori hai?',
                codeContext: '',
                options: [
                  { id: 'opt_a', text: 'Array elements must be all positive', text_en: 'Array elements must be all positive', text_hinglish: 'Saare elements positive hone chahiye' },
                  { id: 'opt_b', text: 'Array must be sorted', text_en: 'Array must be sorted', text_hinglish: 'Array pehle se sorted hona chahiye' },
                  { id: 'opt_c', text: 'Array must have even length', text_en: 'Array must have even length', text_hinglish: 'Array ki length even honi chahiye' },
                  { id: 'opt_d', text: 'No duplicates allowed', text_en: 'No duplicates allowed', text_hinglish: 'Duplicates nahi hone chahiye' }
                ],
                correctOptionId: 'opt_b',
                explanationEn: 'The two-pointer technique relies on monotonicity (sorted order) to decide whether to increment left or decrement right.',
                explanationHinglish: 'Two-pointer technique sorted order (monotonicity) par depend karti hai jisse sum compare karke left++ ya right-- decide hota hai.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Operating Systems (OS) Core Fundamentals',
    slug: 'operating-systems',
    track: 'OS',
    difficultyLevel: 'INTERMEDIATE',
    estimatedHours: 25,
    orderIndex: 2,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Processes, Threads, CPU Scheduling, Deadlocks, Memory Management, and Virtual Memory.',
    description: 'Master operating system internals for university semester exams and technical interview questions at top product companies.',
    modules: [
      {
        id: 102,
        title: 'Module 1: Processes, Threads & CPU Scheduling',
        slug: 'processes-and-threads',
        description: 'Process control blocks, context switching, multithreading, and CPU scheduling algorithms.',
        orderIndex: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 1003,
            title: '1.1 Process vs Thread & Context Switching',
            slug: 'process-vs-thread',
            estimatedMinutes: 18,
            orderIndex: 1,
            status: 'PUBLISHED',
            hinglishStatus: 'PUBLISHED',
            contentEn: `# Process vs Thread & Context Switching

An **Operating System** manages hardware resources and coordinates software executions through processes and threads.

### Process
A **Process** is an active program in execution. It contains its own isolated virtual address space, program counter, registers, and memory segments (Stack, Heap, Data, Text).

### Thread (Lightweight Process)
A **Thread** is the basic unit of CPU utilization. Multiple threads of the same process share:
* Code Segment & Data Segment
* Open file descriptors and heap memory
* Each thread maintains its own **Register state & Call Stack**.

### Context Switching
Context switching is the process of saving the state of the currently executing process or thread in its Process Control Block (PCB) and restoring the state of the next ready process.`,
            contentHinglish: `# Process vs Thread & Context Switching 🇮🇳

Operating System hardware resources ko manage karta hai aur programs ko chalane ke liye Processes aur Threads ka use karta hai.

### Process Kya Hota Hai?
Ek **Process** running program hota hai. Har process ka apna independent memory space (address space) hota hai jisme Stack, Heap, Data aur Code segments aate hain. Do processes ek doosre ki memory directly access nahi kar sakte.

### Thread Kya Hota Hai?
Ek **Thread** process ke andar ka execution unit hota hai jise "Lightweight Process" bhi kehte hain. Ek hi process ke multiple threads aapas me:
* Code aur Heap memory share karte hain.
* Lekin har thread ka apna alag **Stack aur Program Counter (PC)** hota hai.

### Context Switching Kya Hai?
Jab CPU ek process ko pause karke doosre process ko execute karne lagta hai, to purane process ki state (PCB) ko save karna aur naye process ki state ko load karna **Context Switching** kehlata hai.`,
            codeSnippetJava: `// Multithreading Example in Java
public class ThreadDemo {
    public static void main(String[] args) {
        Thread worker = new Thread(() -> {
            System.out.println("Thread running concurrently: " + Thread.currentThread().getName());
        });
        worker.start();
    }
}`,
            codeSnippetCpp: `// Multithreading Example in C++
#include <iostream>
#include <thread>

void task() {
    std::cout << "Thread executing concurrently\n";
}

int main() {
    std::thread t(task);
    t.join();
    return 0;
}`,
            codeSnippetPython: `# Multithreading Example in Python
import threading

def task():
    print(f"Thread running: {threading.current_thread().name}")

t = threading.Thread(target=task)
t.start()
t.join()`
          }
        ],
        quizzes: []
      }
    ]
  },
  {
    id: 3,
    title: 'Database Management Systems (DBMS) & SQL Masterclass',
    slug: 'dbms',
    track: 'DBMS',
    difficultyLevel: 'INTERMEDIATE',
    estimatedHours: 28,
    orderIndex: 3,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Relational Model, Normalization, ACID Transactions, B+ Trees, and SQL Optimization.',
    description: 'In-depth database management system theory, relational schema design, indexing strategies, and concurrency control.',
    modules: [
      {
        id: 103,
        title: 'Module 1: Relational Schema & Normalization',
        slug: 'schema-and-normalization',
        description: 'Functional dependencies, 1NF, 2NF, 3NF, BCNF, and lossless decomposition.',
        orderIndex: 1,
        status: 'PUBLISHED',
        lessons: [
          {
            id: 1004,
            title: '1.1 ACID Properties & Database Transactions',
            slug: 'acid-properties-and-transactions',
            estimatedMinutes: 20,
            orderIndex: 1,
            status: 'PUBLISHED',
            hinglishStatus: 'PUBLISHED',
            contentEn: `# ACID Properties & Database Transactions

A **Database Transaction** is a logical unit of database processing that includes one or more database access operations (read/write).

### The Four ACID Pillars
* **Atomicity**: Either all operations of the transaction are committed to the database, or none are (All-or-Nothing).
* **Consistency**: The database must remain in a consistent state before and after the transaction completes.
* **Isolation**: Concurrent transactions execute without interfering with one another.
* **Durability**: Once a transaction commits, its updates persist in non-volatile storage even during system crashes.`,
            contentHinglish: `# ACID Properties & Database Transactions 🇮🇳

Database me jab hum koi kaam karte hain (jaise bank account se paise transfer karna), to us group of operations ko **Transaction** kehte hain. Database ki reliability ke liye **ACID properties** follow hoti hain.

### ACID Ka Matlab:
* **Atomicity (All or Nothing)**: Ya to saari queries execute hongi, ya fir agar beech me koi error aaya to sab rollback (undo) ho jayega.
* **Consistency**: Transaction se pehle aur baad me database ke saare rules aur balance valid hone chahiye.
* **Isolation**: Agar do log ek sath transaction kar rahe hain, to unka data aapas me mix ya corrupt nahi hona chahiye.
* **Durability**: Ek baar transaction commit (success) ho gaya, to agar server crash bhi ho jaye to bhi data hard disk me safely save rahega.`,
            codeSnippetJava: `// SQL Transaction Structure
/*
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A1';
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'B2';
COMMIT;
*/`,
            codeSnippetCpp: ``,
            codeSnippetPython: ``
          }
        ],
        quizzes: []
      }
    ]
  },
  {
    id: 4,
    title: 'Computer Networks (CN) & Protocols',
    slug: 'computer-networks',
    track: 'NETWORKS',
    difficultyLevel: 'INTERMEDIATE',
    estimatedHours: 22,
    orderIndex: 4,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'OSI 7-Layer Model, TCP/IP, Routing Algorithms, DNS, HTTP/HTTPS, and Socket Programming.',
    description: 'Complete networking curriculum designed for computer science students covering packet routing, congestion control, and application layer protocols.',
    modules: [],
    quizzes: []
  },
  {
    id: 5,
    title: 'System Design & High-Scalability Architectures',
    slug: 'system-design-track-2026',
    track: 'SYSTEM_DESIGN',
    difficultyLevel: 'ADVANCED',
    estimatedHours: 40,
    orderIndex: 5,
    status: 'PUBLISHED',
    coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    shortDescription: 'Distributed Caching, Load Balancing, Microservices, Sharding, Message Queues, and Rate Limiters.',
    description: 'Design distributed large-scale applications like URL Shortener, Twitter Feed, Uber Dispatch, and WhatsApp chat.',
    modules: [],
    quizzes: []
  }
];
