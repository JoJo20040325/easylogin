/**
 * errorMiddleware.js
 * 这个模块提供了全局错误处理中间件，用于统一处理应用程序中的错误。
 */

const AppError = require('../utils/appError');

/**
 * 全局错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
module.exports = (err, req, res, next) => {
  console.error(err);

  // 处理自定义的 AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }

  // 处理 JWT 相关错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'fail', message: '无效的令牌' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'fail', message: '令牌已过期' });
  }

  // 处理未知错误
  res.status(500).json({ status: 'error', message: '服务器内部错误' });
};