-- =================================================================
-- CodeOrbit Migration: V3__four_level_curriculum.sql
-- Description: Additive schema for 4-level curriculum structure and quiz types
-- Target Dialects: MySQL 8.0+ and H2 2.2+
-- =================================================================

-- 1. Add curriculum_level to course_modules
ALTER TABLE course_modules 
    ADD COLUMN curriculum_level VARCHAR(32) NOT NULL DEFAULT 'BEGINNER';

CREATE INDEX idx_modules_course_level ON course_modules (course_id, curriculum_level, order_index);

-- 2. Add quiz_type and curriculum_level to quizzes
ALTER TABLE quizzes 
    ADD COLUMN quiz_type VARCHAR(32) NOT NULL DEFAULT 'MODULE_QUIZ';

ALTER TABLE quizzes 
    ADD COLUMN curriculum_level VARCHAR(32) NULL;

-- 3. Adjust default pass threshold for existing module quizzes to 75%
UPDATE quizzes SET min_pass_score_percentage = 75 WHERE quiz_type = 'MODULE_QUIZ';
