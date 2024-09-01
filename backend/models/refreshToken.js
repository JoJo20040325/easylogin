/**
 * refreshToken.js
 * 这个模块提供了刷新令牌相关的数据库操作，包括创建、查找、删除和验证刷新令牌。
 */

const db = require('../config/database');
const AppError = require('../utils/appError');

class RefreshToken {
  /**
   * 创建新的刷新令牌
   * @param {string} userId - 用户ID
   * @param {string} token - 刷新令牌
   * @param {Date} expiresAt - 过期时间
   * @returns {Promise<number>} 插入的刷新令牌ID
   * @throws {AppError} 如果创建失败
   */
  static async create(userId, token, expiresAt) {
    try {
      const [result] = await db.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
      );
      return result.insertId;
    } catch (error) {
      throw new AppError('创建刷新令牌失败', 500);
    }
  }

  /**
   * 通过令牌查找刷新令牌
   * @param {string} token - 刷新令牌
   * @returns {Promise<Object|null>} 刷新令牌对象，如果不存在则返回null
   * @throws {AppError} 如果查询失败
   */
  static async findByToken(token) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
        [token]
      );
      return rows[0] || null;
    } catch (error) {
      throw new AppError('查找刷新令牌失败', 500);
    }
  }

  /**
   * 删除指定的刷新令牌
   * @param {string} token - 要删除的刷新令牌
   * @returns {Promise<boolean>} 是否成功删除
   * @throws {AppError} 如果删除失败
   */
  static async deleteByToken(token) {
    try {
      const [result] = await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new AppError('删除刷新令牌失败', 500);
    }
  }

  /**
   * 删除指定用户的所有刷新令牌
   * @param {string} userId - 用户ID
   * @returns {Promise<boolean>} 是否成功删除
   * @throws {AppError} 如果删除失败
   */
  static async deleteByUserId(userId) {
    try {
      const [result] = await db.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new AppError('删除用户的所有刷新令牌失败', 500);
    }
  }

  /**
   * 删除所有过期的刷新令牌
   * @returns {Promise<number>} 删除的令牌数量
   * @throws {AppError} 如果删除失败
   */
  static async deleteExpiredTokens() {
    try {
      const [result] = await db.execute('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
      return result.affectedRows;
    } catch (error) {
      throw new AppError('删除过期令牌失败', 500);
    }
  }

  /**
   * 验证刷新令牌是否有效
   * @param {string} token - 要验证的刷新令牌
   * @returns {Promise<boolean>} 令牌是否有效
   */
  static async isValid(token) {
    const refreshToken = await this.findByToken(token);
    return !!refreshToken;
  }
}

module.exports = RefreshToken;