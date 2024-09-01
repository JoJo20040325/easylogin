/**
 * main.js
 * Vue 应用的入口文件，用于初始化 Vue 应用并配置全局插件。
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './router';
import 'vue-toastification/dist/index.css';
import './index.css';

// 创建 Vue 应用实例
const app = createApp(App);

app
  // 使用 Pinia 进行状态管理
  .use(createPinia())
  // 使用 Vue Router 进行路由管理
  .use(router)
  // 配置 Vue Toastification 用于显示通知
  .use(Toast, {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 20,  // 最大同时显示的通知数量
    newestOnTop: true,  // 新通知显示在顶部
    timeout: 3000,  // 通知显示时间（毫秒）
    pauseOnFocusLoss: false,  // 失去焦点时不暂停通知计时
    pauseOnHover: false,  // 鼠标悬停时不暂停通知计时
  })
  // 挂载应用到 DOM
  .mount('#app');