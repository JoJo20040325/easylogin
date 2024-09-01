/**
 * appError.js
 * 这个模块定义了一个自定义的错误类，用于在应用程序中统一处理错误。
 */

class AppError extends Error {
  /**
   * 创建一个新的 AppError 实例
   * @param {string} message - 错误消息
   * @param {number} statusCode - HTTP 状态码
   * @param {Object|null} [errors=null] - 附加的错误详情
   */
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;