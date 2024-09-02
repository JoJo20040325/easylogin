/**
 * tokenUtils.js
 * 这个模块提供了处理 JWT 令牌的工具函数，包括生成、刷新和验证令牌。
 */

const jwt = require('jsonwebtoken');
const ms = require('ms');
const RefreshToken = require('../models/refreshToken');
const AppError = require('./appError');

class TokenUtils {
  static accessTokenExpiryTime = '10s';
  static refreshTokenExpiryTime = '7d';

  /**
   * 获取当前的令牌过期时间设置
   * @returns {Object} 包含访问令牌和刷新令牌过期时间的对象
   */
  static getTokenExpiryTimes() {
    return {
      accessTokenExpiryTime: this.accessTokenExpiryTime,
      refreshTokenExpiryTime: this.refreshTokenExpiryTime,
    };
  }

  /**
   * 设置新的令牌过期时间
   * @param {string} newAccessTokenTime - 新的访问令牌过期时间
   * @param {string} newRefreshTokenTime - 新的刷新令牌过期时间
   * @throws {AppError} 如果时间格式无效
   */
  static setTokenExpiryTimes(newAccessTokenTime, newRefreshTokenTime) {
    this.validateTimeString(newAccessTokenTime);
    this.validateTimeString(newRefreshTokenTime);
    this.accessTokenExpiryTime = newAccessTokenTime;
    this.refreshTokenExpiryTime = newRefreshTokenTime;
  }

  /**
   * 验证时间字符串格式
   * @param {string} timeString - 要验证的时间字符串
   * @throws {AppError} 如果格式无效
   */
  static validateTimeString(timeString) {
    const regex = /^(\d+)(s|m|h|d)$/;
    if (!regex.test(timeString)) {
      throw new AppError('无效的时间格式。请使用数字加单位(s, m, h, d)的格式。', 400);
    }
  }

  /**
   * 生成访问令牌
   * @param {string} userId - 用户ID
   * @returns {string} 生成的访问令牌
   */
  static generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: this.accessTokenExpiryTime,
    });
  }

  /**
   * 生成刷新令牌
   * @param {string} userId - 用户ID
   * @returns {Promise<string>} 生成的刷新令牌
   */
  static async generateRefreshToken(userId) {
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: this.refreshTokenExpiryTime,
    });
    const expiresAt = new Date(Date.now() + ms(this.refreshTokenExpiryTime));
    await RefreshToken.create(userId, refreshToken, expiresAt);
    return refreshToken;
  }

  /**
   * 生成令牌对（访问令牌和刷新令牌）
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 包含访问令牌和刷新令牌的对象
   */
  static async generateTokenPair(userId) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  /**
   * 刷新令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise<Object>} 新的令牌对
   * @throws {AppError} 如果刷新令牌无效或过期
   */
  static async refreshTokens(refreshToken) {
    const storedToken = await RefreshToken.findByToken(refreshToken);
    if (!storedToken || new Date() > storedToken.expires_at) {
      throw new AppError('无效的刷新令牌', 403);
    }
    
    const accessToken = this.generateAccessToken(storedToken.user_id);
    
    return { accessToken, refreshToken };
  }
}

module.exports = TokenUtils;