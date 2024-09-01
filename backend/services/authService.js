/**
 * authService.js
 * 这个模块提供了用户认证相关的服务功能。
 * 包括用户注册、登录、刷新令牌、登出、忘记密码和重置密码等功能。
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const TokenUtils = require('../utils/tokenUtils');
const AppError = require('../utils/appError');
const emailService = require('./emailService');

/**
 * 用户注册
 * @param {Object} userData - 用户注册数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @returns {Promise<Object>} 创建的用户对象
 * @throws {AppError} 如果用户名或邮箱已存在
 */
exports.register = async ({ username, email, password }) => {
  const existingUser = await User.findExisting(username, email);
  if (existingUser) {
    throw new AppError(existingUser.message, 400, { details: existingUser.details });
  }
  return User.create(username, email, password);
};

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 包含访问令牌和刷新令牌的对象
 * @throws {AppError} 如果用户名或密码错误
 */
exports.login = async ({ username, password }) => {
  const user = await User.findByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('用户名或密码错误', 401);
  }
  return TokenUtils.generateTokenPair(user.id);
};

/**
 * 刷新访问令牌
 * @param {string} refreshToken - 刷新令牌
 * @returns {Promise<Object>} 包含新的访问令牌和刷新令牌的对象
 */
exports.refresh = async (refreshToken) => {
  return TokenUtils.refreshTokens(refreshToken);
};

/**
 * 用户登出
 * @param {string} refreshToken - 要失效的刷新令牌
 */
exports.logout = async (refreshToken) => {
  await RefreshToken.deleteByToken(refreshToken);
};

/**
 * 发起忘记密码流程
 * @param {string} email - 用户邮箱
 * @throws {AppError} 如果邮箱不存在
 */
exports.forgotPassword = async (email) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new AppError('没有找到使用该邮箱的用户', 404);
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  await User.updateResetToken(user.id, resetToken, resetTokenExpiry);

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await emailService.sendPasswordResetEmail(user.email, resetUrl);
};

/**
 * 重置密码
 * @param {string} token - 重置令牌
 * @param {string} newPassword - 新密码
 * @throws {AppError} 如果令牌无效或已过期
 */
exports.resetPassword = async (token, newPassword) => {
  const user = await User.findByResetToken(token);
  if (!user) {
    throw new AppError('重置令牌无效或已过期', 400);
  }

  await User.changePassword(user.id, newPassword);
  await User.clearResetToken(user.id);
};

/**
 * 获取令牌有效期设置
 * @returns {Object} 包含访问令牌和刷新令牌有效期的对象
 */
exports.getTokenTimes = () => {
  return TokenUtils.getTokenExpiryTimes();
};

/**
 * 更新令牌有效期设置并生成新的令牌对
 * @param {string} userId - 用户ID
 * @param {number} accessTokenTime - 新的访问令牌有效期（秒）
 * @param {number} refreshTokenTime - 新的刷新令牌有效期（秒）
 * @returns {Promise<Object>} 包含新的访问令牌和刷新令牌的对象
 */
exports.updateTokenTimes = async (userId, accessTokenTime, refreshTokenTime) => {
  TokenUtils.setTokenExpiryTimes(accessTokenTime, refreshTokenTime);
  return TokenUtils.generateTokenPair(userId);
};