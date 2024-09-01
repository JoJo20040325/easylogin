-- MySQL 初始化脚本
-- 用于创建数据库、表和索引

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS login_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 切换到新创建的数据库
USE login_system;

-- 创建users表（如果不存在）
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_username (username),
    UNIQUE KEY unique_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建refresh_tokens表（如果不存在）
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_token (token),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 为users表创建索引（如果不存在）
SET @exist := (SELECT COUNT(1) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME = 'users' AND INDEX_NAME = 'idx_username');
SET @sqlstmt := IF( @exist = 0, 'CREATE INDEX idx_username ON users(username)', 'SELECT ''Index idx_username already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(1) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME = 'users' AND INDEX_NAME = 'idx_email');
SET @sqlstmt := IF( @exist = 0, 'CREATE INDEX idx_email ON users(email)', 'SELECT ''Index idx_email already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 为refresh_tokens表创建索引（如果不存在）
SET @exist := (SELECT COUNT(1) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME = 'refresh_tokens' AND INDEX_NAME = 'idx_token');
SET @sqlstmt := IF( @exist = 0, 'CREATE INDEX idx_token ON refresh_tokens(token)', 'SELECT ''Index idx_token already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(1) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME = 'refresh_tokens' AND INDEX_NAME = 'idx_user_id');
SET @sqlstmt := IF( @exist = 0, 'CREATE INDEX idx_user_id ON refresh_tokens(user_id)', 'SELECT ''Index idx_user_id already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(1) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_NAME = 'refresh_tokens' AND INDEX_NAME = 'idx_expires_at');
SET @sqlstmt := IF( @exist = 0, 'CREATE INDEX idx_expires_at ON refresh_tokens(expires_at)', 'SELECT ''Index idx_expires_at already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 可以添加一些初始数据（如果需要的话）
-- INSERT INTO users (username, email, password) VALUES ('admin', 'admin@example.com', 'hashed_password_here') ON DUPLICATE KEY UPDATE username=username;

-- 打印成功消息
SELECT 'Database initialization completed successfully.' AS result;