# 前端 Dockerfile
# 使用多阶段构建来优化最终镜像大小

# 构建阶段
FROM node:20.16.0-alpine AS build-stage
WORKDIR /app
# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./
# 安装 pnpm
RUN npm install -g pnpm
# 复制 pnpm-lock.yaml
COPY pnpm-lock.yaml ./
# 使用 pnpm 安装依赖
RUN pnpm install --frozen-lockfile
# 复制项目文件
COPY . .
# 设置 API 基础 URL 环境变量
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# 构建应用
RUN pnpm run build

# 生产阶段
FROM nginx:stable-alpine AS production-stage
# 从构建阶段复制构建结果到 Nginx 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露 80 端口
EXPOSE 80
# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]