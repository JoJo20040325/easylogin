/**
 * userController.js
 * 这个模块包含了处理用户相关请求的控制器函数。
 */

const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * 获取用户个人资料
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.userId);
  res.json(user);
});

/**
 * 更新用户个人资料
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user.userId, req.body);
  res.json({ message: "用户信息更新成功", user: updatedUser });
});

/**
 * 更改用户密码
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.userId, req.body.oldPassword, req.body.newPassword);
  res.json({ message: "密码更改成功" });
});

/**
 * 删除用户账户
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.deleteAccount = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user.userId);
  res.json({ message: "账户已成功删除" });
});