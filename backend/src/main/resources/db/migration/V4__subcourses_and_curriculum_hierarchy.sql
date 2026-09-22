-- =================================================================
-- CodeOrbit Migration: V4__subcourses_and_curriculum_hierarchy.sql
-- Description: Additive schema for Subcourse entity and 4x4 hierarchy
-- Target Dialects: MySQL 8.0+ and H2 2.2+
-- =================================================================

-- 1. Create subcourses table
CREATE TABLE subcourses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    curriculum_level VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT,
    price_inr INT NOT NULL DEFAULT 0,
    is_free BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_subcourses_course_level UNIQUE (course_id, curriculum_level),
    CONSTRAINT fk_subcourses_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

CREATE INDEX idx_subcourses_course_order ON subcourses (course_id, order_index);

-- 2. Add subcourse_id to course_modules
ALTER TABLE course_modules ADD COLUMN subcourse_id BIGINT NULL;
ALTER TABLE course_modules ADD CONSTRAINT fk_modules_subcourse FOREIGN KEY (subcourse_id) REFERENCES subcourses (id) ON DELETE CASCADE;
CREATE INDEX idx_modules_subcourse ON course_modules (subcourse_id, order_index);

-- 3. Add subcourse_id to quizzes
ALTER TABLE quizzes ADD COLUMN subcourse_id BIGINT NULL;
ALTER TABLE quizzes ADD CONSTRAINT fk_quizzes_subcourse FOREIGN KEY (subcourse_id) REFERENCES subcourses (id) ON DELETE CASCADE;
CREATE INDEX idx_quizzes_subcourse ON quizzes (subcourse_id);

-- 4. Update default min_pass_score_percentage to 80% for all quizzes
UPDATE quizzes SET min_pass_score_percentage = 80 WHERE min_pass_score_percentage IS NOT NULL;
