/**
 * asyncHandler.js
 * 这个模块提供了一个包装函数，用于处理异步路由处理器中的错误。
 */

/**
 * 包装异步函数以自动捕获并传递错误到下一个中间件
 * @param {Function} fn - 异步路由处理器函数
 * @returns {Function} 包装后的路由处理器
 */
const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;