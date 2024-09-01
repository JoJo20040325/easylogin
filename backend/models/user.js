/**
 * user.js
 * 这个模块提供了用户相关的数据库操作，包括创建、查找、更新和删除用户，以及密码重置相关的功能。
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

class User {
  /**
   * 创建新用户
   * @param {string} username - 用户名
   * @param {string} email - 邮箱
   * @param {string} password - 密码（明文）
   * @returns {Promise<number>} 创建的用户ID
   */
  static async create(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return result.insertId;
  }

  /**
   * 通过用户名查找用户
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} 用户对象，如果不存在则返回null
   */
  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  /**
   * 通过邮箱查找用户
   * @param {string} email - 邮箱
   * @returns {Promise<Object|null>} 用户对象，如果不存在则返回null
   */
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  /**
   * 通过ID查找用户
   * @param {number} id - 用户ID
   * @returns {Promise<Object|null>} 用户对象，如果不存在则返回null
   */
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * 检查用户名或邮箱是否已存在
   * @param {string} username - 用户名
   * @param {string} email - 邮箱
   * @returns {Promise<Object|null>} 如果存在冲突，返回冲突信息，否则返回null
   */
  static async findExisting(username, email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (rows.length > 0) {
      if (rows[0].username === username) {
        return { message: "该用户名已被注册", details: "USERNAME_EXISTS" };
      } else {
        return { message: "该邮箱已被注册", details: "EMAIL_EXISTS" };
      }
    }
    return null;
  }

  /**
   * 更新用户信息
   * @param {number} id - 用户ID
   * @param {Object} updateData - 要更新的数据
   * @returns {Promise<boolean>} 是否更新成功
   * @throws {AppError} 如果没有提供有效的更新字段
   */
  static async update(id, updateData) {
    const allowedFields = ['username', 'email'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      throw new AppError('没有提供有效的更新字段', 400);
    }

    values.push(id);
    const [result] = await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * 更改用户密码
   * @param {number} id - 用户ID
   * @param {string} newPassword - 新密码
   * @returns {Promise<boolean>} 是否更改成功
   */
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * 删除用户
   * @param {number} id - 要删除的用户ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * 更新用户的密码重置令牌
   * @param {number} userId - 用户ID
   * @param {string} resetToken - 重置令牌
   * @param {Date} resetTokenExpiry - 重置令牌过期时间
   * @returns {Promise<void>}
   */
  static async updateResetToken(userId, resetToken, resetTokenExpiry) {
    await db.execute(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, userId]
    );
  }

  /**
   * 通过重置令牌查找用户
   * @param {string} resetToken - 重置令牌
   * @returns {Promise<Object|null>} 用户对象，如果不存在则返回null
   */
  static async findByResetToken(resetToken) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?',
      [resetToken, new Date()]
    );
    return rows[0];
  }

  /**
   * 清除用户的重置令牌
   * @param {number} userId - 用户ID
   * @returns {Promise<void>}
   */
  static async clearResetToken(userId) {
    await db.execute(
      'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [userId]
    );
  }
}

module.exports = User;