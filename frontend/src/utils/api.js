/**
 * utils/api.js
 * 这个文件配置了 Axios 实例，用于处理 API 请求和响应拦截。
 */

import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import router from '@/router';
import { handleApiError } from '@/utils/errorHandler';

// 创建 Axios 实例
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    
    // 处理 401 错误，尝试刷新令牌
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
      originalRequest._retry = true;
      try {
        await authStore.refreshAccessToken();
        return api(originalRequest);
      } catch (refreshError) {
        authStore.logout();
        if (router.currentRoute.value.name !== 'Login') {
          router.push({ name: 'Login' });
        }
        return Promise.reject(refreshError);
      }
    }
    return handleApiError(error);
  }
);

export default api;