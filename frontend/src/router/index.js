/**
 * router/index.js
 * 这个文件定义了应用的路由配置和导航守卫。
 */

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { defineAsyncComponent } from 'vue'

const Dashboard = defineAsyncComponent(() => import('@/views/Dashboard.vue'))
Dashboard.__vite_preload = true  // 预加载 Dashboard 组件

const UserProfile = defineAsyncComponent(() => import('@/components/user/UserProfile.vue'))
UserProfile.__vite_preload = true  // 预加载 UserProfile 组件

// 定义路由
const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: () => import('@/views/Home.vue')
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('@/views/Login.vue')
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/login-success',
    name: 'LoginSuccess',
    component: () => import('@/components/feedback/LoginSuccess.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('@/components/user/UserProfile.vue'),
    meta: { requiresAuth: true },
  },
  { 
    path: '/unauthorized', 
    name: 'Unauthorized', 
    component: () => import('@/components/feedback/Unauthorized.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/components/auth/ForgotPassword.vue'),
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('@/components/auth/ResetPassword.vue'),
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    const isAuthenticated = await authStore.initializeAuth();
    if (!isAuthenticated) {
      return next({
        name: 'Unauthorized',
        query: {
          returnTo: to.fullPath,
          reason: to.name === 'Dashboard' ? 'dashboard' : 'profile',
        },
      });
    }
  }
  next();
});

export default router;