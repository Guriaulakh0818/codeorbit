-- =================================================================
-- CodeOrbit Migration: V2__learning_platform_schema.sql
-- Description: Additive schema for courses, modules, lessons, quizzes, attempts, and certificates
-- Target Dialects: MySQL 8.0+ and H2 2.2+
-- =================================================================

-- 1. Courses Table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    track VARCHAR(100) NOT NULL DEFAULT 'DSA',
    difficulty_level VARCHAR(50) NOT NULL DEFAULT 'BEGINNER',
    cover_image_url VARCHAR(1000),
    estimated_hours INT NOT NULL DEFAULT 35,
    order_index INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_courses_slug UNIQUE (slug),
    INDEX idx_courses_status_track (status, track)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Course Modules Table
CREATE TABLE course_modules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
    CONSTRAINT uk_modules_course_slug UNIQUE (course_id, slug),
    INDEX idx_modules_course_order (course_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Lessons Table
CREATE TABLE lessons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    estimated_minutes INT NOT NULL DEFAULT 15,
    order_index INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    content_en MEDIUMTEXT NOT NULL,
    content_hinglish MEDIUMTEXT NULL,
    hinglish_status VARCHAR(32) NOT NULL DEFAULT 'MISSING',
    code_snippet_java TEXT NULL,
    code_snippet_cpp TEXT NULL,
    code_snippet_python TEXT NULL,
    code_snippet_js TEXT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE RESTRICT,
    CONSTRAINT uk_lessons_module_slug UNIQUE (module_id, slug),
    INDEX idx_lessons_module_order (module_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Quizzes Table
CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT,
    min_pass_score_percentage INT NOT NULL DEFAULT 80,
    max_attempts INT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_quizzes_module FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE RESTRICT,
    CONSTRAINT uk_quizzes_module_slug UNIQUE (module_id, slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Quiz Questions Table
CREATE TABLE quiz_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    prompt_en TEXT NOT NULL,
    prompt_hinglish TEXT NULL,
    code_context TEXT NULL,
    options_json TEXT NOT NULL,
    correct_option_id VARCHAR(32) NOT NULL,
    explanation_en TEXT NOT NULL,
    explanation_hinglish TEXT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_questions_quiz_order (quiz_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. User Lesson Progress Table
CREATE TABLE user_lesson_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
    started_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    completed_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE RESTRICT,
    CONSTRAINT uk_user_lesson_progress UNIQUE (user_id, lesson_id),
    INDEX idx_user_progress_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. User Quiz Tracker Table (Pessimistic Locking / Atomic Attempt Counter Row)
CREATE TABLE user_quiz_trackers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    attempts_count INT NOT NULL DEFAULT 0,
    highest_score_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    has_passed BOOLEAN NOT NULL DEFAULT FALSE,
    last_attempt_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_tracker_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tracker_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE RESTRICT,
    CONSTRAINT uk_user_quiz_tracker UNIQUE (user_id, quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. User Quiz Attempts Table
CREATE TABLE user_quiz_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    attempt_number INT NOT NULL,
    total_questions INT NOT NULL,
    answered_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score_percentage DECIMAL(5,2) NOT NULL,
    pass_threshold_percentage INT NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE RESTRICT,
    CONSTRAINT uk_user_quiz_attempt_num UNIQUE (user_id, quiz_id, attempt_number),
    INDEX idx_user_quiz_attempts_passed (user_id, quiz_id, passed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. User Quiz Attempt Answers Table
CREATE TABLE user_quiz_attempt_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option_id VARCHAR(32) NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    displayed_language VARCHAR(16) NOT NULL DEFAULT 'en',
    prompt_snapshot TEXT NOT NULL,
    options_snapshot_json TEXT NOT NULL,
    selected_option_text_snapshot TEXT NULL,
    correct_option_id_snapshot VARCHAR(32) NOT NULL,
    correct_option_text_snapshot TEXT NOT NULL,
    explanation_snapshot TEXT NOT NULL,
    CONSTRAINT fk_attempt_answers_attempt FOREIGN KEY (attempt_id) REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_answers_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE RESTRICT,
    CONSTRAINT uk_attempt_question UNIQUE (attempt_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. User Course Bookmarks Table
CREATE TABLE user_course_bookmarks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmarks_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_lesson_bookmark UNIQUE (user_id, lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Certificates Table
CREATE TABLE certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    certificate_code VARCHAR(64) NOT NULL,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    student_full_name VARCHAR(255) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'VALID',
    revocation_reason VARCHAR(500) NULL,
    issued_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_certificates_code UNIQUE (certificate_code),
    CONSTRAINT uk_user_course_certificate UNIQUE (user_id, course_id),
    CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_certificates_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
    INDEX idx_certificates_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
