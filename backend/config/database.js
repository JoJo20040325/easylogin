/**
 * database.js
 * 这个模块创建并导出了一个 MySQL 连接池，用于在整个应用程序中进行数据库操作。
 */

const mysql = require('mysql2');
require('dotenv').config();

/**
 * 创建 MySQL 连接池
 * 使用环境变量来配置数据库连接
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 导出 promise 包装的连接池，以便使用 async/await 语法
module.exports = pool.promise();