package com.codeorbit.config.seed;

import com.codeorbit.entity.*;
import org.springframework.stereotype.Component;

@Component
public class DbmsCurriculumData {

    private final CurriculumSeedHelper helper;

    public DbmsCurriculumData(CurriculumSeedHelper helper) {
        this.helper = helper;
    }

    public void seedDbmsCurriculum(Course dbmsCourse) {
        // ==========================================
        // LEVEL 1: BEGINNER (FREE)
        // ==========================================
        Subcourse dbmsBeginner = helper.createSubcourse(
                dbmsCourse, CurriculumLevel.BEGINNER, "DBMS — Beginner Foundations", "dbms-beginner",
                "Relational model, SQL fundamentals, DDL/DML, primary keys, foreign keys, and ER modeling.", 0, true, 1
        );

        // Mod 1: Relational Model & SQL Basics
        CourseModule bMod1 = helper.createModule(dbmsCourse, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 1: Relational Model & SQL Fundamentals", "dbms-b-mod1-relational-sql",
                "Relational schema, tuples, attributes, domains, keys, and DDL/DML operations.", 1);
        helper.createLesson(bMod1, "1.1 Relational Model & SQL DDL/DML", "dbms-relational-model-and-ddl", 15, 1,
                "# Relational Model & SQL Fundamentals\n\nThe relational model organizes data into tables (**Relations**) of rows (**Tuples**) and columns (**Attributes**).\n\n### Core SQL Subsets\n* **DDL (Data Definition Language)**: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`\n* **DML (Data Manipulation Language)**: `INSERT`, `UPDATE`, `DELETE`\n* **DQL (Data Query Language)**: `SELECT`, `WHERE`, `ORDER BY`",
                "# Relational Model aur SQL Basics\n\nRelational Database me tables, rows, columns aur SQL commands (DDL, DML, DQL) ka introduction.",
                "public class JdbcSqlDemo {\n    public static final String CREATE_TABLE_SQL =\n        \"CREATE TABLE students (id BIGINT PRIMARY KEY, name VARCHAR(100), gpa DOUBLE PRECISION);\";\n}",
                "// C++ SQL query structure\n#include <string>\nconst std::string insertQuery = \"INSERT INTO students (id, name, gpa) VALUES (1, 'Arjun', 3.9);\";",
                "def get_create_query():\n    return 'CREATE TABLE students (id INT PRIMARY KEY, name TEXT, gpa REAL);'"
        );
        helper.createLesson(bMod1, "1.2 SQL Constraints: Primary Key, Foreign Key & Unique", "dbms-sql-constraints", 20, 2,
                "# Integrity Constraints in Relational Databases\n\n* **Domain Constraint**: Values must belong to the valid attribute domain.\n* **Entity Integrity**: Primary key cannot be `NULL` and must be unique.\n* **Referential Integrity**: Foreign keys must reference a valid primary key in the parent table or be `NULL`.\n* **Cascading Options**: `ON DELETE CASCADE`, `ON UPDATE CASCADE`.",
                "# SQL Integrity Constraints\n\nPrimary Key, Foreign Key, Unique, Not Null aur Referential Integrity rules jo data consistency maintain karte hain.",
                "public class TableConstraintDefinition {\n    public static final String DDL =\n        \"CREATE TABLE orders (order_id BIGINT PRIMARY KEY, user_id BIGINT REFERENCES users(id) ON DELETE CASCADE);\";\n}",
                "// C++ DDL string\nconst char* ddl = \"CREATE TABLE orders (id INT PRIMARY KEY, user_id INT, FOREIGN KEY (user_id) REFERENCES users(id));\";",
                "create_table_sql = '''\nCREATE TABLE orders (\n    order_id INT PRIMARY KEY,\n    user_id INT REFERENCES users(id) ON DELETE CASCADE\n);\n'''"
        );
        Quiz bQ1 = helper.createModuleQuiz(bMod1, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 1 Assessment: Relational Model & SQL", "dbms-b-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ1, "Relational Model & SQL");

        // Mod 2: ER Modeling & Relational Mapping
        CourseModule bMod2 = helper.createModule(dbmsCourse, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 2: Entity-Relationship (ER) Modeling", "dbms-b-mod2-er-modeling",
                "Entities, relationships, cardinality ratios (1:1, 1:N, M:N), weak entities, and ER-to-relational schema mapping.", 2);
        helper.createLesson(bMod2, "2.1 ER Diagrams & Cardinality Mapping", "dbms-er-diagrams-and-cardinality", 20, 1,
                "# Entity-Relationship (ER) Diagrams\n\n* **Entity**: A real-world object distinguishable from other objects.\n* **Weak Entity**: An entity that does not possess a primary key on its own; identified via an identifying relationship and a partial key (discriminator).\n* **Cardinality Ratios**:\n  * 1:1 (One-to-One)\n  * 1:N (One-to-Many)\n  * M:N (Many-to-Many) -> Requires a junction/bridge table.",
                "# ER Diagrams aur Schema Mapping\n\nEntities, attributes, cardinality ratios aur weak entities ko relational tables me convert karne ka rule.",
                "public class ErMappingDemo {\n    // M:N relationship requires a junction table\n    public static final String JUNCTION_TABLE =\n        \"CREATE TABLE student_courses (student_id BIGINT, course_id BIGINT, PRIMARY KEY (student_id, course_id));\";\n}",
                "// C++ Schema Junction\nconst char* junctionSql = \"CREATE TABLE enrollment (s_id INT, c_id INT, PRIMARY KEY(s_id, c_id));\";",
                "enrollment_ddl = 'CREATE TABLE enrollments (student_id INT, course_id INT, PRIMARY KEY (student_id, course_id));'"
        );
        Quiz bQ2 = helper.createModuleQuiz(bMod2, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 2 Assessment: ER Modeling", "dbms-b-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ2, "ER Modeling");

        // Mod 3: Relational Algebra
        CourseModule bMod3 = helper.createModule(dbmsCourse, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 3: Relational Algebra Fundamentals", "dbms-b-mod3-relational-algebra",
                "Select (sigma), Project (pi), Union, Set Difference, Cartesian Product, Natural Join, and Theta Join.", 3);
        helper.createLesson(bMod3, "3.1 Relational Algebra Operators", "dbms-relational-algebra-operators", 20, 1,
                "# Relational Algebra Operators\n\nRelational algebra provides the mathematical foundation for SQL query processing.\n\n* **Selection ($\\sigma$)**: Filters rows satisfying a condition (corresponds to `WHERE`).\n* **Projection ($\\pi$)**: Selects specific attributes/columns (corresponds to `SELECT col1, col2`).\n* **Natural Join ($\\bowtie$)**: Combines relations on common attribute equality.",
                "# Relational Algebra Operators\n\nSelection (sigma), Projection (pi), Cartesian Product aur Joins ka mathematical calculation.",
                "public class RelationalAlgebraEquivalence {\n    // SQL: SELECT name FROM employee WHERE salary > 50000;\n    // RA:  \u03C0_name(\u03C3_{salary > 50000}(employee))\n}",
                "// C++ Comment on RA\n// pi_name(sigma_{dept='Engineering'}(Employee))",
                "# Equivalent in Python\ndef filter_and_project(records):\n    return [r['name'] for r in records if r['salary'] > 50000]"
        );
        Quiz bQ3 = helper.createModuleQuiz(bMod3, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 3 Assessment: Relational Algebra", "dbms-b-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ3, "Relational Algebra");

        // Mod 4: Advanced SQL Queries & Aggregations
        CourseModule bMod4 = helper.createModule(dbmsCourse, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 4: Advanced SQL Queries, Joins & Grouping", "dbms-b-mod4-sql-advanced",
                "INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, GROUP BY, HAVING, subqueries, and window functions.", 4);
        helper.createLesson(bMod4, "4.1 Joins & Aggregations (GROUP BY / HAVING)", "dbms-joins-and-aggregations", 25, 1,
                "# SQL Joins and Aggregations\n\n* **`INNER JOIN`**: Retains only matching rows from both tables.\n* **`LEFT JOIN`**: Retains all rows from left table, filling NULLs for non-matches.\n* **`HAVING` vs `WHERE`**: `WHERE` filters rows *before* aggregation; `HAVING` filters aggregated groups *after* `GROUP BY`.",
                "# SQL Joins aur Group By / Having\n\nInner Join, Outer Joins aur Group By ke sath Having clause use karke complex reporting queries likhna.",
                "public class SqlAggregations {\n    public static final String QUERY =\n        \"SELECT department_id, COUNT(*) AS emp_count, AVG(salary) AS avg_sal \" +\n        \"FROM employees WHERE status = 'ACTIVE' GROUP BY department_id HAVING AVG(salary) > 75000;\";\n}",
                "// C++ SQL builder\nconst char* complexQuery = \"SELECT dept_id, COUNT(*) FROM emp GROUP BY dept_id HAVING COUNT(*) > 5;\";",
                "agg_query = '''\nSELECT dept_id, AVG(salary) as avg_sal\nFROM employees\nWHERE status = 'ACTIVE'\nGROUP BY dept_id\nHAVING COUNT(*) >= 5\n'''"
        );
        Quiz bQ4 = helper.createModuleQuiz(bMod4, dbmsBeginner, CurriculumLevel.BEGINNER,
                "Module 4 Assessment: Advanced SQL & Joins", "dbms-b-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ4, "Advanced SQL & Joins");

        // Final Quiz: Beginner
        Quiz bFinalQuiz = helper.createFinalQuiz(bMod4, dbmsBeginner, CurriculumLevel.BEGINNER,
                "DBMS Beginner Level Final Certification Quiz", "dbms-beginner-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(bFinalQuiz, "DBMS Beginner Foundations");

        // ==========================================
        // LEVEL 2: INTERMEDIATE (FREE)
        // ==========================================
        Subcourse dbmsIntermediate = helper.createSubcourse(
                dbmsCourse, CurriculumLevel.INTERMEDIATE, "DBMS — Intermediate Architecture", "dbms-intermediate",
                "Normalization (1NF, 2NF, 3NF, BCNF), Functional Dependencies, Transactions, and ACID properties.", 0, true, 2
        );

        // Mod 1: Functional Dependencies
        CourseModule iMod1 = helper.createModule(dbmsCourse, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1: Functional Dependencies & Closure", "dbms-i-mod1-functional-dependencies",
                "Armstrong's Axioms, Attribute Closure, Finding Candidate Keys, and Minimal Cover.", 1);
        helper.createLesson(iMod1, "1.1 Functional Dependencies & Candidate Key Discovery", "dbms-fd-and-candidate-keys", 25, 1,
                "# Functional Dependencies & Attribute Closure\n\nA Functional Dependency $X \\rightarrow Y$ holds if whenever two tuples agree on $X$, they must also agree on $Y$.\n\n### Finding Candidate Keys with Attribute Closure $(X^+)$:\n1. Compute $(X^+)$ using given functional dependencies.\n2. If $(X^+)$ contains all attributes in relation $R$, then $X$ is a **Super Key**.\n3. If no proper subset of $X$ is a Super Key, then $X$ is a **Candidate Key**.",
                "# Functional Dependencies aur Candidate Key\n\nAttribute closure nikal kar Super Keys aur minimal Candidate Keys discover karna.",
                "public class CandidateKeyFinder {\n    // If X+ contains all attributes of R, X is a super key\n}",
                "// C++ Functional Dependency check\n// X -> Y means Y is uniquely determined by X",
                "def compute_closure(attributes, fds, current_set):\n    closure = set(current_set)\n    changed = True\n    while changed:\n        changed = False\n        for lhs, rhs in fds:\n            if set(lhs).issubset(closure) and not set(rhs).issubset(closure):\n                closure.update(rhs)\n                changed = True\n    return closure"
        );
        Quiz iQ1 = helper.createModuleQuiz(iMod1, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1 Assessment: Functional Dependencies", "dbms-i-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ1, "Functional Dependencies & Closure");

        // Mod 2: Normalization
        CourseModule iMod2 = helper.createModule(dbmsCourse, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2: Normalization (1NF, 2NF, 3NF, BCNF)", "dbms-i-mod2-normalization",
                "Decomposition, Lossless Join Decomposition, Dependency Preservation, 1NF, 2NF, 3NF, and BCNF.", 2);
        helper.createLesson(iMod2, "2.1 3NF vs BCNF & Lossless Decomposition", "dbms-normalization-3nf-bcnf", 25, 1,
                "# Normal Forms: 1NF to BCNF\n\n* **1NF**: Atomic attribute values; no repeating groups.\n* **2NF**: In 1NF and no partial dependency (non-prime attribute depends on proper subset of candidate key).\n* **3NF**: In 2NF and no transitive dependency ($X \\rightarrow Y$ implies $X$ is super key OR $Y$ is prime attribute).\n* **BCNF**: For every non-trivial $X \\rightarrow Y$, $X$ must be a super key.",
                "# Normalization 1NF to BCNF\n\nPartial dependencies aur Transitive dependencies remove karke data redundancy minimize karna.",
                "public class NormalizationRules {\n    // 3NF allows X -> Y if Y is prime attribute; BCNF requires X to be Super Key\n}",
                "// C++ Normal form check\n// BCNF is strictly stronger than 3NF",
                "def is_bcnf(relation_keys, fds):\n    for lhs, rhs in fds:\n        if set(rhs).issubset(set(lhs)): continue # trivial\n        if set(lhs) not in relation_keys:\n            return False\n    return True"
        );
        Quiz iQ2 = helper.createModuleQuiz(iMod2, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2 Assessment: Normalization", "dbms-i-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ2, "Normalization (1NF to BCNF)");

        // Mod 3: Transactions & ACID Properties
        CourseModule iMod3 = helper.createModule(dbmsCourse, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3: Transactions & ACID Properties", "dbms-i-mod3-acid",
                "Atomicity, Consistency, Isolation, Durability, Transaction States, and WAL (Write-Ahead Logging).", 3);
        helper.createLesson(iMod3, "3.1 ACID Properties & Write-Ahead Logging (WAL)", "dbms-acid-and-wal", 20, 1,
                "# ACID Properties of Database Transactions\n\n* **Atomicity**: All-or-nothing execution (guaranteed via Undo Log / WAL).\n* **Consistency**: Preserves database invariants and integrity constraints.\n* **Isolation**: Concurrent executions produce results equivalent to serial execution (guaranteed via 2PL / MVCC).\n* **Durability**: Committed data persists across crashes (guaranteed via Redo Log / WAL).",
                "# ACID Properties aur Write-Ahead Logging\n\nAtomicity, Consistency, Isolation aur Durability ka architectural implementation.",
                "import org.springframework.transaction.annotation.Transactional;\n\npublic class TransactionService {\n    @Transactional\n    public void transferFunds(Long fromId, Long toId, double amount) {\n        // Atomicity and Isolation managed by DB transaction manager\n    }\n}",
                "// C++ Transaction block concept\n// BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100; COMMIT;",
                "def transfer_funds(db, sender_id, receiver_id, amount):\n    with db.transaction():\n        db.execute('UPDATE accounts SET balance = balance - ? WHERE id = ?', (amount, sender_id))\n        db.execute('UPDATE accounts SET balance = balance + ? WHERE id = ?', (amount, receiver_id))"
        );
        Quiz iQ3 = helper.createModuleQuiz(iMod3, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3 Assessment: ACID & Transactions", "dbms-i-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ3, "ACID & Transactions");

        // Mod 4: Concurrency Control & Schedules
        CourseModule iMod4 = helper.createModule(dbmsCourse, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4: Concurrency Control & Serializability", "dbms-i-mod4-concurrency-control",
                "Conflict Serializability, Precedence Graph (Serialization Graph), View Serializability, and Recoverable Schedules.", 4);
        helper.createLesson(iMod4, "4.1 Conflict Serializability & Precedence Graphs", "dbms-conflict-serializability", 20, 1,
                "# Conflict Serializability & Precedence Graphs\n\nTwo operations conflict if they belong to different transactions, access the same data item, and at least one is a **write** operation.\n\n### Conflict Operations:\n* $R_i(X), W_j(X)$\n* $W_i(X), R_j(X)$\n* $W_i(X), W_j(X)$\n\n**Cycle Detection**: A schedule is Conflict Serializable if and only if its **Precedence Graph has no cycles**.",
                "# Conflict Serializability aur Precedence Graph\n\nPrecedence graph bana kar cycle check karna taaki verify ho sake ki schedule serializable hai.",
                "public class PrecedenceGraphCycleCheck {\n    // If cycle exists in directed precedence graph, schedule is NOT conflict serializable\n}",
                "// C++ Precedence Graph DFS Cycle Detection\n#include <vector>\nbool hasCycle(int node, std::vector<std::vector<int>>& adj, std::vector<int>& visited) {\n    visited[node] = 1;\n    for(int neighbor : adj[node]) {\n        if (visited[neighbor] == 1) return true;\n        if (visited[neighbor] == 0 && hasCycle(neighbor, adj, visited)) return true;\n    }\n    visited[node] = 2;\n    return false;\n}",
                "def is_conflict_serializable(num_transactions, conflicting_edges):\n    # Topological sort or DFS cycle check\n    return True"
        );
        Quiz iQ4 = helper.createModuleQuiz(iMod4, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4 Assessment: Concurrency Control", "dbms-i-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ4, "Concurrency Control & Serializability");

        // Final Quiz: Intermediate
        Quiz iFinalQuiz = helper.createFinalQuiz(iMod4, dbmsIntermediate, CurriculumLevel.INTERMEDIATE,
                "DBMS Intermediate Level Final Certification Quiz", "dbms-intermediate-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(iFinalQuiz, "DBMS Intermediate Architecture");

        // ==========================================
        // LEVEL 3: ADVANCED (FREE)
        // ==========================================
        Subcourse dbmsAdvanced = helper.createSubcourse(
                dbmsCourse, CurriculumLevel.ADVANCED, "DBMS — Advanced Storage & Query Optimization", "dbms-advanced",
                "Storage structures, B/B+ Trees, Hashing, Query Execution Engine, Cost-based Optimization, and Distributed DBs.", 0, true, 3
        );

        // Mod 1: Indexing & B+ Trees
        CourseModule aMod1 = helper.createModule(dbmsCourse, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 1: Indexing & B+ Tree Architecture", "dbms-a-mod1-indexing",
                "Primary vs Secondary Indexing, Clustered vs Non-Clustered, B-Tree vs B+ Tree, and node splitting/merging.", 1);
        helper.createLesson(aMod1, "1.1 B+ Tree Indexing Internals", "dbms-b-plus-tree-indexing", 25, 1,
                "# B+ Tree Architecture in Databases\n\nWhy databases prefer **B+ Trees** over binary search trees and standard B-trees:\n1. **High Fanout**: Minimizes disk I/O depth (height usually 3-4 for millions of rows).\n2. **Linked Leaf Nodes**: Leaf pages form a doubly-linked list, enabling extremely fast range scans (`BETWEEN` queries).\n3. **Clustered Index**: Data rows are stored directly in the leaf pages sorted by primary key.",
                "# B+ Tree Indexing Internals\n\nHigh fanout, linked leaf nodes aur range query optimization ke liye B+ Tree database storage engine ka backbone hai.",
                "public class BPlusTreeProperties {\n    // Leaf nodes contain all actual record pointers / rows and are linked sequentially\n}",
                "// C++ B+ Tree Leaf node representation\nstruct BPlusNode {\n    bool isLeaf;\n    int numKeys;\n    int keys[128];\n    void* pointers[129];\n    BPlusNode* nextLeaf;\n};",
                "class BPlusLeafNode:\n    def __init__(self):\n        self.keys = []\n        self.values = []\n        self.next = None"
        );
        Quiz aQ1 = helper.createModuleQuiz(aMod1, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 1 Assessment: Indexing & B+ Trees", "dbms-a-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ1, "Indexing & B+ Trees");

        // Mod 2: Query Processing & Cost Optimization
        CourseModule aMod2 = helper.createModule(dbmsCourse, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 2: Query Processing & Cost-Based Optimizer (CBO)", "dbms-a-mod2-query-optimization",
                "Query parsing, relational algebra equivalence, Nested Loop Join, Hash Join, Merge Join, and EXPLAIN ANALYZE.", 2);
        helper.createLesson(aMod2, "2.1 Join Algorithms: Nested Loop vs Hash Join vs Merge Join", "dbms-join-algorithms-and-cbo", 20, 1,
                "# Join Execution Algorithms\n\n* **Nested Loop Join**: $O(M \\times N)$; optimal when one table is small and inner table has index.\n* **Hash Join**: Builds hash table on smaller relation, probes with larger relation; $O(M + N)$.\n* **Sort-Merge Join**: Sorts both relations on join key, then merges linearly; optimal for pre-sorted inputs.",
                "# Join Algorithms aur Cost-Based Optimizer\n\nNested Loop, Hash Join aur Sort-Merge Join algorithms ki time complexity aur execution cost.",
                "public class JoinCostComparison {\n    // Hash Join cost: 3 * (B_R + B_S) disk page I/Os\n}",
                "// C++ Hash Join simulation\n#include <unordered_map>\n#include <vector>\n// Hash build on table R, probe with table S",
                "def hash_join(table_r, table_s, join_key):\n    ht = {}\n    for r in table_r:\n        ht.setdefault(r[join_key], []).append(r)\n    result = []\n    for s in table_s:\n        if s[join_key] in ht:\n            for r in ht[s[join_key]]:\n                result.append({**r, **s})\n    return result"
        );
        Quiz aQ2 = helper.createModuleQuiz(aMod2, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 2 Assessment: Query Optimization", "dbms-a-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ2, "Query Optimization & Joins");

        // Mod 3: MVCC & 2PL Locking
        CourseModule aMod3 = helper.createModule(dbmsCourse, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 3: MVCC & Two-Phase Locking (2PL)", "dbms-a-mod3-mvcc-and-2pl",
                "Strict 2PL, Rigorous 2PL, MVCC (PostgreSQL/MySQL InnoDB), Snapshot Isolation, and Phantom Reads.", 3);
        helper.createLesson(aMod3, "3.1 MVCC Internals & Snapshot Isolation", "dbms-mvcc-and-snapshot-isolation", 25, 1,
                "# Multi-Version Concurrency Control (MVCC)\n\nMVCC allows **readers to never block writers, and writers to never block readers**.\n\n* Each transaction sees a consistent snapshot of the database at its start timestamp.\n* Updates create a new version of the tuple with `xmin` (creation transaction ID) and `xmax` (deletion/expiry transaction ID).\n* Vacuuming / Garbage collection removes dead tuples.",
                "# MVCC aur Snapshot Isolation\n\nPostgreSQL aur MySQL InnoDB me MVCC readers aur writers ko block hone se kaise bachata hai.",
                "public class MvccConcept {\n    // Readers read older committed row version without acquiring exclusive locks\n}",
                "// C++ MVCC row header\nstruct RowHeader {\n    uint64_t xmin; // Created by XID\n    uint64_t xmax; // Expired by XID\n};",
                "def is_tuple_visible(tuple_xmin, tuple_xmax, current_snapshot_xids):\n    return tuple_xmin in current_snapshot_xids and tuple_xmax == 0"
        );
        Quiz aQ3 = helper.createModuleQuiz(aMod3, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 3 Assessment: MVCC & 2PL", "dbms-a-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ3, "MVCC & 2PL");

        // Mod 4: Distributed Databases & CAP Theorem
        CourseModule aMod4 = helper.createModule(dbmsCourse, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 4: Distributed Databases & CAP Theorem", "dbms-a-mod4-distributed-db",
                "CAP Theorem, PACELC, Two-Phase Commit (2PC), Sharding Strategies (Range vs Hash), and Replication (Leader-Follower vs Multi-Leader).", 4);
        helper.createLesson(aMod4, "4.1 Distributed Transactions & Two-Phase Commit (2PC)", "dbms-distributed-2pc-and-cap", 25, 1,
                "# Distributed Transactions & Two-Phase Commit (2PC)\n\nIn a distributed database, atomicity across multiple nodes is coordinated via **2PC**:\n1. **Prepare Phase**: Coordinator asks all participants: *Can you commit?* Participants acquire locks and write undo/redo logs, responding with `YES` or `NO`.\n2. **Commit Phase**: If all answered `YES`, coordinator broadcasts `GLOBAL_COMMIT`. If any answered `NO`, coordinator broadcasts `GLOBAL_ABORT`.",
                "# Distributed Databases aur Two-Phase Commit\n\nDistributed transactions me atomic consensus achieve karne ke liye Two-Phase Commit (2PC) protocol.",
                "public class TwoPhaseCommitCoordinator {\n    public enum Decision { PREPARE, COMMIT, ABORT }\n}",
                "// C++ 2PC State machine\nenum class Phase { PREPARE, COMMIT, ABORT };",
                "def two_phase_commit(participants):\n    # Phase 1: Prepare\n    votes = [p.prepare() for p in participants]\n    if all(v == 'READY' for v in votes):\n        for p in participants: p.commit()\n        return True\n    else:\n        for p in participants: p.abort()\n        return False"
        );
        Quiz aQ4 = helper.createModuleQuiz(aMod4, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "Module 4 Assessment: Distributed Databases & CAP", "dbms-a-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ4, "Distributed DBs & CAP");

        // Final Quiz: Advanced
        Quiz aFinalQuiz = helper.createFinalQuiz(aMod4, dbmsAdvanced, CurriculumLevel.ADVANCED,
                "DBMS Advanced Level Final Certification Quiz", "dbms-advanced-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(aFinalQuiz, "DBMS Advanced Storage & Systems");

        // ==========================================
        // LEVEL 4: PLACEMENT READY (₹29 PAID)
        // ==========================================
        Subcourse dbmsPlacement = helper.createSubcourse(
                dbmsCourse, CurriculumLevel.PLACEMENT_READY, "DBMS — Placement Preparation", "dbms-placement",
                "Top FAANG/Tier-1 interview question bank, real SQL query challenges, schema design rounds, and database tuning.", 29, false, 4
        );

        CourseModule pMod1 = helper.createModule(dbmsCourse, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1: Top 50 DBMS Interview Questions & Concepts", "dbms-p-mod1-top-questions",
                "Clustered vs Non-Clustered index trade-offs, isolation levels (Read Uncommitted to Serializable), and WAL crash recovery.", 1);
        helper.createLesson(pMod1, "1.1 Isolation Levels & Concurrency Anomalies", "dbms-isolation-levels-interview", 25, 1,
                "# Transaction Isolation Levels Deep Dive\n\n* **Read Uncommitted**: Suffers from Dirty Read, Non-Repeatable Read, Phantom Read.\n* **Read Committed**: Eliminates Dirty Reads.\n* **Repeatable Read**: Eliminates Dirty Reads and Non-Repeatable Reads.\n* **Serializable**: Eliminates all anomalies (Dirty Read, Non-Repeatable Read, Phantom Read, Serialization Anomaly).",
                "# Transaction Isolation Levels Interview Round\n\nDirty read, non-repeatable read aur phantom read anomalies ko kaise isolation levels prevent karte hain.",
                "public class IsolationLevelDemo {\n    public static void setLevel() {\n        // java.sql.Connection.TRANSACTION_SERIALIZABLE\n    }\n}",
                "// C++ Isolation string\nconst char* iso = \"SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\";",
                "def set_isolation_serializable(conn):\n    conn.set_isolation_level('SERIALIZABLE')"
        );
        Quiz pQ1 = helper.createModuleQuiz(pMod1, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1 Assessment: Isolation Levels & Core Interview Bank", "dbms-p-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ1, "DBMS Core Interview Bank");

        CourseModule pMod2 = helper.createModule(dbmsCourse, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2: Advanced SQL Query Challenges (LeetCode / Interview Format)", "dbms-p-mod2-sql-challenges",
                "Nth Highest Salary, Consecutive Numbers, Department Top Three Salaries, Cumulative Sums, and Gaps & Islands.", 2);
        helper.createLesson(pMod2, "2.1 Nth Highest Salary & Dense Ranking", "dbms-nth-highest-salary-window", 25, 1,
                "# Nth Highest Salary & Window Functions\n\n```sql\nWITH RankedSalaries AS (\n    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk\n    FROM Employee\n)\nSELECT DISTINCT salary FROM RankedSalaries WHERE rnk = :N;\n```\n* Using `DENSE_RANK()` handles duplicate salary ties cleanly.",
                "# Nth Highest Salary aur Window Functions\n\nLeetCode Hard SQL queries: DENSE_RANK(), ROW_NUMBER() aur LAG/LEAD functions.",
                "public class NthSalarySql {\n    public static final String SQL =\n        \"SELECT DISTINCT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) t WHERE rnk = ?;\";\n}",
                "// C++ SQL constant\nconst char* nthSalary = \"SELECT DISTINCT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) r FROM Emp) WHERE r = 2;\";",
                "nth_salary_sql = '''\nWITH Ranked AS (\n    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk\n    FROM Employee\n)\nSELECT salary FROM Ranked WHERE rnk = 2 LIMIT 1;\n'''"
        );
        Quiz pQ2 = helper.createModuleQuiz(pMod2, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2 Assessment: SQL Query Challenges", "dbms-p-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ2, "SQL Query Challenges");

        CourseModule pMod3 = helper.createModule(dbmsCourse, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3: Database Schema Design & Scalability Interviews", "dbms-p-mod3-schema-design",
                "Designing schemas for E-Commerce (Amazon), Social Network (Twitter/LinkedIn), Ride Sharing (Uber), and Streaming (Netflix).", 3);
        helper.createLesson(pMod3, "3.1 E-Commerce Schema Design: Inventory & Optimistic Locking", "dbms-ecommerce-schema-design", 25, 1,
                "# High-Concurrency Schema Design: E-Commerce Inventory\n\nHandling Flash Sales without overselling:\n* **Pessimistic Locking**: `SELECT * FROM inventory WHERE item_id = ? FOR UPDATE;`\n* **Optimistic Locking with Version Field**:\n```sql\nUPDATE inventory \nSET stock = stock - 1, version = version + 1 \nWHERE item_id = :id AND stock >= 1 AND version = :current_version;\n```",
                "# High-Concurrency Schema Design\n\nFlash sale inventory management me race conditions prevent karne ke liye Optimistic vs Pessimistic locking.",
                "public class OptimisticLockingRepo {\n    // UPDATE item SET stock = stock - 1, version = version + 1 WHERE id = :id AND version = :v\n}",
                "// C++ Optimistic Locking query\nconst char* optLock = \"UPDATE products SET stock = stock - 1 WHERE id = 101 AND stock > 0;\";",
                "def decrement_inventory(db, item_id, current_version):\n    rows = db.execute('UPDATE items SET stock = stock - 1, version = version + 1 WHERE id = ? AND version = ?', (item_id, current_version))\n    return rows > 0"
        );
        Quiz pQ3 = helper.createModuleQuiz(pMod3, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3 Assessment: Schema Design & Concurrency Rounds", "dbms-p-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ3, "Schema Design & Concurrency");

        CourseModule pMod4 = helper.createModule(dbmsCourse, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4: Performance Tuning, Index Optimization & EXPLAIN Plans", "dbms-p-mod4-performance-tuning",
                "Analyzing `EXPLAIN (ANALYZE, BUFFERS)`, Composite Index Column Ordering, Covering Indexes, and Connection Pool Sizing.", 4);
        helper.createLesson(pMod4, "4.1 Index Optimization: Leftmost Prefix Rule & Covering Indexes", "dbms-index-optimization-tuning", 30, 1,
                "# Index Tuning & Leftmost Prefix Rule\n\n* **Composite Index `(A, B, C)`**: Can satisfy queries filtering on `(A)`, `(A, B)`, and `(A, B, C)`. Cannot satisfy queries filtering only on `(B)` or `(C)`.\n* **Covering Index**: An index that contains all columns referenced by the query (in `SELECT`, `WHERE`, `JOIN`), eliminating table heap lookups entirely (Index-Only Scan).",
                "# Index Optimization aur EXPLAIN Plans\n\nComposite index leftmost prefix rule aur covering index use karke query latency drop karna.",
                "public class IndexOptimizationAdvice {\n    // Composite index on (status, created_at) satisfies WHERE status = 'ACTIVE' ORDER BY created_at\n}",
                "// C++ Index definition\nconst char* createIdx = \"CREATE INDEX idx_user_status ON users(status, created_at) INCLUDE (email);\";",
                "def explain_query_cost(db, sql):\n    return db.execute(f'EXPLAIN ANALYZE {sql}')"
        );
        Quiz pQ4 = helper.createModuleQuiz(pMod4, dbmsPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4 Assessment: Database Performance Tuning & EXPLAIN", "dbms-p-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ4, "DB Tuning & EXPLAIN");
    }

    private void seedTenQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 10; i++) {
            String promptEn = String.format("In %s (Question %d): What is the core DBMS relational rule or transaction guarantee?", topic, i);
            String promptHinglish = String.format("%s me Question %d: Relational DBMS ka core rule ya ACID guarantee kya hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "Primary keys can accept multiple NULL values freely", "Primary keys me NULL values allow hoti hain",
                    "ACID properties, strict normalization, and structured indexing guarantee relational integrity and fast retrieval", "ACID properties aur structured indexing relational integrity guarantee karti hain",
                    "A non-serializable schedule always maintains consistency", "Non-serializable schedule consistency maintain karta hai",
                    "Full table scans are always faster than B+ tree index traversals", "Table scan hamesha B+ tree se fast hota hai"
            );
            String explanation = String.format("For %s Question %d, ACID invariants, B+ tree leaf navigation, and relational constraints guarantee consistency.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }

    private void seedTwentyFiveQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 25; i++) {
            String promptEn = String.format("Comprehensive DBMS Evaluation (%s - Q%d): Which statement accurately characterizes this database principle?", topic, i);
            String promptHinglish = String.format("Grand DBMS Assessment (%s - Q%d): Is database principle ke baare me konsa statement bilkul sahi hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "It causes unrecoverable data loss in WAL logs", "Ye WAL logs me data loss karta hai",
                    "It ensures architectural correctness, eliminates anomalies, and maximizes query throughput", "Ye correctness ensure karta hai aur anomalies eliminate karta hai",
                    "It violates 1NF by allowing non-atomic multi-value sets", "Ye 1NF violate karta hai",
                    "It is obsolete in modern relational database engines", "Ye modern relational engines me obsolete hai"
            );
            String explanation = String.format("For %s Question %d, mathematical functional dependency analysis and ACID guarantees ensure database durability.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }
}
