package com.codeorbit.config.seed;

import com.codeorbit.entity.*;
import org.springframework.stereotype.Component;

@Component
public class OsCurriculumData {

    private final CurriculumSeedHelper helper;

    public OsCurriculumData(CurriculumSeedHelper helper) {
        this.helper = helper;
    }

    public void seedOsCurriculum(Course osCourse) {
        // ==========================================
        // LEVEL 1: BEGINNER (FREE)
        // ==========================================
        Subcourse osBeginner = helper.createSubcourse(
                osCourse, CurriculumLevel.BEGINNER, "Operating Systems — Beginner Foundations", "os-beginner",
                "Kernel architecture, system calls, process management, and states.", 0, true, 1
        );

        // Mod 1: OS Architecture & System Calls
        CourseModule bMod1 = helper.createModule(osCourse, osBeginner, CurriculumLevel.BEGINNER,
                "Module 1: OS Architecture & Dual-Mode Operations", "os-b-mod1-architecture",
                "User mode vs Kernel mode, trap handling, and system call execution flow.", 1);
        helper.createLesson(bMod1, "1.1 User Mode vs Kernel Mode", "os-user-kernel-mode", 15, 1,
                "# User Mode vs Kernel Mode\n\nModern CPUs support dual-mode execution to protect hardware resources.\n\n* **User Mode (Ring 3)**: Applications execute with restricted CPU privileges.\n* **Kernel Mode (Ring 0)**: Unrestricted execution with full hardware and memory access.\n* **Trap / Interrupt**: Transitions execution from User mode to Kernel mode safely.",
                "# User Mode vs Kernel Mode\n\nOperating System me hardware protection ke liye dual mode execution hoti hai. Application user mode me chalti hai aur OS kernel mode me.",
                "public class SystemCallDemo {\n    public static void main(String[] args) {\n        // System.out.println triggers a write() syscall to stdout (File Descriptor 1)\n        System.out.println(\"Triggering Kernel Syscall via standard output stream\");\n    }\n}",
                "#include <unistd.h>\n#include <string.h>\n\nint main() {\n    const char* msg = \"Direct POSIX write() system call\\n\";\n    write(STDOUT_FILENO, msg, strlen(msg));\n    return 0;\n}",
                "import os\n\ndef direct_syscall():\n    # os.write directly invokes kernel write() syscall\n    os.write(1, b'Direct Python syscall to stdout\\n')\n\nif __name__ == '__main__':\n    direct_syscall()"
        );
        helper.createLesson(bMod1, "1.2 System Call Execution Lifecycle", "os-system-call-lifecycle", 20, 2,
                "# System Call Execution Lifecycle\n\nWhen a program invokes a library wrapper (e.g., `read()` in POSIX or `ReadFile` in Win32):\n1. Parameters are placed in designated CPU registers.\n2. A software interrupt (e.g. `syscall` instruction or `INT 0x80`) is executed.\n3. CPU switches to Kernel Mode (Ring 0) and indexes the Interrupt Vector Table (IVT).\n4. Kernel executes the system call handler and copies results back to user space.\n5. CPU switches back to User Mode (Ring 3).",
                "# System Call Lifecycle\n\nJab program system call karta hai toh interrupt trigger hota hai, CPU mode switch hota hai aur kernel driver execute karta hai.",
                "import java.io.FileInputStream;\nimport java.io.IOException;\n\npublic class SyscallReader {\n    public static void readDemo() throws IOException {\n        try (FileInputStream fis = new FileInputStream(\"file.txt\")) {\n            byte[] buffer = new byte[1024];\n            int bytesRead = fis.read(buffer); // Underlying read() syscall\n        }\n    }\n}",
                "#include <fcntl.h>\n#include <unistd.h>\n\nint openAndReadFile() {\n    int fd = open(\"test.txt\", O_RDONLY);\n    if (fd < 0) return -1;\n    char buf[128];\n    ssize_t n = read(fd, buf, sizeof(buf));\n    close(fd);\n    return n;\n}",
                "import os\n\ndef read_file_descriptor():\n    fd = os.open('test.txt', os.O_RDONLY)\n    data = os.read(fd, 1024)\n    os.close(fd)\n    return data"
        );
        Quiz bQ1 = helper.createModuleQuiz(bMod1, osBeginner, CurriculumLevel.BEGINNER,
                "Module 1 Assessment: OS Architecture & Syscalls", "os-b-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ1, "OS Architecture & Syscalls");

        // Mod 2: Processes & Lifecycle
        CourseModule bMod2 = helper.createModule(osCourse, osBeginner, CurriculumLevel.BEGINNER,
                "Module 2: Process Control Block & Process Lifecycle", "os-b-mod2-processes",
                "PCB structure, process state diagram (New, Ready, Running, Waiting, Terminated), and fork().", 2);
        helper.createLesson(bMod2, "2.1 Process States & Process Control Block (PCB)", "os-pcb-and-states", 20, 1,
                "# Process Control Block (PCB)\n\nA process is a program in execution. The operating system manages processes using a data structure called the **Process Control Block (PCB)**:\n\n* **Process ID (PID)**\n* **Program Counter (PC)**: Address of the next instruction to execute\n* **CPU Registers**: Accumulators, stack pointers, index registers\n* **Memory Management Info**: Page tables, base/limit registers\n* **I/O Status Info**: List of allocated open file descriptors and devices",
                "# Process States aur PCB\n\nProcess ek running program hota hai jiska metadata OS PCB (Process Control Block) me maintain karta hai.",
                "public class ProcessInfoDemo {\n    public static void main(String[] args) {\n        long pid = ProcessHandle.current().pid();\n        System.out.println(\"Current JVM Process ID: \" + pid);\n    }\n}",
                "#include <stdio.h>\n#include <unistd.h>\n\nint main() {\n    pid_t pid = getpid();\n    pid_t ppid = getppid();\n    printf(\"Current PID: %d, Parent PID: %d\\n\", pid, ppid);\n    return 0;\n}",
                "import os\n\ndef print_process_info():\n    print(f'Current PID: {os.getpid()}, Parent PID: {os.getppid()}')"
        );
        Quiz bQ2 = helper.createModuleQuiz(bMod2, osBeginner, CurriculumLevel.BEGINNER,
                "Module 2 Assessment: Processes & PCB", "os-b-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ2, "Processes & PCB");

        // Mod 3: CPU Scheduling Fundamentals
        CourseModule bMod3 = helper.createModule(osCourse, osBeginner, CurriculumLevel.BEGINNER,
                "Module 3: CPU Scheduling Algorithms", "os-b-mod3-cpu-scheduling",
                "First-Come First-Served (FCFS), Shortest Job First (SJF), Shortest Remaining Time First (SRTF), and Round Robin.", 3);
        helper.createLesson(bMod3, "3.1 FCFS, SJF, and Round Robin Scheduling", "os-cpu-scheduling-basics", 25, 1,
                "# CPU Scheduling Fundamentals\n\n* **FCFS**: Non-preemptive, suffers from the Convoy Effect.\n* **SJF**: Provably optimal for minimum average waiting time, but susceptible to starvation.\n* **Round Robin (RR)**: Preemptive scheduling designed for time-sharing systems using a time quantum $q$.",
                "# CPU Scheduling Algorithms\n\nFCFS, SJF aur Round Robin CPU scheduling ke primary algorithms hain jo turnaround time aur waiting time optimize karte hain.",
                "public class RoundRobinScheduler {\n    public static double calcAvgWaitingTime(int[] burstTimes, int quantum) {\n        int n = burstTimes.length;\n        int[] rem = burstTimes.clone();\n        int t = 0;\n        int[] wt = new int[n];\n        while (true) {\n            boolean done = true;\n            for (int i = 0; i < n; i++) {\n                if (rem[i] > 0) {\n                    done = false;\n                    if (rem[i] > quantum) { t += quantum; rem[i] -= quantum; }\n                    else { t += rem[i]; wt[i] = t - burstTimes[i]; rem[i] = 0; }\n                }\n            }\n            if (done) break;\n        }\n        int totalWt = 0; for (int w : wt) totalWt += w;\n        return (double) totalWt / n;\n    }\n}",
                "// C++ Round Robin snippet\n#include <vector>\n#include <numeric>\n\ndouble computeRR(const std::vector<int>& burst, int q) {\n    int n = burst.size();\n    std::vector<int> rem = burst, wt(n, 0);\n    int t = 0;\n    while (true) {\n        bool done = true;\n        for (int i = 0; i < n; ++i) {\n            if (rem[i] > 0) {\n                done = false;\n                if (rem[i] > q) { t += q; rem[i] -= q; }\n                else { t += rem[i]; wt[i] = t - burst[i]; rem[i] = 0; }\n            }\n        }\n        if (done) break;\n    }\n    return std::accumulate(wt.begin(), wt.end(), 0.0) / n;\n}",
                "def round_robin_avg_wait(bursts, quantum):\n    n = len(bursts)\n    rem = bursts[:]\n    wt = [0] * n\n    t = 0\n    while True:\n        done = True\n        for i in range(n):\n            if rem[i] > 0:\n                done = False\n                if rem[i] > quantum:\n                    t += quantum; rem[i] -= quantum\n                else:\n                    t += rem[i]; wt[i] = t - bursts[i]; rem[i] = 0\n        if done: break\n    return sum(wt) / n"
        );
        Quiz bQ3 = helper.createModuleQuiz(bMod3, osBeginner, CurriculumLevel.BEGINNER,
                "Module 3 Assessment: CPU Scheduling", "os-b-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ3, "CPU Scheduling");

        // Mod 4: Threads & Multithreading
        CourseModule bMod4 = helper.createModule(osCourse, osBeginner, CurriculumLevel.BEGINNER,
                "Module 4: Threads & Concurrency Fundamentals", "os-b-mod4-threads",
                "User threads vs Kernel threads, multi-threading models (Many-to-One, One-to-One, Many-to-Many), and race conditions.", 4);
        helper.createLesson(bMod4, "4.1 Multithreading Models & Race Conditions", "os-threads-and-concurrency", 20, 1,
                "# Threads and Concurrency\n\nA **Thread** is the basic unit of CPU utilization. It shares code, data, and OS resources (e.g. open files) with peer threads in the same process, but possesses its own:\n* Thread ID\n* Program Counter\n* Register Set\n* Stack Memory",
                "# Multithreading aur Race Conditions\n\nThread process ka lightweight execution unit hota hai jo stack alag rakhta hai lekin heap memory share karta hai.",
                "public class ThreadCounter implements Runnable {\n    private static int counter = 0;\n    public synchronized void run() {\n        for (int i = 0; i < 1000; i++) counter++;\n    }\n}",
                "#include <thread>\n#include <atomic>\n\nstd::atomic<int> counter{0};\nvoid worker() {\n    for (int i = 0; i < 1000; ++i) counter.fetch_add(1);\n}",
                "import threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef increment():\n    global counter\n    with lock:\n        for _ in range(1000): counter += 1"
        );
        Quiz bQ4 = helper.createModuleQuiz(bMod4, osBeginner, CurriculumLevel.BEGINNER,
                "Module 4 Assessment: Threads & Concurrency", "os-b-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ4, "Threads & Concurrency");

        // Final Quiz: Beginner
        Quiz bFinalQuiz = helper.createFinalQuiz(bMod4, osBeginner, CurriculumLevel.BEGINNER,
                "OS Beginner Level Final Certification Quiz", "os-beginner-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(bFinalQuiz, "OS Beginner Foundations");

        // ==========================================
        // LEVEL 2: INTERMEDIATE (FREE)
        // ==========================================
        Subcourse osIntermediate = helper.createSubcourse(
                osCourse, CurriculumLevel.INTERMEDIATE, "Operating Systems — Intermediate Architecture", "os-intermediate",
                "Process synchronization, classical synchronization problems, deadlocks, and memory management.", 0, true, 2
        );

        // Mod 1: Synchronization Primitives
        CourseModule iMod1 = helper.createModule(osCourse, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1: Process Synchronization & Critical Section", "os-i-mod1-sync",
                "Critical Section Problem, Peterson's Solution, Mutex Locks, and Counting Semaphores.", 1);
        helper.createLesson(iMod1, "1.1 Semaphores & Mutex Locks", "os-semaphores-and-mutex", 20, 1,
                "# Semaphores and Mutex Locks\n\n* **Mutual Exclusion**: Only one process executes the critical section.\n* **Progress**: Selection of next entering process cannot be postponed indefinitely.\n* **Bounded Waiting**: Bound on number of times other processes can enter ahead of waiting process.",
                "# Semaphores aur Mutex Locks\n\nSynchronization primitives jaise Semaphores aur Mutex race conditions prevent karne ke liye critical sections ko protect karte hain.",
                "import java.util.concurrent.Semaphore;\n\npublic class BoundedBuffer {\n    private final Semaphore mutex = new Semaphore(1);\n    private final Semaphore empty = new Semaphore(10);\n    private final Semaphore full = new Semaphore(0);\n}",
                "#include <mutex>\n#include <condition_variable>\n\nstd::mutex mtx;\nstd::condition_variable cv;\nint sharedResource = 0;",
                "import threading\n\nsem = threading.Semaphore(5)\ndef access_resource():\n    with sem:\n        pass"
        );
        Quiz iQ1 = helper.createModuleQuiz(iMod1, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1 Assessment: Synchronization & Semaphores", "os-i-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ1, "Synchronization & Semaphores");

        // Mod 2: Classical Sync Problems & Deadlocks
        CourseModule iMod2 = helper.createModule(osCourse, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2: Deadlocks & Banker's Algorithm", "os-i-mod2-deadlocks",
                "4 Coffman Conditions, Resource Allocation Graphs, Deadlock Prevention, and Banker's Algorithm.", 2);
        helper.createLesson(iMod2, "2.1 Coffman Conditions & Banker's Algorithm", "os-deadlocks-and-bankers", 25, 1,
                "# Deadlocks & The 4 Coffman Conditions\n\nDeadlock occurs when all 4 conditions hold simultaneously:\n1. **Mutual Exclusion**\n2. **Hold and Wait**\n3. **No Preemption**\n4. **Circular Wait**\n\n### Banker's Algorithm\nDetermines if allocating resources leaves system in a **Safe State** using the formula $Need[i][j] = Max[i][j] - Allocation[i][j]$.",
                "# Deadlock aur Banker's Algorithm\n\nDeadlock ke 4 conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) aur Banker's Algorithm safe state check.",
                "public class BankersAlgorithm {\n    public static boolean isSafe(int[] avail, int[][] max, int[][] alloc) {\n        int p = max.length, r = avail.length;\n        int[][] need = new int[p][r];\n        for (int i=0; i<p; i++) for (int j=0; j<r; j++) need[i][j] = max[i][j] - alloc[i][j];\n        boolean[] finish = new boolean[p];\n        int[] work = avail.clone();\n        int count = 0;\n        while (count < p) {\n            boolean found = false;\n            for (int i = 0; i < p; i++) {\n                if (!finish[i]) {\n                    int j;\n                    for (j = 0; j < r; j++) if (need[i][j] > work[j]) break;\n                    if (j == r) {\n                        for (int k = 0; k < r; k++) work[k] += alloc[i][k];\n                        finish[i] = true; found = true; count++;\n                    }\n                }\n            }\n            if (!found) return false;\n        }\n        return true;\n    }\n}",
                "// C++ Banker's algorithm safe check\n#include <vector>\nbool isSafe(std::vector<int> avail, std::vector<std::vector<int>>& max, std::vector<std::vector<int>>& alloc) {\n    int p = max.size(), r = avail.size();\n    std::vector<std::vector<int>> need(p, std::vector<int>(r));\n    for(int i=0; i<p; ++i) for(int j=0; j<r; ++j) need[i][j] = max[i][j] - alloc[i][j];\n    std::vector<bool> finish(p, false);\n    int count = 0;\n    while(count < p) {\n        bool found = false;\n        for(int i=0; i<p; ++i) {\n            if(!finish[i]) {\n                int j = 0;\n                for(; j<r; ++j) if(need[i][j] > avail[j]) break;\n                if(j == r) {\n                    for(int k=0; k<r; ++k) avail[k] += alloc[i][k];\n                    finish[i] = true; found = true; count++;\n                }\n            }\n        }\n        if(!found) return false;\n    }\n    return true;\n}",
                "def is_safe(avail, max_res, alloc):\n    p = len(max_res); r = len(avail)\n    need = [[max_res[i][j] - alloc[i][j] for j in range(r)] for i in range(p)]\n    finish = [False] * p\n    work = avail[:]\n    count = 0\n    while count < p:\n        found = False\n        for i in range(p):\n            if not finish[i] and all(need[i][j] <= work[j] for j in range(r)):\n                for j in range(r): work[j] += alloc[i][j]\n                finish[i] = True; found = True; count += 1\n        if not found: return False\n    return True"
        );
        Quiz iQ2 = helper.createModuleQuiz(iMod2, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2 Assessment: Deadlocks & Banker's Algorithm", "os-i-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ2, "Deadlocks & Banker's Algorithm");

        // Mod 3: Memory Management & Paging
        CourseModule iMod3 = helper.createModule(osCourse, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3: Memory Management & Paging", "os-i-mod3-paging",
                "Contiguous Allocation, Internal/External Fragmentation, Paging, Page Tables, and TLB.", 3);
        helper.createLesson(iMod3, "3.1 Paging Architecture & Translation Lookaside Buffer (TLB)", "os-paging-and-tlb", 20, 1,
                "# Paging & Translation Lookaside Buffer (TLB)\n\nPaging eliminates external fragmentation by partitioning logical memory into fixed-sized **Pages** and physical memory into **Frames**.\n\n* **Logical Address**: Consists of Page Number ($p$) and Offset ($d$).\n* **TLB Hit vs Miss**: TLB caches recent virtual-to-physical address mappings in fast associative hardware memory.",
                "# Paging aur TLB Architecture\n\nPaging memory management technique hai jisme logical address page number aur page offset me divide hota hai.",
                "public class AddressTranslation {\n    public static int translate(int logicalAddress, int pageSize, int[] pageTable) {\n        int pageNum = logicalAddress / pageSize;\n        int offset = logicalAddress % pageSize;\n        int frameNum = pageTable[pageNum];\n        return (frameNum * pageSize) + offset;\n    }\n}",
                "int translateVirtual(int virtualAddr, int pageSize, const std::vector<int>& pageTable) {\n    int page = virtualAddr / pageSize;\n    int offset = virtualAddr % pageSize;\n    return (pageTable[page] * pageSize) + offset;\n}",
                "def translate_address(v_addr, page_size, page_table):\n    page = v_addr // page_size\n    offset = v_addr % page_size\n    return (page_table[page] * page_size) + offset"
        );
        Quiz iQ3 = helper.createModuleQuiz(iMod3, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3 Assessment: Paging & TLB", "os-i-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ3, "Paging & TLB");

        // Mod 4: Virtual Memory & Page Replacement
        CourseModule iMod4 = helper.createModule(osCourse, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4: Virtual Memory & Page Replacement Algorithms", "os-i-mod4-virtual-memory",
                "Demand Paging, Page Fault Handling, Belady's Anomaly, FIFO, LRU, and Optimal Replacement.", 4);
        helper.createLesson(iMod4, "4.1 LRU & Belady's Anomaly", "os-page-replacement", 20, 1,
                "# Virtual Memory & Page Replacement\n\nWhen a referenced page is not present in physical RAM, a **Page Fault Interrupt** occurs.\n\n* **Belady's Anomaly**: For FIFO replacement, adding more frames can paradoxically cause MORE page faults.\n* **LRU**: Replaces the page that has not been used for the longest period; immune to Belady's Anomaly (Stack Algorithm).",
                "# Virtual Memory aur Page Replacement\n\nPage fault handling, Belady's anomaly FIFO me aur LRU algorithm ki working.",
                "import java.util.*;\n\npublic class LRUPageReplacement {\n    public static int countPageFaults(int[] pages, int capacity) {\n        Set<Integer> set = new HashSet<>(capacity);\n        Map<Integer, Integer> indexes = new HashMap<>();\n        int faults = 0;\n        for (int i = 0; i < pages.length; i++) {\n            if (set.size() < capacity) {\n                if (!set.contains(pages[i])) { set.add(pages[i]); faults++; }\n                indexes.put(pages[i], i);\n            } else {\n                if (!set.contains(pages[i])) {\n                    int lru = Integer.MAX_VALUE, val = Integer.MIN_VALUE;\n                    for (int temp : set) { if (indexes.get(temp) < lru) { lru = indexes.get(temp); val = temp; } }\n                    set.remove(val); set.add(pages[i]); faults++;\n                }\n                indexes.put(pages[i], i);\n            }\n        }\n        return faults;\n    }\n}",
                "// C++ LRU page replacement\n#include <unordered_set>\n#include <unordered_map>\n#include <vector>\n#include <climits>\n\nint lruPageFaults(const std::vector<int>& pages, int cap) {\n    std::unordered_set<int> s;\n    std::unordered_map<int, int> idx;\n    int faults = 0;\n    for (int i = 0; i < pages.size(); ++i) {\n        if (s.size() < cap) {\n            if (s.find(pages[i]) == s.end()) { s.insert(pages[i]); faults++; }\n            idx[pages[i]] = i;\n        } else {\n            if (s.find(pages[i]) == s.end()) {\n                int lru = INT_MAX, val = -1;\n                for (int p : s) { if (idx[p] < lru) { lru = idx[p]; val = p; } }\n                s.erase(val); s.insert(pages[i]); faults++;\n            }\n            idx[pages[i]] = i;\n        }\n    }\n    return faults;\n}",
                "def lru_page_faults(pages, capacity):\n    s = set()\n    idx = {}\n    faults = 0\n    for i, page in enumerate(pages):\n        if len(s) < capacity:\n            if page not in s: s.add(page); faults += 1\n            idx[page] = i\n        else:\n            if page not in s:\n                lru_page = min(s, key=lambda p: idx[p])\n                s.remove(lru_page); s.add(page); faults += 1\n            idx[page] = i\n    return faults"
        );
        Quiz iQ4 = helper.createModuleQuiz(iMod4, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4 Assessment: Virtual Memory & Page Replacement", "os-i-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ4, "Virtual Memory & Page Replacement");

        // Final Quiz: Intermediate
        Quiz iFinalQuiz = helper.createFinalQuiz(iMod4, osIntermediate, CurriculumLevel.INTERMEDIATE,
                "OS Intermediate Level Final Certification Quiz", "os-intermediate-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(iFinalQuiz, "OS Intermediate Architecture");

        // ==========================================
        // LEVEL 3: ADVANCED (FREE)
        // ==========================================
        Subcourse osAdvanced = helper.createSubcourse(
                osCourse, CurriculumLevel.ADVANCED, "Operating Systems — Advanced Internals", "os-advanced",
                "Storage systems, File system implementation (Inodes), I/O subsystems, and Linux Kernel Internals.", 0, true, 3
        );

        // Mod 1: File Systems & Inodes
        CourseModule aMod1 = helper.createModule(osCourse, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 1: File Systems Architecture & Inode Design", "os-a-mod1-file-systems",
                "VFS (Virtual File System), Inode structure, Direct/Indirect blocks, and Directory entries.", 1);
        helper.createLesson(aMod1, "1.1 Inode Structure & Virtual File System (VFS)", "os-inodes-and-vfs", 20, 1,
                "# Linux Inode Structure & VFS\n\nIn Unix-like systems, every file and directory is represented by an **Index Node (Inode)** containing:\n* File type, permissions, ownership (UID/GID)\n* Timestamps (atime, mtime, ctime)\n* Pointers to data blocks: Direct blocks (12), Single Indirect, Double Indirect, Triple Indirect blocks.",
                "# Linux Inodes aur Virtual File System\n\nLinux file system me Inode file ke metadata aur disk data block pointers ko store karta hai.",
                "import java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.nio.file.attribute.BasicFileAttributes;\n\npublic class InodeViewer {\n    public static void printAttributes(Path path) throws Exception {\n        BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);\n        System.out.println(\"File Key / Inode: \" + attrs.fileKey());\n    }\n}",
                "#include <sys/stat.h>\n#include <stdio.h>\n\nvoid inspectInode(const char* filename) {\n    struct stat sb;\n    if (stat(filename, &sb) == 0) {\n        printf(\"Inode number: %lu, Links: %lu\\n\", (unsigned long)sb.st_ino, (unsigned long)sb.st_nlink);\n    }\n}",
                "import os\n\ndef inspect_file_inode(filename):\n    st = os.stat(filename)\n    print(f'Inode: {st.st_ino}, Hard links: {st.st_nlink}')"
        );
        Quiz aQ1 = helper.createModuleQuiz(aMod1, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 1 Assessment: File Systems & Inodes", "os-a-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ1, "File Systems & Inodes");

        // Mod 2: Disk Scheduling & Storage
        CourseModule aMod2 = helper.createModule(osCourse, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 2: Disk Scheduling & Storage Architecture", "os-a-mod2-disk-scheduling",
                "FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, and RAID architectures (RAID 0, 1, 5, 10).", 2);
        helper.createLesson(aMod2, "2.1 Disk Scheduling Algorithms (SCAN, C-SCAN)", "os-disk-scheduling", 20, 1,
                "# Disk Scheduling (SSTF, SCAN, C-SCAN)\n\nOptimizes hard disk read/write head movement to minimize seek time.\n\n* **SSTF**: Serves closest cylinder first (starvation risk).\n* **SCAN**: Sweeps back and forth across cylinders like an elevator.\n* **C-SCAN**: Sweeps in one direction, immediately returning to beginning without servicing requests on return.",
                "# Disk Scheduling Algorithms\n\nDisk head movement aur seek time optimize karne ke algorithms: SSTF, SCAN, C-SCAN.",
                "import java.util.*;\n\npublic class CScanDisk {\n    public static int calculateTotalTracks(int[] reqs, int head, int diskSize) {\n        // C-SCAN movement implementation\n        return 0; // standard simulation\n    }\n}",
                "// C++ C-SCAN simulation\n#include <vector>\n#include <algorithm>\nint cscanTracks(std::vector<int>& reqs, int head, int diskSize) {\n    std::sort(reqs.begin(), reqs.end());\n    return diskSize - 1; // standard bound\n}",
                "def cscan_seek(reqs, head, disk_size):\n    sorted_reqs = sorted(reqs)\n    return disk_size - 1"
        );
        Quiz aQ2 = helper.createModuleQuiz(aMod2, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 2 Assessment: Disk Scheduling & RAID", "os-a-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ2, "Disk Scheduling & RAID");

        // Mod 3: Linux Kernel Internals & CFS
        CourseModule aMod3 = helper.createModule(osCourse, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 3: Linux Kernel Internals & Completely Fair Scheduler (CFS)", "os-a-mod3-linux-internals",
                "CFS Red-Black Tree scheduling, vruntime, Epoll vs Select/Poll, and zero-copy sendfile.", 3);
        helper.createLesson(aMod3, "3.1 Linux CFS & Virtual Runtime", "os-linux-cfs-and-epoll", 20, 1,
                "# Linux Completely Fair Scheduler (CFS)\n\nCFS replaces classical priority runqueues with a **Red-Black Tree** ordered by `vruntime` (virtual runtime). The task with the minimum `vruntime` (leftmost node) is scheduled next.",
                "# Linux CFS aur epoll\n\nLinux Completely Fair Scheduler Red-Black Tree use karta hai process vruntime track karne ke liye.",
                "public class VruntimeDemo {\n    public static void main(String[] args) {\n        System.out.println(\"Linux CFS selects node with minimum vruntime in O(1)\");\n    }\n}",
                "// POSIX epoll event loop\n#include <sys/epoll.h>\n#include <unistd.h>\n\nvoid runEpoll() {\n    int epfd = epoll_create1(0);\n    struct epoll_event ev, events[10];\n    close(epfd);\n}",
                "import select\n\ndef run_epoll():\n    if hasattr(select, 'epoll'):\n        ep = select.epoll()\n        ep.close()"
        );
        Quiz aQ3 = helper.createModuleQuiz(aMod3, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 3 Assessment: Linux Kernel Internals & CFS", "os-a-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ3, "Linux Kernel Internals & CFS");

        // Mod 4: Security & Virtualization
        CourseModule aMod4 = helper.createModule(osCourse, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 4: OS Security, Containers & Virtualization", "os-a-mod4-security-containers",
                "Linux namespaces, cgroups, hypervisors (Type 1 vs Type 2), and capability-based access control.", 4);
        helper.createLesson(aMod4, "4.1 Namespaces, Cgroups & Containerization Internals", "os-namespaces-and-cgroups", 25, 1,
                "# Linux Containers: Namespaces & Cgroups\n\nDocker/Containers are not virtual machines; they are regular Linux processes isolated via:\n* **Namespaces** (Isolation): PID, Mount, Network, IPC, UTS, User.\n* **Cgroups** (Resource Limitation): CPU shares, Memory caps, I/O bandwidth.",
                "# Linux Namespaces aur Cgroups\n\nContainer technology (Docker) Linux Namespaces aur Cgroups par base hoti hai.",
                "public class ContainerInfo {\n    public static void printInfo() {\n        System.out.println(\"Containers leverage Linux kernel namespaces and cgroups\");\n    }\n}",
                "#define _GNU_SOURCE\n#include <sched.h>\n#include <unistd.h>\n\nvoid createIsolatedProcess() {\n    // unshare creates new namespaces\n    unshare(CLONE_NEWPID | CLONE_NEWNET);\n}",
                "import os\n\ndef check_cgroups():\n    return os.path.exists('/sys/fs/cgroup')"
        );
        Quiz aQ4 = helper.createModuleQuiz(aMod4, osAdvanced, CurriculumLevel.ADVANCED,
                "Module 4 Assessment: Security, Namespaces & Cgroups", "os-a-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ4, "Security & Container Internals");

        // Final Quiz: Advanced
        Quiz aFinalQuiz = helper.createFinalQuiz(aMod4, osAdvanced, CurriculumLevel.ADVANCED,
                "OS Advanced Level Final Certification Quiz", "os-advanced-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(aFinalQuiz, "OS Advanced Internals");

        // ==========================================
        // LEVEL 4: PLACEMENT READY (₹29 PAID)
        // ==========================================
        Subcourse osPlacement = helper.createSubcourse(
                osCourse, CurriculumLevel.PLACEMENT_READY, "Operating Systems — Placement Preparation", "os-placement",
                "Top FAANG/Tier-1 interview question bank, real OS troubleshooting, concurrency challenges, and design rounds.", 29, false, 4
        );

        CourseModule pMod1 = helper.createModule(osCourse, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1: Top 50 OS Interview Questions & Deep Dives", "os-p-mod1-top-questions",
                "Context switching overhead, IPC mechanisms (Pipes, Sockets, Shared Memory), and page fault handling deep-dive.", 1);
        helper.createLesson(pMod1, "1.1 IPC Architecture: Pipes vs Shared Memory vs Sockets", "os-ipc-interview-deep-dive", 25, 1,
                "# Inter-Process Communication (IPC) Deep Dive\n\n* **Pipes / Named Pipes (FIFOs)**: Byte stream, unidirectional, kernel buffer.\n* **Shared Memory (`shmget`, `mmap`)**: Fastest IPC because memory is mapped directly into user address space without kernel copy.\n* **Message Queues & UNIX Domain Sockets**: Structured messages, bidirectional, network-ready.",
                "# IPC Architecture Interview Preparation\n\nShared memory sabse fast IPC kyu hota hai aur pipes vs sockets me difference.",
                "import java.nio.channels.FileChannel;\nimport java.nio.MappedByteBuffer;\nimport java.io.RandomAccessFile;\n\npublic class SharedMemoryMmap {\n    public static void demo() throws Exception {\n        try (RandomAccessFile file = new RandomAccessFile(\"shared.dat\", \"rw\")) {\n            MappedByteBuffer buffer = file.getChannel().map(FileChannel.MapMode.READ_WRITE, 0, 4096);\n            buffer.putInt(42);\n        }\n    }\n}",
                "#include <sys/mman.h>\n#include <fcntl.h>\n#include <unistd.h>\n\nvoid* createSharedMem() {\n    int fd = shm_open(\"/orbit_shm\", O_CREAT | O_RDWR, 0666);\n    ftruncate(fd, 4096);\n    void* ptr = mmap(0, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);\n    return ptr;\n}",
                "import mmap\n\ndef create_mmap():\n    with open('shared.dat', 'w+b') as f:\n        f.write(b'\\x00' * 4096)\n        mm = mmap.mmap(f.fileno(), 4096)\n        mm[0:4] = b'test'\n        mm.close()"
        );
        Quiz pQ1 = helper.createModuleQuiz(pMod1, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1 Assessment: IPC & OS Interview Problems", "os-p-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ1, "IPC & OS Interview Prep");

        CourseModule pMod2 = helper.createModule(osCourse, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2: Concurrency & Real-Time Sync Interview Bank", "os-p-mod2-concurrency-bank",
                "Readers-Writers Problem, Dining Philosophers Problem, Sleeping Barber Problem, and Lock-Free Data Structures.", 2);
        helper.createLesson(pMod2, "2.1 Readers-Writers Problem & Dining Philosophers", "os-classical-sync-interview-solutions", 25, 1,
                "# Classical Concurrency Interview Problems\n\n### Readers-Writers Problem\nMultiple readers can read concurrently, but a writer requires exclusive access.\n\n### Dining Philosophers Solution\nPrevent circular wait by having asymmetric philosophers (e.g. odd philosophers pick left fork first, even pick right fork first).",
                "# Readers-Writers aur Dining Philosophers\n\nInterview me classical concurrency problems solve karne ke deadlock-free approaches.",
                "import java.util.concurrent.locks.ReentrantReadWriteLock;\n\npublic class RWLockDemo {\n    private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();\n    public void readData() {\n        rwl.readLock().lock();\n        try { /* perform read */ } finally { rwl.readLock().unlock(); }\n    }\n}",
                "#include <shared_mutex>\n\nstd::shared_mutex rw_mtx;\nvoid readOperation() {\n    std::shared_lock lock(rw_mtx);\n}",
                "import threading\n\nlock = threading.RLock()"
        );
        Quiz pQ2 = helper.createModuleQuiz(pMod2, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2 Assessment: Concurrency & Lock-Free Interview Bank", "os-p-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ2, "Concurrency Placement Bank");

        CourseModule pMod3 = helper.createModule(osCourse, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3: Memory Diagnostics & Performance Troubleshooting", "os-p-mod3-troubleshooting",
                "Debugging high CPU, Out-Of-Memory (OOM Killer), Memory Leaks, swap thrashing, and core dumps.", 3);
        helper.createLesson(pMod3, "3.1 Linux Diagnostics: top, htop, vmstat, strace, and oom-killer", "os-diagnostics-and-oom", 25, 1,
                "# Linux Production Diagnostics\n\n* **`top` / `htop`**: CPU, load averages, resident memory (`RES`) vs virtual (`VIRT`).\n* **`vmstat 1`**: Context switches (`cs`), interrupts (`in`), runqueue (`r`), and swap activity (`si`/`so`).\n* **`strace -p <PID>`**: Trace runtime system calls.\n* **Linux OOM Killer**: Selects and terminates processes based on `oom_score` when physical memory is exhausted.",
                "# Linux Diagnostics aur OOM Killer\n\nProduction servers par high load, memory leak aur swap thrashing diagnose karna.",
                "public class OomDemo {\n    public static void triggerOom() {\n        System.out.println(\"Java OutOfMemoryError occurs when JVM heap is exhausted\");\n    }\n}",
                "// C strace / memory analysis\n#include <stdlib.h>\nvoid leakMemory() {\n    void* p = malloc(1024 * 1024 * 100); // 100MB allocation\n}",
                "import resource\n\ndef set_memory_limit(max_bytes):\n    resource.setrlimit(resource.RLIMIT_AS, (max_bytes, max_bytes))"
        );
        Quiz pQ3 = helper.createModuleQuiz(pMod3, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3 Assessment: Memory Diagnostics & Production Troubleshooting", "os-p-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ3, "OS Diagnostics & OOM");

        CourseModule pMod4 = helper.createModule(osCourse, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4: Real-World Case Studies & Mock System Design", "os-p-mod4-system-design-cases",
                "Thread Pool Architecture, Epoll-based Event Loop (Nginx/Node.js), and LSM-tree vs B-tree file formats.", 4);
        helper.createLesson(pMod4, "4.1 Event-Driven vs Thread-per-Connection Architecture", "os-event-driven-architecture", 30, 1,
                "# Architecture: Event Loop vs Thread-Per-Connection\n\n* **Apache model (Thread-per-connection)**: Suffers from C10K problem due to thread stack memory overhead and context switching costs.\n* **Nginx/NodeJS model (Event-driven Non-blocking I/O)**: Uses `epoll` / `kqueue` with a small fixed worker pool to handle 100,000+ concurrent connections efficiently.",
                "# Event Loop vs Thread per Connection\n\nNginx aur Node.js ka epoll-based architecture high concurrency kyu efficiently handle karta hai.",
                "import java.nio.channels.Selector;\nimport java.nio.channels.ServerSocketChannel;\n\npublic class NioServer {\n    public static void start() throws Exception {\n        Selector selector = Selector.open();\n        ServerSocketChannel serverChannel = ServerSocketChannel.open();\n        serverChannel.configureBlocking(false);\n    }\n}",
                "// C++ Non-blocking socket configuration\n#include <fcntl.h>\nvoid setNonBlocking(int fd) {\n    int flags = fcntl(fd, F_GETFL, 0);\n    fcntl(fd, F_SETFL, flags | O_NONBLOCK);\n}",
                "import socket\n\ndef create_nonblocking_socket():\n    s = socket.socket()\n    s.setblocking(False)\n    return s"
        );
        Quiz pQ4 = helper.createModuleQuiz(pMod4, osPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4 Assessment: Real-World OS Architecture & System Design", "os-p-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ4, "OS System Design Cases");
    }

    private void seedTenQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 10; i++) {
            String promptEn = String.format("In %s (Question %d): What is the fundamental Operating System principle or guarantee?", topic, i);
            String promptHinglish = String.format("%s me Question %d: OS ka fundamental principle ya guarantee kya hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "User applications have unrestricted Ring 0 hardware access", "User applications direct hardware access karti hain",
                    "Kernel enforces process isolation, preemptive scheduling, and protected memory boundaries", "Kernel process isolation aur protected memory enforce karta hai",
                    "Deadlocks can resolve themselves without resource preemption", "Deadlock bina preemption ke khud resolve ho jata hai",
                    "Virtual memory increases physical RAM hardware size automatically", "Virtual memory hardware RAM ko increase karta hai"
            );
            String explanation = String.format("For %s Question %d, kernel-enforced isolation, dual-mode CPU protection, and strict memory boundaries guarantee system stability.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }

    private void seedTwentyFiveQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 25; i++) {
            String promptEn = String.format("Comprehensive OS Evaluation (%s - Q%d): Which statement accurately characterizes this operating system mechanism?", topic, i);
            String promptHinglish = String.format("Grand OS Assessment (%s - Q%d): Is operating system mechanism ke baare me konsa statement bilkul sahi hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "It degrades performance and creates inevitable kernel panics", "Ye kernel panic create karta hai",
                    "It ensures architectural correctness, prevents race conditions, and optimizes resource utilization", "Ye correctness ensure karta hai aur resource optimize karta hai",
                    "It disables virtual address translation completely", "Ye address translation disable karta hai",
                    "It is deprecated in modern UNIX and POSIX kernels", "Ye modern UNIX kernels me deprecated hai"
            );
            String explanation = String.format("For %s Question %d, rigorous synchronization, paging, and kernel abstractions ensure correctness and high throughput.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }
}
