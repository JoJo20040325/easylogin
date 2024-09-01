/**
 * authRoutes.js
 * 这个模块定义了所有与用户认证相关的路由。
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  validateRegistration,
  validateLogin,
  validateTokenUpdate,
} = require('../middleware/validationMiddleware');

// 用户注册路由
router.post('/register', validateRegistration, authController.register);

// 用户登录路由
router.post('/login', validateLogin, authController.login);

// 刷新令牌路由
router.post('/refresh', authController.refresh);

// 用户登出路由
router.post('/logout', authenticateToken, authController.logout);

// 获取令牌时间设置路由
router.get('/token-times', authController.getTokenTimes);

// 更新令牌时间设置路由
router.post('/update-token-times', authenticateToken, validateTokenUpdate, authController.updateTokenTimes);

// 忘记密码路由
router.post('/forgot-password', authController.forgotPassword);

// 重置密码路由
router.post('/reset-password', authController.resetPassword);

module.exports = router;