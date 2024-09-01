/**
 * validationMiddleware.js
 * 这个模块提供了用于验证用户输入的中间件函数。
 */

const { validateInputs, validateUserUpdate, validatePassword } = require('../utils/validationUtils');
const AppError = require('../utils/appError');

/**
 * 验证用户注册输入的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
exports.validateRegistration = (req, res, next) => {
  const errors = validateInputs(req.body);
  if (errors.length > 0) {
    return next(new AppError('验证错误', 400, errors));
  }
  next();
};

/**
 * 验证用户登录输入的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
exports.validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError('用户名和密码都是必填项', 400));
  }
  next();
};

/**
 * 验证用户信息更新输入的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
exports.validateUserUpdate = (req, res, next) => {
  const errors = validateUserUpdate(req.body);
  if (errors.length > 0) {
    return next(new AppError('验证错误', 400, errors));
  }
  next();
};

/**
 * 验证密码更改输入的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
exports.validatePasswordChange = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new AppError('旧密码和新密码都是必填项', 400));
  }
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return next(new AppError('新密码不符合要求', 400, { details: passwordValidation.feedback }));
  }
  next();
};

/**
 * 验证令牌时间更新输入的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
exports.validateTokenUpdate = (req, res, next) => {
  const { accessTokenTime, refreshTokenTime } = req.body;
  if (!accessTokenTime || !refreshTokenTime) {
    return next(new AppError('访问令牌时间和刷新令牌时间都是必填项', 400));
  }
  next();
};