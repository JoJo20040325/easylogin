/**
 * app.js
 * 这是应用程序的主入口文件，设置了 Express 服务器和所有中间件。
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

// 设置 Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 安全中间件
app.use(helmet());

// CORS 设置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// 日志中间件
app.use(morgan('dev'));

// 解析 JSON 请求体
app.use(express.json());

// 请求速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 1000, // 限制每个 IP 15 分钟内最多 1000 个请求
});
app.use(limiter);

// 路由
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ message: '资源未找到' });
});

// 错误处理中间件
app.use(errorMiddleware);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`服务器运行在端口 ${PORT}`));

module.exports = app;