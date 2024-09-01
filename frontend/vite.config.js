/**
 * vite.config.js
 * Vite 配置文件，用于设置项目的构建和开发服务器选项。
 */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    // 使用 Vue 插件来处理 .vue 文件
    vue()
  ],
  resolve: {
    alias: {
      // 设置 '@' 别名指向 'src' 目录，方便导入
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 配置开发服务器代理，将 '/api' 开头的请求转发到后端服务
      '/api': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true, // 修改请求头中的 Host 为目标 URL
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，移除 '/api' 前缀
      },
    },
  },
});