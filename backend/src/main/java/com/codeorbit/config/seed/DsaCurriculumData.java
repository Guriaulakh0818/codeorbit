package com.codeorbit.config.seed;

import com.codeorbit.entity.*;
import org.springframework.stereotype.Component;

@Component
public class DsaCurriculumData {

    private final CurriculumSeedHelper helper;

    public DsaCurriculumData(CurriculumSeedHelper helper) {
        this.helper = helper;
    }

    public void seedDsaCurriculum(Course dsaCourse) {
        // ==========================================
        // LEVEL 1: BEGINNER (FREE)
        // ==========================================
        Subcourse dsaBeginner = helper.createSubcourse(
                dsaCourse, CurriculumLevel.BEGINNER, "DSA — Beginner Foundations", "dsa-beginner",
                "Core algorithmic complexity, basic linear structures, and fundamentals.", 0, true, 1
        );

        // Mod 1: Foundations & Big-O
        CourseModule bMod1 = helper.createModule(dsaCourse, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 1: Algorithmic Complexity & Foundations", "dsa-b-mod1-complexity",
                "Understanding time complexity, space complexity, Big-O notation, and asymptotic analysis.", 1);
        helper.createLesson(bMod1, "1.1 Introduction to Time & Space Complexity", "time-and-space-complexity", 15, 1,
                "# Introduction to Time & Space Complexity\n\nWhen writing algorithms, we evaluate performance using **Asymptotic Analysis**.\n\n### Big-O Notation\n* **O(1)** — Constant time\n* **O(log N)** — Logarithmic time\n* **O(N)** — Linear time\n* **O(N log N)** — Linearithmic time\n* **O(N²)** — Quadratic time",
                "# Time & Space Complexity\n\nAlgorithm design me performance measure karne ke liye Asymptotic Analysis use hota hai.",
                "public class ComplexityDemo {\n    public static int findMax(int[] arr) {\n        int max = arr[0];\n        for (int num : arr) { if (num > max) max = num; }\n        return max;\n    }\n}",
                "int findMax(const std::vector<int>& arr) {\n    int maxVal = arr[0];\n    for (int num : arr) { if (num > maxVal) maxVal = num; }\n    return maxVal;\n}",
                "def find_max(arr):\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val: max_val = num\n    return max_val"
        );
        helper.createLesson(bMod1, "1.2 Two Pointers Pattern", "two-pointers-pattern", 20, 2,
                "# Two Pointers Pattern\n\nThe two-pointer technique uses two indices to traverse an array from opposite ends or simultaneously.",
                "# Two Pointers Pattern\n\nDo indices use karke array ko efficiently traverse kiya jata hai.",
                "public int[] twoSum(int[] numbers, int target) {\n    int left = 0, right = numbers.length - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return new int[]{left + 1, right + 1};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return new int[]{};\n}",
                "std::vector<int> twoSum(std::vector<int>& numbers, int target) {\n    int l = 0, r = numbers.size() - 1;\n    while (l < r) {\n        int sum = numbers[l] + numbers[r];\n        if (sum == target) return {l + 1, r + 1};\n        else if (sum < target) l++; else r--;\n    }\n    return {};\n}",
                "def two_sum(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target: return [l+1, r+1]\n        elif s < target: l += 1\n        else: r -= 1\n    return []"
        );
        Quiz bQ1 = helper.createModuleQuiz(bMod1, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 1 Assessment: Complexity & Two Pointers", "dsa-b-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ1, "DSA Complexity");

        // Mod 2: Arrays & Dynamic Arrays
        CourseModule bMod2 = helper.createModule(dsaCourse, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 2: Arrays & Dynamic Arrays", "dsa-b-mod2-arrays",
                "Contiguous memory, resizing amortized cost, sliding window, and prefix sums.", 2);
        helper.createLesson(bMod2, "2.1 Sliding Window Technique", "sliding-window-technique", 20, 1,
                "# Sliding Window Technique\n\nSliding window converts nested loops into single-pass $O(N)$ operations for subarray problems.",
                "# Sliding Window Technique\n\nSubarray aur substring problems ko $O(N)$ me solve karne ka powerful technique.",
                "public int maxSubArrayLen(int[] nums, int k) {\n    int sum = 0, maxLen = 0, left = 0;\n    for (int right = 0; right < nums.length; right++) {\n        sum += nums[right];\n        while (sum > k) sum -= nums[left++];\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
                "int maxSubArrayLen(const std::vector<int>& nums, int k) {\n    int sum = 0, maxLen = 0, left = 0;\n    for (int right = 0; right < nums.size(); right++) {\n        sum += nums[right];\n        while (sum > k) sum -= nums[left++];\n        maxLen = std::max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
                "def max_subarray_len(nums, k):\n    s, max_len, left = 0, 0, 0\n    for right in range(len(nums)):\n        s += nums[right]\n        while s > k:\n            s -= nums[left]; left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len"
        );
        Quiz bQ2 = helper.createModuleQuiz(bMod2, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 2 Assessment: Arrays & Sliding Window", "dsa-b-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ2, "Arrays & Sliding Window");

        // Mod 3: Singly & Doubly Linked Lists
        CourseModule bMod3 = helper.createModule(dsaCourse, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 3: Linked Lists & Pointers", "dsa-b-mod3-linked-lists",
                "Singly linked lists, doubly linked lists, circular lists, and cycle detection.", 3);
        helper.createLesson(bMod3, "3.1 Floyd's Tortoise and Hare Cycle Detection", "floyds-cycle-detection", 20, 1,
                "# Floyd's Cycle Detection Algorithm\n\nDetects loops in linked lists in $O(N)$ time and $O(1)$ auxiliary space using fast and slow pointers.",
                "# Floyd's Cycle Detection Algorithm\n\nSlow aur Fast pointer use karke loop detect kiya jata hai.",
                "public boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
                "bool hasCycle(ListNode *head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
                "def has_cycle(head):\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False"
        );
        Quiz bQ3 = helper.createModuleQuiz(bMod3, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 3 Assessment: Linked Lists", "dsa-b-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ3, "Linked Lists");

        // Mod 4: Stacks, Queues & Monotonic Patterns
        CourseModule bMod4 = helper.createModule(dsaCourse, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 4: Stacks & Queues", "dsa-b-mod4-stacks-queues",
                "LIFO/FIFO paradigms, monotonic stacks, next greater element, and queue implementations.", 4);
        helper.createLesson(bMod4, "4.1 Next Greater Element with Monotonic Stack", "monotonic-stack-nge", 20, 1,
                "# Next Greater Element\n\nMonotonic decreasing stack resolves next greater element queries in linear time.",
                "# Next Greater Element\n\nMonotonic stack se har element ka next bada number $O(N)$ time me nikalte hain.",
                "public int[] nextGreaterElements(int[] nums) {\n    int[] res = new int[nums.length];\n    Arrays.fill(res, -1);\n    Stack<Integer> stack = new Stack<>();\n    for (int i = 0; i < nums.length; i++) {\n        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {\n            res[stack.pop()] = nums[i];\n        }\n        stack.push(i);\n    }\n    return res;\n}",
                "std::vector<int> nextGreaterElements(const std::vector<int>& nums) {\n    std::vector<int> res(nums.size(), -1);\n    std::stack<int> st;\n    for (int i = 0; i < nums.size(); i++) {\n        while (!st.empty() && nums[st.top()] < nums[i]) {\n            res[st.top()] = nums[i]; st.pop();\n        }\n        st.push(i);\n    }\n    return res;\n}",
                "def next_greater(nums):\n    res = [-1] * len(nums)\n    st = []\n    for i, num in enumerate(nums):\n        while st and nums[st[-1]] < num:\n            res[st.pop()] = num\n        st.append(i)\n    return res"
        );
        Quiz bQ4 = helper.createModuleQuiz(bMod4, dsaBeginner, CurriculumLevel.BEGINNER,
                "Module 4 Assessment: Stacks & Queues", "dsa-b-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ4, "Stacks & Queues");

        // Beginner Final Quiz (25 Questions)
        Quiz begFinal = helper.createFinalQuiz(bMod4, dsaBeginner, CurriculumLevel.BEGINNER,
                "Beginner Level Comprehensive Assessment (25 Questions)", "dsa-beginner-final-quiz",
                "Grand evaluation across Complexity, Arrays, Linked Lists, Stacks, and Queues. 80% required to graduate.", 80);
        seedTwentyFiveQuestions(begFinal, "DSA Beginner Comprehensive");

        // ==========================================
        // LEVEL 2: INTERMEDIATE (FREE)
        // ==========================================
        Subcourse dsaIntermediate = helper.createSubcourse(
                dsaCourse, CurriculumLevel.INTERMEDIATE, "DSA — Intermediate Trees & Graphs", "dsa-intermediate",
                "Trees, graphs, recursion, searching, and sorting algorithms.", 0, true, 2
        );

        // Mod 1: Binary Trees & BSTs
        CourseModule iMod1 = helper.createModule(dsaCourse, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1: Binary Trees & Binary Search Trees", "dsa-i-mod1-trees",
                "Tree traversals (Inorder, Preorder, Postorder, Level Order), BST operations, LCA, and height balancing.", 1);
        helper.createLesson(iMod1, "1.1 Tree Traversals: DFS & BFS", "tree-traversals-dfs-bfs", 25, 1,
                "# Tree Traversals (DFS & BFS)\n\nSystematic node exploration in hierarchical trees.\n* Inorder: Left -> Root -> Right\n* Preorder: Root -> Left -> Right\n* Postorder: Left -> Right -> Root\n* Level Order: BFS via Queue",
                "# Tree Traversals (DFS & BFS)\n\nTree ke har node ko visit karne ke alag alag tareeqe.",
                "public void inorder(TreeNode root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.val + \" \");\n    inorder(root.right);\n}",
                "void inorder(TreeNode* root) {\n    if (!root) return;\n    inorder(root->left);\n    std::cout << root->val << \" \";\n    inorder(root->right);\n}",
                "def inorder(root):\n    if not root: return\n    inorder(root.left)\n    print(root.val, end=' ')\n    inorder(root.right)"
        );
        Quiz iQ1 = helper.createModuleQuiz(iMod1, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1 Assessment: Binary Trees & BST", "dsa-i-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ1, "Binary Trees & BST");

        // Mod 2: Binary Heaps & Priority Queues
        CourseModule iMod2 = helper.createModule(dsaCourse, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2: Binary Heaps & Priority Queues", "dsa-i-mod2-heaps",
                "Min-heaps, max-heaps, heapify, heap sort, and top-K elements pattern.", 2);
        helper.createLesson(iMod2, "2.1 Top K Frequent Elements with Min-Heap", "top-k-frequent-heap", 20, 1,
                "# Top K Elements with Heap\n\nUsing a min-heap of size $K$ gives optimal $O(N \\log K)$ time.",
                "# Top K Elements\n\nMin-Heap use karke top $K$ elements ko find karna.",
                "public int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int num : nums) {\n        minHeap.offer(num);\n        if (minHeap.size() > k) minHeap.poll();\n    }\n    return minHeap.peek();\n}",
                "int findKthLargest(std::vector<int>& nums, int k) {\n    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;\n    for (int num : nums) {\n        minHeap.push(num);\n        if (minHeap.size() > k) minHeap.pop();\n    }\n    return minHeap.top();\n}",
                "def find_kth_largest(nums, k):\n    import heapq\n    return heapq.nlargest(k, nums)[-1]"
        );
        Quiz iQ2 = helper.createModuleQuiz(iMod2, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2 Assessment: Heaps & Priority Queues", "dsa-i-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ2, "Heaps & Priority Queues");

        // Mod 3: Graph Representations & Traversals (BFS/DFS)
        CourseModule iMod3 = helper.createModule(dsaCourse, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3: Graph Representations & Traversals", "dsa-i-mod3-graphs",
                "Adjacency list, BFS, DFS, connected components, and cycle detection.", 3);
        helper.createLesson(iMod3, "3.1 Breadth-First Search (BFS) in Graphs", "graph-bfs-traversal", 25, 1,
                "# Graph BFS Traversal\n\nBFS explores shortest paths on unweighted graphs level by level.",
                "# Graph BFS\n\nQueue ke zariye unweighted graph me shortest path find karne ka algorithm.",
                "public void bfs(int start, List<List<Integer>> adj, boolean[] visited) {\n    Queue<Integer> q = new LinkedList<>();\n    q.offer(start);\n    visited[start] = true;\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        for (int v : adj.get(u)) {\n            if (!visited[v]) {\n                visited[v] = true;\n                q.offer(v);\n            }\n        }\n    }\n}",
                "void bfs(int start, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {\n    std::queue<int> q;\n    q.push(start); visited[start] = true;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        for (int v : adj[u]) { if (!visited[v]) { visited[v] = true; q.push(v); } }\n    }\n}",
                "def bfs(start, adj, visited):\n    from collections import deque\n    q = deque([start])\n    visited.add(start)\n    while q:\n        u = q.popleft()\n        for v in adj[u]:\n            if v not in visited:\n                visited.add(v); q.append(v)"
        );
        Quiz iQ3 = helper.createModuleQuiz(iMod3, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3 Assessment: Graph Algorithms", "dsa-i-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ3, "Graph Algorithms");

        // Mod 4: Topological Sort & Shortest Path (Dijkstra)
        CourseModule iMod4 = helper.createModule(dsaCourse, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4: Advanced Graph Algorithms", "dsa-i-mod4-adv-graphs",
                "Kahn's algorithm, Topological Sort, Dijkstra's algorithm, and Disjoint Set Union (DSU).", 4);
        helper.createLesson(iMod4, "4.1 Dijkstra's Shortest Path Algorithm", "dijkstra-shortest-path", 25, 1,
                "# Dijkstra's Algorithm\n\nComputes single-source shortest path for non-negative weighted graphs in $O((V+E) \\log V)$.",
                "# Dijkstra's Algorithm\n\nWeighted graph me minimum cost path calculate karta hai.",
                "public int[] dijkstra(int n, List<List<int[]>> adj, int src) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));\n    dist[src] = 0;\n    pq.offer(new int[]{src, 0});\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int u = curr[0], d = curr[1];\n        if (d > dist[u]) continue;\n        for (int[] edge : adj.get(u)) {\n            int v = edge[0], w = edge[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{v, dist[v]});\n            }\n        }\n    }\n    return dist;\n}",
                "std::vector<int> dijkstra(int n, const std::vector<std::vector<std::pair<int,int>>>& adj, int src) {\n    std::vector<int> dist(n, 1e9);\n    std::priority_queue<std::pair<int,int>, std::vector<std::pair<int,int>>, std::greater<>> pq;\n    dist[src] = 0;\n    pq.push({0, src});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto& [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w; pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist;\n}",
                "def dijkstra(n, adj, src):\n    import heapq\n    dist = [float('inf')] * n\n    dist[src] = 0\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in adj[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist"
        );
        Quiz iQ4 = helper.createModuleQuiz(iMod4, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4 Assessment: Advanced Graphs & Dijkstra", "dsa-i-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ4, "Advanced Graphs & Shortest Path");

        // Intermediate Final Quiz (25 Questions)
        Quiz intFinal = helper.createFinalQuiz(iMod4, dsaIntermediate, CurriculumLevel.INTERMEDIATE,
                "Intermediate Level Comprehensive Assessment (25 Questions)", "dsa-intermediate-final-quiz",
                "Grand assessment across Trees, Heaps, Graphs, and Shortest Paths. 80% required to graduate.", 80);
        seedTwentyFiveQuestions(intFinal, "DSA Intermediate Comprehensive");

        // ==========================================
        // LEVEL 3: ADVANCED (FREE)
        // ==========================================
        Subcourse dsaAdvanced = helper.createSubcourse(
                dsaCourse, CurriculumLevel.ADVANCED, "DSA — Advanced Dynamic Programming", "dsa-advanced",
                "Dynamic programming, greedy algorithms, and advanced paradigms.", 0, true, 3
        );

        // Mod 1: 1D & 2D Dynamic Programming (Knapsack)
        CourseModule aMod1 = helper.createModule(dsaCourse, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 1: 1D & 2D Dynamic Programming", "dsa-a-mod1-dp-basics",
                "Memoization, 0/1 Knapsack, Unbounded Knapsack, and state transition equations.", 1);
        helper.createLesson(aMod1, "1.1 0/1 Knapsack & Subset Sum", "knapsack-subset-sum-dp", 30, 1,
                "# 0/1 Knapsack Problem\n\nMaximize value under capacity constraint $W$. $DP[i][w] = \\max(DP[i-1][w], val[i] + DP[i-1][w - wt[i]])$.",
                "# 0/1 Knapsack\n\nOptimal value choose karna jab har item ko maximum ek baar le sakte hain.",
                "public int knapsack(int W, int[] wt, int[] val, int n) {\n    int[] dp = new int[W + 1];\n    for (int i = 0; i < n; i++) {\n        for (int w = W; w >= wt[i]; w--) {\n            dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);\n        }\n    }\n    return dp[W];\n}",
                "int knapsack(int W, const std::vector<int>& wt, const std::vector<int>& val) {\n    std::vector<int> dp(W + 1, 0);\n    for (size_t i = 0; i < wt.size(); i++) {\n        for (int w = W; w >= wt[i]; w--) {\n            dp[w] = std::max(dp[w], val[i] + dp[w - wt[i]]);\n        }\n    }\n    return dp[W];\n}",
                "def knapsack(W, wt, val):\n    dp = [0] * (W + 1)\n    for w_i, v_i in zip(wt, val):\n        for w in range(W, w_i - 1, -1):\n            dp[w] = max(dp[w], v_i + dp[w - w_i])\n    return dp[W]"
        );
        Quiz aQ1 = helper.createModuleQuiz(aMod1, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 1 Assessment: 0/1 Knapsack & 1D DP", "dsa-a-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ1, "Knapsack & 1D DP");

        // Mod 2: String DP (LCS, Edit Distance)
        CourseModule aMod2 = helper.createModule(dsaCourse, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 2: String DP & Subsequences", "dsa-a-mod2-string-dp",
                "Longest Common Subsequence, Edit Distance, Longest Increasing Subsequence, and Palindromic Partitioning.", 2);
        helper.createLesson(aMod2, "2.1 Longest Common Subsequence (LCS)", "lcs-string-dp", 25, 1,
                "# Longest Common Subsequence\n\nFinds longest sequence appearing in both strings in identical relative order.",
                "# Longest Common Subsequence\n\nDo strings me common pattern dhoondhne ka standard DP problem.",
                "public int longestCommonSubsequence(String s1, String s2) {\n    int m = s1.length(), n = s2.length();\n    int[][] dp = new int[m + 1][n + 1];\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];\n            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[m][n];\n}",
                "int longestCommonSubsequence(std::string s1, std::string s2) {\n    int m = s1.size(), n = s2.size();\n    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (s1[i - 1] == s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];\n            else dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[m][n];\n}",
                "def lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]"
        );
        Quiz aQ2 = helper.createModuleQuiz(aMod2, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 2 Assessment: String DP & LCS", "dsa-a-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ2, "String DP & LCS");

        // Mod 3: Bit Manipulation & Tries
        CourseModule aMod3 = helper.createModule(dsaCourse, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 3: Bitmask DP & Trie Trees", "dsa-a-mod3-bitmask-tries",
                "Prefix Trees (Tries), Bitwise operations, XOR properties, and Bitmask DP representations.", 3);
        helper.createLesson(aMod3, "3.1 Prefix Tree (Trie) Implementation", "trie-prefix-tree-implementation", 25, 1,
                "# Prefix Tree (Trie)\n\nTries store associative keys for efficient $O(L)$ prefix lookup and auto-completion.",
                "# Trie Data Structure\n\nPrefix search aur dictionary operations ko fast karne ke liye Trie use hota hai.",
                "class TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEnd = false;\n}\npublic class Trie {\n    private TrieNode root = new TrieNode();\n    public void insert(String word) {\n        TrieNode curr = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();\n            curr = curr.children[idx];\n        }\n        curr.isEnd = true;\n    }\n}",
                "struct TrieNode {\n    TrieNode* children[26] = {nullptr};\n    bool isEnd = false;\n};\nclass Trie {\n    TrieNode* root = new TrieNode();\npublic:\n    void insert(const std::string& word) {\n        TrieNode* curr = root;\n        for (char c : word) {\n            int idx = c - 'a';\n            if (!curr->children[idx]) curr->children[idx] = new TrieNode();\n            curr = curr->children[idx];\n        }\n        curr->isEnd = true;\n    }\n};",
                "class Trie:\n    def __init__(self):\n        self.root = {}\n    def insert(self, word):\n        curr = self.root\n        for c in word:\n            if c not in curr: curr[c] = {}\n            curr = curr[c]\n        curr['#'] = True"
        );
        Quiz aQ3 = helper.createModuleQuiz(aMod3, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 3 Assessment: Bit Manipulation & Tries", "dsa-a-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ3, "Bit Manipulation & Tries");

        // Mod 4: Advanced Graph Matching & Segment Trees
        CourseModule aMod4 = helper.createModule(dsaCourse, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 4: Segment Trees & Range Queries", "dsa-a-mod4-segment-trees",
                "Range sum queries, point updates, lazy propagation, and Fenwick trees (Binary Indexed Trees).", 4);
        helper.createLesson(aMod4, "4.1 Segment Tree Range Sum & Point Update", "segment-tree-range-sum", 30, 1,
                "# Segment Tree\n\nSegment trees enable $O(\\log N)$ range queries and point modifications on static/dynamic arrays.",
                "# Segment Tree\n\nArray me range sum aur updates $O(\\log N)$ time me karta hai.",
                "public class SegmentTree {\n    int[] tree;\n    int n;\n    public SegmentTree(int[] arr) {\n        n = arr.length;\n        tree = new int[4 * n];\n        build(arr, 1, 0, n - 1);\n    }\n    private void build(int[] arr, int node, int start, int end) {\n        if (start == end) { tree[node] = arr[start]; return; }\n        int mid = (start + end) / 2;\n        build(arr, 2 * node, start, mid);\n        build(arr, 2 * node + 1, mid + 1, end);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n}",
                "class SegmentTree {\n    std::vector<int> tree;\n    int n;\n    void build(const std::vector<int>& arr, int node, int start, int end) {\n        if (start == end) { tree[node] = arr[start]; return; }\n        int mid = (start + end) / 2;\n        build(arr, 2 * node, start, mid); build(arr, 2 * node + 1, mid + 1, end);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\npublic:\n    SegmentTree(const std::vector<int>& arr) : n(arr.size()), tree(4 * arr.size()) { build(arr, 1, 0, n - 1); }\n};",
                "class SegmentTree:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.tree = [0] * (4 * self.n)\n        self._build(arr, 1, 0, self.n - 1)\n    def _build(self, arr, node, start, end):\n        if start == end: self.tree[node] = arr[start]; return\n        mid = (start + end) // 2\n        self._build(arr, 2 * node, start, mid)\n        self._build(arr, 2 * node + 1, mid + 1, end)\n        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]"
        );
        Quiz aQ4 = helper.createModuleQuiz(aMod4, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Module 4 Assessment: Segment Trees & Range Queries", "dsa-a-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ4, "Segment Trees & Range Queries");

        // Advanced Final Quiz (25 Questions)
        Quiz advFinal = helper.createFinalQuiz(aMod4, dsaAdvanced, CurriculumLevel.ADVANCED,
                "Advanced Level Comprehensive Assessment (25 Questions)", "dsa-advanced-final-quiz",
                "Grand graduation assessment across all of Data Structures & Algorithms. Score 80%+ to unlock Verified Certificate.", 80);
        seedTwentyFiveQuestions(advFinal, "DSA Advanced Comprehensive");

        // ==========================================
        // LEVEL 4: PLACEMENT READY (₹29)
        // ==========================================
        Subcourse dsaPlacement = helper.createSubcourse(
                dsaCourse, CurriculumLevel.PLACEMENT_READY, "DSA — Placement Ready Top Interview Kit", "dsa-placement-ready",
                "Curated FAANG/MAANG interview patterns and live coding questions.", 29, false, 4
        );

        CourseModule pMod1 = helper.createModule(dsaCourse, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1: Top Product Company Coding Patterns", "dsa-p-mod1-product-patterns",
                "Sliding window variations, two pointers, interval scheduling, and fast/slow pointer problem patterns.", 1);
        helper.createLesson(pMod1, "1.1 Interval Merging & Insertion Patterns", "interval-merging-pattern", 25, 1,
                "# Interval Merging Pattern\n\nGiven an array of meeting intervals, merge all overlapping intervals into contiguous time blocks.",
                "# Interval Merging Pattern\n\nOverlapping intervals ko merge karne ka placement pattern.",
                "public int[][] merge(int[][] intervals) {\n    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));\n    List<int[]> merged = new ArrayList<>();\n    for (int[] interval : intervals) {\n        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {\n            merged.add(interval);\n        } else {\n            merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);\n        }\n    }\n    return merged.toArray(new int[merged.size()][]);\n}",
                "std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {\n    std::sort(intervals.begin(), intervals.end());\n    std::vector<std::vector<int>> res;\n    for (auto& iv : intervals) {\n        if (res.empty() || res.back()[1] < iv[0]) res.push_back(iv);\n        else res.back()[1] = std::max(res.back()[1], iv[1]);\n    }\n    return res;\n}",
                "def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for iv in intervals:\n        if not merged or merged[-1][1] < iv[0]: merged.append(iv)\n        else: merged[-1][1] = max(merged[-1][1], iv[1])\n    return merged"
        );
        Quiz pQ1 = helper.createModuleQuiz(pMod1, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1 Assessment: Interval Patterns", "dsa-p-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ1, "Interval Patterns");

        CourseModule pMod2 = helper.createModule(dsaCourse, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2: High-Frequency Tree & Graph Interview Problems", "dsa-p-mod2-tree-graph-patterns",
                "Course Schedule (Cycle detection), Word Ladder, Alien Dictionary, and Lowest Common Ancestor.", 2);
        helper.createLesson(pMod2, "2.1 Lowest Common Ancestor in Binary Tree", "lowest-common-ancestor", 20, 1,
                "# Lowest Common Ancestor (LCA)\n\nFinding common ancestor node at deepest depth for two target nodes $p$ and $q$.",
                "# Lowest Common Ancestor\n\nTree me do nodes ka sabse deep common parent nikalna.",
                "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode left = lowestCommonAncestor(root.left, p, q);\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\n    if (left != null && right != null) return root;\n    return left != null ? left : right;\n}",
                "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    if (!root || root == p || root == q) return root;\n    TreeNode* left = lowestCommonAncestor(root->left, p, q);\n    TreeNode* right = lowestCommonAncestor(root->right, p, q);\n    if (left && right) return root;\n    return left ? left : right;\n}",
                "def lowest_common_ancestor(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lowest_common_ancestor(root.left, p, q)\n    right = lowest_common_ancestor(root.right, p, q)\n    if left and right: return root\n    return left or right"
        );
        Quiz pQ2 = helper.createModuleQuiz(pMod2, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2 Assessment: Tree & Graph Interview Problems", "dsa-p-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ2, "Tree & Graph Placement");

        CourseModule pMod3 = helper.createModule(dsaCourse, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3: Dynamic Programming Placement Bank", "dsa-p-mod3-dp-interview-bank",
                "Word Break, Coin Change, House Robber, and Minimum Path Sum.", 3);
        helper.createLesson(pMod3, "3.1 Coin Change Minimum Coins", "coin-change-problem", 20, 1,
                "# Coin Change Problem\n\nFind fewest coins needed to make up a given amount using DP.",
                "# Coin Change Problem\n\nMinimum number of coins calculate karne ka placement problem.",
                "public int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (i >= coin) dp[i] = Math.min(dp[i], 1 + dp[i - coin]);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}",
                "int coinChange(std::vector<int>& coins, int amount) {\n    std::vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) { if (i >= c) dp[i] = std::min(dp[i], 1 + dp[i - c]); }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}",
                "def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i >= c: dp[i] = min(dp[i], 1 + dp[i - c])\n    return dp[amount] if dp[amount] != float('inf') else -1"
        );
        Quiz pQ3 = helper.createModuleQuiz(pMod3, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3 Assessment: DP Interview Problems", "dsa-p-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ3, "DP Placement");

        CourseModule pMod4 = helper.createModule(dsaCourse, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4: System Design & Algorithmic Scalability", "dsa-p-mod4-system-design",
                "LRU Cache design, Consistent Hashing, Rate Limiting (Token Bucket), and Bloom Filters.", 4);
        helper.createLesson(pMod4, "4.1 LRU Cache Design with Doubly Linked List & HashMap", "lru-cache-design", 30, 1,
                "# LRU Cache Design\n\nCombines $O(1)$ HashMap lookup with $O(1)$ doubly linked list node eviction.",
                "# LRU Cache Design\n\nLeast Recently Used cache implementation $O(1)$ get aur put operations ke sath.",
                "class LRUCache {\n    private class Node { int key, val; Node prev, next; Node(int k, int v){key=k;val=v;} }\n    private final int capacity;\n    private final Map<Integer, Node> map = new HashMap<>();\n    private final Node head = new Node(0, 0), tail = new Node(0, 0);\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        head.next = tail; tail.prev = head;\n    }\n}",
                "class LRUCache {\n    int cap;\n    std::list<std::pair<int,int>> dll;\n    std::unordered_map<int, std::list<std::pair<int,int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n};",
                "class LRUCache:\n    def __init__(self, capacity: int):\n        from collections import OrderedDict\n        self.cache = OrderedDict()\n        self.cap = capacity"
        );
        Quiz pQ4 = helper.createModuleQuiz(pMod4, dsaPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4 Assessment: System Design & LRU Cache", "dsa-p-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ4, "System Design & LRU");
    }

    private void seedTenQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 10; i++) {
            String promptEn = String.format("In %s (Question %d): What is the optimal algorithmic property or time-complexity bound?", topic, i);
            String promptHinglish = String.format("%s me Question %d: Sabse optimal time complexity ya property kya hoti hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "O(1) Constant operations", "O(1) Constant time",
                    "O(log N) Logarithmic with divide-and-conquer", "O(log N) Divide and conquer",
                    "O(N) Linear traversal", "O(N) Linear scan",
                    "O(N^2) Quadratic nested iterations", "O(N^2) Nested loops"
            );
            String explanation = String.format("For %s Question %d, binary halving and optimal pointers ensure logarithmic bounds.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }

    private void seedTwentyFiveQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 25; i++) {
            String promptEn = String.format("Comprehensive Evaluation (%s - Q%d): Which statement accurately characterizes this algorithmic principle?", topic, i);
            String promptHinglish = String.format("Grand Assessment (%s - Q%d): Is algorithmic principle ke baare me konsa statement bilkul sahi hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "It degrades performance to O(N^3)", "Ye performance ko O(N^3) kar deta hai",
                    "It ensures optimal asymptotic complexity and guarantees correctness", "Ye optimal complexity aur correctness guarantee karta hai",
                    "It requires infinite auxiliary stack space", "Isko infinite memory chahiye",
                    "It is deprecated in modern software engineering", "Ye modern software me use nahi hota"
            );
            String explanation = String.format("For %s Question %d, mathematical induction and asymptotic bounds guarantee correctness.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }
}
