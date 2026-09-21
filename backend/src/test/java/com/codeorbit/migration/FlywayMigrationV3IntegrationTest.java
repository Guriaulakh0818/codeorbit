package com.codeorbit.migration;

import org.flywaydb.core.Flyway;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class FlywayMigrationV3IntegrationTest {

    private DataSource isolatedDataSource;
    private JdbcTemplate jdbcTemplate;
    private String dbName;

    @BeforeEach
    void setUp() {
        dbName = "flyway_v3_test_" + UUID.randomUUID().toString().replace("-", "");
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:" + dbName + ";DB_CLOSE_DELAY=-1;MODE=MySQL");
        ds.setUser("sa");
        ds.setPassword("");
        this.isolatedDataSource = ds;
        this.jdbcTemplate = new JdbcTemplate(ds);
    }

    @AfterEach
    void tearDown() {
        try (Connection conn = isolatedDataSource.getConnection()) {
            conn.createStatement().execute("SHUTDOWN");
        } catch (SQLException ignored) {
        }
    }

    @Test
    @DisplayName("V2 -> V3 Migration: Upgrades legacy data, sets 75% module quiz default, preserves attempt snapshots, and creates composite index")
    void testUpgradeFromV2ToV3_PreservesExistingDataAndAppliesDefaults() {
        // Step 1: Migrate strictly up to V2
        Flyway flywayV2 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("2")
                .load();
        flywayV2.migrate();

        // Step 2: Seed representative legacy data under V2 schema (prior to V3 changes)
        jdbcTemplate.update("""
            INSERT INTO users (id, full_name, email, password_hash, role, active, created_at)
            VALUES (101, 'Legacy Student', 'student@codeorbit.dev', '$2a$10$hash', 'STUDENT', TRUE, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO courses (id, title, slug, description, track, difficulty_level, estimated_hours, order_index, status, created_at)
            VALUES (1, 'Data Structures & Algorithms', 'dsa', 'Legacy DSA course description', 'DSA', 'BEGINNER', 35, 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO course_modules (id, course_id, title, slug, description, order_index, status, created_at)
            VALUES (10, 1, 'Arrays Module', 'arrays-module', 'Array fundamentals', 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO quizzes (id, module_id, title, slug, description, min_pass_score_percentage, max_attempts, status, created_at)
            VALUES (50, 10, 'Arrays Quiz', 'arrays-quiz', 'Arrays assessment', 80, 5, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO user_quiz_attempts (id, user_id, quiz_id, attempt_number, total_questions, answered_questions, correct_answers, score_percentage, pass_threshold_percentage, passed, submitted_at)
            VALUES (999, 101, 50, 1, 10, 10, 8, 80.00, 80, TRUE, CURRENT_TIMESTAMP(6))
        """);

        // Step 3: Apply V3 Migration
        Flyway flywayV3 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("3")
                .load();
        flywayV3.migrate();

        // Step 4: Verify upgraded course_modules row receives default 'BEGINNER'
        Map<String, Object> moduleRow = jdbcTemplate.queryForMap("SELECT * FROM course_modules WHERE id = 10");
        assertEquals("BEGINNER", moduleRow.get("curriculum_level"), "Legacy module must default to 'BEGINNER'");
        assertEquals("Arrays Module", moduleRow.get("title"));

        // Step 5: Verify upgraded quizzes row receives default 'MODULE_QUIZ' and threshold updated to 75%
        Map<String, Object> quizRow = jdbcTemplate.queryForMap("SELECT * FROM quizzes WHERE id = 50");
        assertEquals("MODULE_QUIZ", quizRow.get("quiz_type"), "Legacy quiz must default to 'MODULE_QUIZ'");
        assertNull(quizRow.get("curriculum_level"), "Legacy quiz curriculum_level column is nullable and should be null");
        assertEquals(75, ((Number) quizRow.get("min_pass_score_percentage")).intValue(), "Module quiz pass percentage must update to 75%");

        // Step 6: Verify historical user_quiz_attempts snapshot remains unmodified (80% threshold preserved)
        Map<String, Object> attemptRow = jdbcTemplate.queryForMap("SELECT * FROM user_quiz_attempts WHERE id = 999");
        assertEquals(80, ((Number) attemptRow.get("pass_threshold_percentage")).intValue(), "Historical attempt pass threshold must remain 80");
        assertEquals(80.00, ((Number) attemptRow.get("score_percentage")).doubleValue(), 0.001);
        assertEquals(Boolean.TRUE, attemptRow.get("passed"));

        // Step 7: Verify composite index metadata in INFORMATION_SCHEMA
        List<Map<String, Object>> indexColumns = jdbcTemplate.queryForList("""
            SELECT COLUMN_NAME, ORDINAL_POSITION
            FROM INFORMATION_SCHEMA.INDEX_COLUMNS
            WHERE TABLE_NAME = 'COURSE_MODULES' AND INDEX_NAME = 'IDX_MODULES_COURSE_LEVEL'
            ORDER BY ORDINAL_POSITION ASC
        """);
        assertEquals(3, indexColumns.size(), "Composite index idx_modules_course_level must have 3 columns");
        assertEquals("COURSE_ID", indexColumns.get(0).get("COLUMN_NAME"));
        assertEquals("CURRICULUM_LEVEL", indexColumns.get(1).get("COLUMN_NAME"));
        assertEquals("ORDER_INDEX", indexColumns.get(2).get("COLUMN_NAME"));
    }

    @Test
    @DisplayName("V3 Schema: Supports inserting Advanced modules, Level Final Quizzes, and NOT NULL constraint on curriculum_level")
    void testPostMigration_SupportsFourLevelsAndFinalQuizzes() {
        // Run full migration chain (V1 -> V2 -> V3)
        Flyway flyway = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .load();
        flyway.migrate();

        // Verify column nullability metadata
        Map<String, Object> colMeta = jdbcTemplate.queryForMap("""
            SELECT IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'COURSE_MODULES' AND COLUMN_NAME = 'CURRICULUM_LEVEL'
        """);
        assertEquals("NO", colMeta.get("IS_NULLABLE"), "curriculum_level in course_modules must be NOT NULL");

        // Insert course, Advanced module, and Advanced level-final quiz
        jdbcTemplate.update("""
            INSERT INTO courses (id, title, slug, description, track, difficulty_level, estimated_hours, order_index, status, created_at)
            VALUES (1, 'DSA Track', 'dsa', 'Complete DSA', 'DSA', 'ADVANCED', 50, 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO course_modules (id, course_id, title, slug, description, order_index, status, curriculum_level, created_at)
            VALUES (20, 1, 'Dynamic Programming & Graphs', 'dp-graphs', 'Advanced algorithms', 2, 'PUBLISHED', 'ADVANCED', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO quizzes (id, module_id, title, slug, description, min_pass_score_percentage, max_attempts, status, quiz_type, curriculum_level, created_at)
            VALUES (60, 20, 'Advanced Level Final Exam', 'advanced-final-exam', 'Comprehensive 25-Q exam', 80, 5, 'PUBLISHED', 'LEVEL_FINAL_QUIZ', 'ADVANCED', CURRENT_TIMESTAMP(6))
        """);

        // Verify inserted records
        Map<String, Object> moduleResult = jdbcTemplate.queryForMap("SELECT * FROM course_modules WHERE id = 20");
        assertEquals("ADVANCED", moduleResult.get("curriculum_level"));

        Map<String, Object> quizResult = jdbcTemplate.queryForMap("SELECT * FROM quizzes WHERE id = 60");
        assertEquals("LEVEL_FINAL_QUIZ", quizResult.get("quiz_type"));
        assertEquals("ADVANCED", quizResult.get("curriculum_level"));
        assertEquals(80, ((Number) quizResult.get("min_pass_score_percentage")).intValue());
    }
}
