/**
 * userService.js
 * 这个模块提供了用户相关的服务功能，包括获取用户信息、更新用户资料、更改密码和删除账户。
 */

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

/**
 * 获取用户个人资料
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户资料对象
 * @throws {AppError} 如果用户不存在
 */
exports.getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('用户不存在', 404);
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

/**
 * 更新用户个人资料
 * @param {string} userId - 用户ID
 * @param {Object} updateData - 要更新的用户数据
 * @returns {Promise<Object>} 更新后的用户资料
 * @throws {AppError} 如果更新失败
 */
exports.updateProfile = async (userId, updateData) => {
  const updated = await User.update(userId, updateData);
  if (!updated) {
    throw new AppError('更新用户信息失败', 400);
  }
  return this.getProfile(userId);
};

/**
 * 更改用户密码
 * @param {string} userId - 用户ID
 * @param {string} oldPassword - 旧密码
 * @param {string} newPassword - 新密码
 * @throws {AppError} 如果当前密码不正确或更改密码失败
 */
exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('用户不存在', 404);
  }
  
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError('当前密码不正确', 400);
  }

  const updated = await User.changePassword(userId, newPassword);
  if (!updated) {
    throw new AppError('更改密码失败', 400);
  }
};

/**
 * 删除用户账户
 * @param {string} userId - 要删除的用户ID
 * @throws {AppError} 如果删除账户失败
 */
exports.deleteAccount = async (userId) => {
  const deleted = await User.delete(userId);
  if (!deleted) {
    throw new AppError('删除账户失败', 400);
  }
};