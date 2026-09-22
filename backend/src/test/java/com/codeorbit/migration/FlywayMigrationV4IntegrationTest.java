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

class FlywayMigrationV4IntegrationTest {

    private DataSource isolatedDataSource;
    private JdbcTemplate jdbcTemplate;
    private String dbName;

    @BeforeEach
    void setUp() {
        dbName = "flyway_v4_test_" + UUID.randomUUID().toString().replace("-", "");
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
    @DisplayName("V3 -> V4 Migration: Creates subcourses table, adds subcourse_id to course_modules and quizzes, and updates default threshold to 80%")
    void testUpgradeFromV3ToV4_PreservesDataAndCreatesSubcourseHierarchy() {
        // Step 1: Migrate up to V3
        Flyway flywayV3 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("3")
                .load();
        flywayV3.migrate();

        // Step 2: Seed representative V3 course, module, quiz, and attempt
        jdbcTemplate.update("""
            INSERT INTO users (id, full_name, email, password_hash, role, active, created_at)
            VALUES (201, 'Student V4', 'studentv4@codeorbit.dev', '$2a$10$hash', 'STUDENT', TRUE, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO courses (id, title, slug, description, track, difficulty_level, estimated_hours, order_index, status, created_at)
            VALUES (1, 'Data Structures & Algorithms', 'dsa', 'DSA curriculum', 'DSA', 'BEGINNER', 35, 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO course_modules (id, course_id, title, slug, description, order_index, status, curriculum_level, created_at)
            VALUES (10, 1, 'Complexity Module', 'complexity-module', 'Big-O', 1, 'PUBLISHED', 'BEGINNER', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO quizzes (id, module_id, title, slug, description, min_pass_score_percentage, max_attempts, status, quiz_type, curriculum_level, created_at)
            VALUES (50, 10, 'Complexity Quiz', 'complexity-quiz', 'Assessment', 75, 5, 'PUBLISHED', 'MODULE_QUIZ', 'BEGINNER', CURRENT_TIMESTAMP(6))
        """);

        // Step 3: Run V4 migration
        Flyway flywayV4 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("4")
                .load();
        flywayV4.migrate();

        // Step 4: Verify subcourses table exists and supports insertion
        jdbcTemplate.update("""
            INSERT INTO subcourses (id, course_id, curriculum_level, title, slug, description, price_inr, is_free, order_index, status, created_at)
            VALUES (501, 1, 'BEGINNER', 'DSA Beginner', 'dsa-beginner', 'Beginner Subcourse', 0, TRUE, 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> subcourseRow = jdbcTemplate.queryForMap("SELECT * FROM subcourses WHERE id = 501");
        assertEquals("BEGINNER", subcourseRow.get("curriculum_level"));
        assertEquals("dsa-beginner", subcourseRow.get("slug"));
        assertEquals(0, ((Number) subcourseRow.get("price_inr")).intValue());
        assertEquals(Boolean.TRUE, subcourseRow.get("is_free"));

        // Step 5: Verify module and quiz can be linked to subcourse
        jdbcTemplate.update("UPDATE course_modules SET subcourse_id = 501 WHERE id = 10");
        jdbcTemplate.update("UPDATE quizzes SET subcourse_id = 501 WHERE id = 50");

        Map<String, Object> modRow = jdbcTemplate.queryForMap("SELECT * FROM course_modules WHERE id = 10");
        assertEquals(501L, ((Number) modRow.get("subcourse_id")).longValue());

        Map<String, Object> qRow = jdbcTemplate.queryForMap("SELECT * FROM quizzes WHERE id = 50");
        assertEquals(501L, ((Number) qRow.get("subcourse_id")).longValue());
        assertEquals(80, ((Number) qRow.get("min_pass_score_percentage")).intValue(), "Default module quiz threshold must be 80%");

        // Step 6: Verify index metadata on subcourses
        List<Map<String, Object>> subcourseIndex = jdbcTemplate.queryForList("""
            SELECT COLUMN_NAME, ORDINAL_POSITION
            FROM INFORMATION_SCHEMA.INDEX_COLUMNS
            WHERE TABLE_NAME = 'SUBCOURSES' AND INDEX_NAME = 'IDX_SUBCOURSES_COURSE_ORDER'
            ORDER BY ORDINAL_POSITION ASC
        """);
        assertEquals(2, subcourseIndex.size());
        assertEquals("COURSE_ID", subcourseIndex.get(0).get("COLUMN_NAME"));
        assertEquals("ORDER_INDEX", subcourseIndex.get(1).get("COLUMN_NAME"));
    }
}
