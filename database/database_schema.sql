-- ==========================================================
-- AttendX QR Attendance System
-- Professional Database Schema V1
-- Part 1 : Core Database
-- ==========================================================

DROP DATABASE IF EXISTS attendx_db;

CREATE DATABASE attendx_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE attendx_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS faculties;
DROP TABLE IF EXISTS course_enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS lecturers;
DROP TABLE IF EXISTS qr_sessions;
DROP TABLE IF EXISTS class_sessions;
DROP TABLE IF EXISTS timetables;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS system_settings;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- ROLES
-- ==========================================================

CREATE TABLE roles
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    role_name VARCHAR(30) NOT NULL UNIQUE,

    description VARCHAR(255)
);

-- ==========================================================
-- FACULTIES
-- ==========================================================

CREATE TABLE faculties
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    faculty_name VARCHAR(150) NOT NULL UNIQUE,

    faculty_code VARCHAR(20) UNIQUE,

    dean_name VARCHAR(150),

    office_phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- DEPARTMENTS
-- ==========================================================

CREATE TABLE departments
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    faculty_id INT NOT NULL,

    department_name VARCHAR(150) NOT NULL,

    department_code VARCHAR(20) UNIQUE,

    hod_name VARCHAR(150),

    office_phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_department_faculty
        FOREIGN KEY (faculty_id)
        REFERENCES faculties(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- USERS
-- Every person logs into the system from this table.
-- Admins, Lecturers and Students share one account table.
-- ==========================================================

CREATE TABLE users
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    role_id INT NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    gender ENUM
    (
        'Male',
        'Female',
        'Other'
    ) NOT NULL,

    profile_photo VARCHAR(255),

    is_active BOOLEAN DEFAULT TRUE,

    email_verified BOOLEAN DEFAULT FALSE,

    last_login DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
);

-- ==========================================================
-- LECTURERS
-- ==========================================================

CREATE TABLE lecturers
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    employee_no VARCHAR(30) NOT NULL UNIQUE,

    faculty_id INT NOT NULL,

    department_id INT NOT NULL,

    designation VARCHAR(100) NOT NULL,

    qualification VARCHAR(150),

    specialization VARCHAR(150),

    office_room VARCHAR(100),

    phone VARCHAR(20),

    joined_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lecturer_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_lecturer_faculty
        FOREIGN KEY(faculty_id)
        REFERENCES faculties(id),

    CONSTRAINT fk_lecturer_department
        FOREIGN KEY(department_id)
        REFERENCES departments(id)
);

-- ==========================================================
-- STUDENTS
-- ==========================================================

CREATE TABLE students
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    registration_no VARCHAR(30) NOT NULL UNIQUE,

    faculty_id INT NOT NULL,

    department_id INT NOT NULL,

    year_of_study ENUM('1','2','3','4') NOT NULL,

    semester ENUM('1','2') DEFAULT '1',

    intake_year YEAR NOT NULL,

    phone VARCHAR(20),

    address TEXT,

    guardian_name VARCHAR(150),

    guardian_phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_faculty
        FOREIGN KEY(faculty_id)
        REFERENCES faculties(id),

    CONSTRAINT fk_student_department
        FOREIGN KEY(department_id)
        REFERENCES departments(id)
);

-- ==========================================================
-- COURSES
-- ==========================================================

CREATE TABLE courses
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    course_code VARCHAR(20) NOT NULL UNIQUE,

    course_name VARCHAR(150) NOT NULL,

    description TEXT,

    credits INT DEFAULT 3,

    faculty_id INT NOT NULL,

    department_id INT NOT NULL,

    lecturer_id INT NOT NULL,

    academic_year ENUM('1','2','3','4') NOT NULL,

    semester ENUM('1','2') NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_course_faculty
        FOREIGN KEY(faculty_id)
        REFERENCES faculties(id),

    CONSTRAINT fk_course_department
        FOREIGN KEY(department_id)
        REFERENCES departments(id),

    CONSTRAINT fk_course_lecturer
        FOREIGN KEY(lecturer_id)
        REFERENCES lecturers(id)
);

-- ==========================================================
-- COURSE ENROLLMENTS
-- ==========================================================

CREATE TABLE course_enrollments
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,

    course_id INT NOT NULL,

    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status ENUM
    (
        'Active',
        'Completed',
        'Dropped'
    ) DEFAULT 'Active',

    UNIQUE(student_id, course_id),

    CONSTRAINT fk_enrollment_student
        FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_enrollment_course
        FOREIGN KEY(course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- TIMETABLES
-- Weekly Class Schedule
-- ==========================================================

CREATE TABLE timetables
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    course_id INT NOT NULL,

    lecturer_id INT NOT NULL,

    day_of_week ENUM
    (
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ) NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    room VARCHAR(100),

    academic_year ENUM('1','2','3','4'),

    semester ENUM('1','2'),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_timetable_course
        FOREIGN KEY(course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_timetable_lecturer
        FOREIGN KEY(lecturer_id)
        REFERENCES lecturers(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- CLASS SESSIONS
-- One record for each conducted lecture
-- ==========================================================

CREATE TABLE class_sessions
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    timetable_id INT NOT NULL,

    course_id INT NOT NULL,

    lecturer_id INT NOT NULL,

    session_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME,

    room VARCHAR(100),

    session_status ENUM
    (
        'Scheduled',
        'Started',
        'Completed',
        'Cancelled'
    )
    DEFAULT 'Scheduled',

    remarks TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_session_timetable
        FOREIGN KEY(timetable_id)
        REFERENCES timetables(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_session_course
        FOREIGN KEY(course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_session_lecturer
        FOREIGN KEY(lecturer_id)
        REFERENCES lecturers(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- QR SESSIONS
-- QR generated for every class session
-- ==========================================================

CREATE TABLE qr_sessions
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    class_session_id INT NOT NULL,

    qr_token VARCHAR(255) NOT NULL UNIQUE,

    qr_image VARCHAR(255),

    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    expires_at DATETIME NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    scan_limit INT DEFAULT NULL,

    total_scans INT DEFAULT 0,

    created_by INT NOT NULL,

    CONSTRAINT fk_qr_session
        FOREIGN KEY(class_session_id)
        REFERENCES class_sessions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_qr_creator
        FOREIGN KEY(created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- ATTENDANCE
-- ==========================================================

CREATE TABLE attendance
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    qr_session_id INT NOT NULL,

    class_session_id INT NOT NULL,

    student_id INT NOT NULL,

    attendance_status ENUM
    (
        'Present',
        'Late',
        'Absent'
    ) DEFAULT 'Present',

    marked_by ENUM
    (
        'QR',
        'Manual'
    ) DEFAULT 'QR',

    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    latitude DECIMAL(10,8) NULL,

    longitude DECIMAL(11,8) NULL,

    device_info VARCHAR(255),

    ip_address VARCHAR(50),

    remarks VARCHAR(255),

    UNIQUE(qr_session_id, student_id),

    CONSTRAINT fk_attendance_qr
        FOREIGN KEY(qr_session_id)
        REFERENCES qr_sessions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_attendance_session
        FOREIGN KEY(class_session_id)
        REFERENCES class_sessions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_attendance_student
        FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- NOTIFICATIONS
-- ==========================================================

CREATE TABLE notifications
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    notification_type ENUM
    (
        'System',
        'Attendance',
        'Course',
        'Reminder',
        'Announcement'
    ) DEFAULT 'System',

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- SYSTEM SETTINGS
-- ==========================================================

CREATE TABLE system_settings
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    setting_key VARCHAR(100) UNIQUE NOT NULL,

    setting_value TEXT,

    description VARCHAR(255),

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================================
-- ACTIVITY LOGS
-- ==========================================================

CREATE TABLE activity_logs
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    action VARCHAR(150) NOT NULL,

    module VARCHAR(100),

    description TEXT,

    ip_address VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_role
ON users(role_id);

CREATE INDEX idx_users_active
ON users(is_active);

CREATE INDEX idx_department_faculty
ON departments(faculty_id);

CREATE INDEX idx_lecturer_employee
ON lecturers(employee_no);

CREATE INDEX idx_student_registration
ON students(registration_no);

CREATE INDEX idx_student_department
ON students(department_id);

CREATE INDEX idx_course_code
ON courses(course_code);

CREATE INDEX idx_course_department
ON courses(department_id);

CREATE INDEX idx_course_lecturer
ON courses(lecturer_id);

CREATE INDEX idx_enrollment_student
ON course_enrollments(student_id);

CREATE INDEX idx_enrollment_course
ON course_enrollments(course_id);

CREATE INDEX idx_timetable_course
ON timetables(course_id);

CREATE INDEX idx_timetable_lecturer
ON timetables(lecturer_id);

CREATE INDEX idx_timetable_day
ON timetables(day_of_week);

CREATE INDEX idx_session_date
ON class_sessions(session_date);

CREATE INDEX idx_session_course
ON class_sessions(course_id);

CREATE INDEX idx_session_status
ON class_sessions(session_status);

CREATE INDEX idx_qr_token
ON qr_sessions(qr_token);

CREATE INDEX idx_qr_active
ON qr_sessions(is_active);

CREATE INDEX idx_qr_expiry
ON qr_sessions(expires_at);

CREATE INDEX idx_attendance_student
ON attendance(student_id);

CREATE INDEX idx_attendance_session
ON attendance(class_session_id);

CREATE INDEX idx_attendance_status
ON attendance(attendance_status);

CREATE INDEX idx_notification_user
ON notifications(user_id);

CREATE INDEX idx_notification_read
ON notifications(is_read);

CREATE INDEX idx_activity_user
ON activity_logs(user_id);

CREATE INDEX idx_activity_module
ON activity_logs(module);

CREATE INDEX idx_activity_date
ON activity_logs(created_at);

-- ==========================================================
-- DEFAULT SYSTEM SETTINGS
-- ==========================================================

INSERT INTO system_settings
(setting_key,setting_value,description)
VALUES

('system_name','AttendX QR Attendance System','Application Name'),

('attendance_window_minutes','10','QR attendance validity period'),

('allow_late_attendance','true','Allow late attendance'),

('qr_refresh_seconds','15','QR refresh interval'),

('max_login_attempts','5','Maximum login attempts'),

('default_timezone','Asia/Colombo','System Timezone'),

('attendance_latitude_range','100','Allowed GPS Radius (Meters)'),

('enable_email_notifications','false','Email Notifications');

-- ==========================================================
-- AttendX Database Schema V1
-- Part 5 : Sample Data
-- ==========================================================

USE attendx_db;

-- ==========================================================
-- ROLES
-- ==========================================================

INSERT INTO roles (role_name, description) VALUES
('admin','System Administrator'),
('lecturer','University Lecturer'),
('student','University Student');

-- ==========================================================
-- FACULTIES
-- ==========================================================

INSERT INTO faculties (faculty_name, faculty_code) VALUES
('Faculty of Computing','FOC'),
('Faculty of Applied Sciences','FAS'),
('Faculty of Management and Commerce','FMC'),
('Faculty of Technology','FOT');

-- ==========================================================
-- DEPARTMENTS
-- ==========================================================

INSERT INTO departments (faculty_id, department_name, department_code) VALUES
(1,'Computer Science','CS'),
(1,'Information Technology','IT'),
(1,'Software Engineering','SE'),
(2,'Mathematics','MATH'),
(3,'Business Administration','BA'),
(4,'Engineering Technology','ET');

-- ==========================================================
-- USERS
-- Password for all users:
-- Admin@123
-- (Replace hashes later with real password_hash())
-- ==========================================================

INSERT INTO users
(role_id,full_name,email,password_hash,gender)
VALUES

(1,'System Administrator',
'admin@attendx.com',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Male'),

(2,'Dr. Ahamed Niyas',
'niyas@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Male'),

(2,'Mrs. Fathima Rizana',
'rizana@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Female'),

(2,'Mr. Mohamed Fazil',
'fazil@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Male'),

(3,'Mohamed Ameen',
'ict2023001@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Male'),

(3,'Ayesha Nafeesa',
'ict2023002@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Female'),

(3,'Mohamed Rifas',
'ict2023003@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Male'),

(3,'Naleema Fathima',
'ict2023004@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Female'),

(3,'Mohamed Shibly',
'ict2023005@seusl.lk',
'$2y$10$123456789012345678901uS6PHKx2S5uJm0c6JgA9mO8vJH4v1R2',
'Male');

-- ==========================================================
-- LECTURERS
-- ==========================================================

INSERT INTO lecturers
(user_id,employee_no,faculty_id,department_id,designation,office_room)
VALUES

(2,'EMP001',1,1,'Senior Lecturer','A101'),

(3,'EMP002',1,2,'Lecturer','A102'),

(4,'EMP003',1,3,'Assistant Lecturer','A103');

-- ==========================================================
-- STUDENTS
-- ==========================================================

INSERT INTO students
(user_id,registration_no,faculty_id,department_id,year_of_study,semester)
VALUES

(5,'ICT/23/001',1,2,'2','1'),

(6,'ICT/23/002',1,2,'2','1'),

(7,'ICT/23/003',1,2,'2','1'),

(8,'ICT/23/004',1,2,'2','1'),

(9,'ICT/23/005',1,2,'2','1');

-- ==========================================================
-- COURSES
-- ==========================================================

INSERT INTO courses
(course_code,course_name,credits,academic_year,semester,lecturer_id)
VALUES

('ICT3213','Web Application Development',3,'2','1',1),

('ICT3222','Database Systems',3,'2','1',2),

('ICT3233','Software Engineering',3,'2','1',3);

-- ==========================================================
-- COURSE ENROLLMENTS
-- ==========================================================

INSERT INTO course_enrollments(student_id,course_id)
VALUES

(1,1),(2,1),(3,1),(4,1),(5,1),

(1,2),(2,2),(3,2),(4,2),(5,2),

(1,3),(2,3),(3,3),(4,3),(5,3);

-- ==========================================================
-- TIMETABLE
-- ==========================================================

INSERT INTO timetables
(course_id,lecturer_id,day_of_week,start_time,end_time,room,academic_year,semester)
VALUES

(1,1,'Monday','09:00:00','11:00:00','Lab-01','2','1'),

(2,2,'Tuesday','11:00:00','13:00:00','Lab-02','2','1'),

(3,3,'Wednesday','14:00:00','16:00:00','Lab-03','2','1');

-- ==========================================================
-- CLASS SESSION
-- ==========================================================

INSERT INTO class_sessions
(timetable_id,course_id,lecturer_id,session_date,start_time,room,session_status)
VALUES

(1,1,1,CURDATE(),'09:00:00','Lab-01','Scheduled');

-- ==========================================================
-- QR SESSION
-- ==========================================================

INSERT INTO qr_sessions
(class_session_id,qr_token,expires_at,created_by)
VALUES

(
1,
UUID(),
DATE_ADD(NOW(),INTERVAL 10 MINUTE),
2
);

-- ==========================================================
-- SAMPLE NOTIFICATION
-- ==========================================================

INSERT INTO notifications
(user_id,title,message,notification_type)
VALUES

(
1,
'Welcome',
'AttendX System Installed Successfully.',
'System'
);

-- ==========================================================
-- SAMPLE LOG
-- ==========================================================

INSERT INTO activity_logs
(user_id,action,module,description)
VALUES

(
1,
'System Installation',
'Database',
'AttendX Database Initialized Successfully'
);

-- ==========================================================
-- END OF DATABASE
-- ==========================================================