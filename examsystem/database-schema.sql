-- Online Examination System Database Schema
-- MySQL 8.0

-- Create Database
CREATE DATABASE IF NOT EXISTS exam_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE exam_system;

-- User Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(500) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    created_at BIGINT,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Table
CREATE TABLE IF NOT EXISTS exams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    duration INT NOT NULL,
    total_questions INT NOT NULL DEFAULT 0,
    created_by BIGINT NOT NULL,
    created_at BIGINT,
    updated_at BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Question Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text LONGTEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    exam_id BIGINT NOT NULL,
    created_at BIGINT,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_exam_id (exam_id),
    CHECK (correct_answer IN ('A', 'B', 'C', 'D'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Submission Table
CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    score DOUBLE NOT NULL DEFAULT 0,
    submitted_at BIGINT,
    created_at BIGINT,
    updated_at BIGINT,
    UNIQUE KEY unique_student_exam (student_id, exam_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_exam_id (exam_id),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Answer Table
CREATE TABLE IF NOT EXISTS answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option CHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at BIGINT,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_submission_id (submission_id),
    INDEX idx_question_id (question_id),
    CHECK (selected_option IN ('A', 'B', 'C', 'D'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert Sample Users
INSERT INTO users (email, name, password, role, created_at) VALUES
    ('admin1@example.com', 'Admin One', 'admin_password_hash_123', 'ADMIN', UNIX_TIMESTAMP() * 1000),
    ('admin2@example.com', 'Admin Two', 'admin_password_hash_456', 'ADMIN', UNIX_TIMESTAMP() * 1000),
    ('student1@example.com', 'John Doe', 'student_password_hash_123', 'STUDENT', UNIX_TIMESTAMP() * 1000),
    ('student2@example.com', 'Jane Smith', 'student_password_hash_456', 'STUDENT', UNIX_TIMESTAMP() * 1000),
    ('student3@example.com', 'Bob Johnson', 'student_password_hash_789', 'STUDENT', UNIX_TIMESTAMP() * 1000);

-- Insert Sample Exams (Created by Admin 1)
INSERT INTO exams (title, description, duration, total_questions, created_by, created_at, updated_at) VALUES
    ('Java Fundamentals', 'Test your knowledge of Java basics', 60, 3, 1, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
    ('Database Design', 'SQL and Database concepts', 90, 2, 1, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
    ('Web Development', 'HTML, CSS, and JavaScript', 75, 3, 2, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert Sample Questions for Java Fundamentals Exam
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, exam_id, created_at) VALUES
    ('What is Java?', 'A programming language', 'A coffee brand', 'An island', 'A type of chip', 'A', 1, UNIX_TIMESTAMP() * 1000),
    ('Which keyword is used to create a class?', 'class', 'Class', 'CLASS', 'define', 'A', 1, UNIX_TIMESTAMP() * 1000),
    ('What is the superclass of all classes in Java?', 'Object', 'Superclass', 'Class', 'Main', 'A', 1, UNIX_TIMESTAMP() * 1000);

-- Insert Sample Questions for Database Design Exam
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, exam_id, created_at) VALUES
    ('Which SQL statement is used to extract data?', 'FETCH', 'SELECT', 'EXTRACT', 'GET', 'B', 2, UNIX_TIMESTAMP() * 1000),
    ('What does ACID stand for?', 'Atomic, Consistency, Isolation, Durability', 'All Cases I Describe', 'Account Creation In Database', 'Application Code Isolation Data', 'A', 2, UNIX_TIMESTAMP() * 1000);

-- Insert Sample Questions for Web Development Exam
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, exam_id, created_at) VALUES
    ('What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'A', 3, UNIX_TIMESTAMP() * 1000),
    ('Which is NOT a valid CSS selector?', 'class selector', 'ID selector', 'element selector', 'range selector', 'D', 3, UNIX_TIMESTAMP() * 1000),
    ('What is the correct way to declare a variable in JavaScript?', 'var x = 5;', 'declare x = 5;', 'variable x = 5;', 'v x = 5;', 'A', 3, UNIX_TIMESTAMP() * 1000);

-- Insert Sample Submission (Student successfully submits an exam)
INSERT INTO submissions (student_id, exam_id, score, submitted_at, created_at, updated_at) VALUES
    (3, 1, 66.66, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
    (4, 1, 100.0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
    (3, 2, 100.0, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert Sample Answers
INSERT INTO answers (submission_id, question_id, selected_option, is_correct, created_at) VALUES
    -- Submission 1 (Student 1, Exam Java - 66.66% = 2 correct out of 3)
    (1, 1, 'A', TRUE, UNIX_TIMESTAMP() * 1000),
    (1, 2, 'A', TRUE, UNIX_TIMESTAMP() * 1000),
    (1, 3, 'B', FALSE, UNIX_TIMESTAMP() * 1000),
    -- Submission 2 (Student 2, Exam Java - 100% = 3 correct out of 3)
    (2, 1, 'A', TRUE, UNIX_TIMESTAMP() * 1000),
    (2, 2, 'A', TRUE, UNIX_TIMESTAMP() * 1000),
    (2, 3, 'A', TRUE, UNIX_TIMESTAMP() * 1000),
    -- Submission 3 (Student 1, Exam Database - 100% = 2 correct out of 2)
    (3, 4, 'B', TRUE, UNIX_TIMESTAMP() * 1000),
    (3, 5, 'A', TRUE, UNIX_TIMESTAMP() * 1000);

-- Verify Data
SELECT 'Users Count:' AS info, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Exams Count:', COUNT(*) FROM exams
UNION ALL
SELECT 'Questions Count:', COUNT(*) FROM questions
UNION ALL
SELECT 'Submissions Count:', COUNT(*) FROM submissions
UNION ALL
SELECT 'Answers Count:', COUNT(*) FROM answers;
