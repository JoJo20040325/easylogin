/**
 * authController.js
 * 这个模块包含了处理用户认证相关请求的控制器函数。
 */

const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const TokenUtils = require('../utils/tokenUtils');

/**
 * 获取令牌有效期设置
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.getTokenTimes = (req, res) => {
  const times = TokenUtils.getTokenExpiryTimes();
  res.json(times);
};

/**
 * 用户注册
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.register = asyncHandler(async (req, res) => {
  const userId = await authService.register(req.body);
  res.status(201).json({ message: "注册成功", userId });
});

/**
 * 用户登录
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.login = asyncHandler(async (req, res) => {
  const tokens = await authService.login(req.body);
  res.json(tokens);
});

/**
 * 刷新令牌
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.refresh = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.refresh(req.body.refreshToken);
  res.json({ accessToken, refreshToken });
});

/**
 * 用户登出
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.json({ message: "登出成功" });
});

/**
 * 请求忘记密码
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json({ message: "重置密码的邮件已发送" });
});

/**
 * 重置密码
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.newPassword);
  res.status(200).json({ message: "密码已成功重置" });
});

/**
 * 获取令牌有效期设置
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.getTokenTimes = asyncHandler(async (req, res) => {
  const times = await authService.getTokenTimes();
  res.json(times);
});

/**
 * 更新令牌有效期设置
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
exports.updateTokenTimes = asyncHandler(async (req, res) => {
  const { accessTokenTime, refreshTokenTime } = req.body;
  const tokens = await authService.updateTokenTimes(req.user.userId, accessTokenTime, refreshTokenTime);
  res.json({
    message: "令牌过期时间已更新",
    ...tokens
  });
});