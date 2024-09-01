/**
 * authMiddleware.js
 * 这个模块提供了用于验证用户令牌的中间件函数。
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');

// 将 jwt.verify 转换为 Promise 版本
const verifyAsync = promisify(jwt.verify);

/**
 * 验证访问令牌的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
exports.authenticateToken = async (req, res, next) => {
  try {
    // 从请求头中获取令牌
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('未提供访问令牌', 401);
    }
    // 验证令牌
    const decoded = await verifyAsync(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('无效的访问令牌', 403));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('访问令牌已过期', 401));
    } else {
      next(error);
    }
  }
};