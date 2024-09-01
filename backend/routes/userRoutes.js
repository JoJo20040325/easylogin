/**
 * userRoutes.js
 * 这个模块定义了所有与用户管理相关的路由。
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  validateUserUpdate,
  validatePasswordChange,
} = require('../middleware/validationMiddleware');

// 获取用户个人资料路由
router.get('/profile', authenticateToken, userController.getProfile);

// 更新用户个人资料路由
router.put('/profile', authenticateToken, validateUserUpdate, userController.updateProfile);

// 更改用户密码路由
router.post('/change-password', authenticateToken, validatePasswordChange, userController.changePassword);

// 删除用户账户路由
router.delete('/account', authenticateToken, userController.deleteAccount);

module.exports = router;