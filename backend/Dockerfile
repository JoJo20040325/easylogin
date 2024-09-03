# 使用 Node.js 20.16.0 作为基础镜像
FROM node:20.16.0

# 设置工作目录
WORKDIR /usr/src/app

# 设置 npm 和 pnpm 使用淘宝镜像
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com

# 复制 package.json 和 pnpm-lock.yaml（如果存在）
COPY package.json pnpm-lock.yaml* ./

# 安装项目依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件到工作目录
COPY . .

# 暴露 3000 端口
EXPOSE 3000

# 启动应用
CMD ["node", "app.js"]