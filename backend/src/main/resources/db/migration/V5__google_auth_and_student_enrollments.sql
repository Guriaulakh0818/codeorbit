-- =================================================================
-- CodeOrbit Migration: V5__google_auth_and_student_enrollments.sql
-- Description: Google OAuth support and Student Subject Enrollment
-- Target Dialects: MySQL 8.0+ and H2 2.2+
-- =================================================================

-- 1. Extend Users table for Google Authentication
ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN auth_provider VARCHAR(32) NOT NULL DEFAULT 'LOCAL';
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(1000) NULL;
CREATE INDEX idx_users_google_id ON users (google_id);

-- 2. Create Student Enrollments Table
CREATE TABLE student_enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_enrollments_user_course UNIQUE (user_id, course_id),
    CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

CREATE INDEX idx_enrollments_user ON student_enrollments (user_id);
CREATE INDEX idx_enrollments_course ON student_enrollments (course_id);
