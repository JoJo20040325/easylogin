<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 text-white">
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
    <div v-else class="container mx-auto px-4 py-8">
      <!-- 顶部导航栏 -->
      <nav class="flex justify-between items-center mb-12">
        <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          控制中心
        </h1>
        <div class="relative group">
          <img :src="`https://ui-avatars.com/api/?name=${authStore.userName}&background=random`" alt="用户头像"
            class="w-12 h-12 rounded-full border-2 border-emerald-400 cursor-pointer transition-all duration-300 group-hover:scale-110 shadow-lg"
            @click="toggleUserMenu" />
          <div v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition-all duration-300 ease-in-out transform origin-top-right">
            <div class="py-1">
              <a @click="pushProfile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200">个人资料</a>
              <a @click="logout"
                class="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer transition-colors duration-200">登出</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardCard v-for="card in dashboardCards" :key="card.title" v-bind="card"
          @update:value="updateTokenTime(card.title, $event)" @update:selectedUnit="updateTokenUnit(card.title, $event)"
          class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" />
      </div>

      <!-- 日志区域 -->
      <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LogSection title="令牌刷新日志" :logs="tokenRefreshLogs" @clear="clearTokenRefreshLogs"
          class="bg-white bg-opacity-10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-opacity-20 backdrop-blur-lg shadow-xl" />
        <LogSection title="API 调用日志" :logs="apiCallLogs" @clear="clearApiCallLogs"
          class="bg-white bg-opacity-10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-opacity-20 backdrop-blur-lg shadow-xl" />
      </div>

      <!-- 操作按钮 -->
      <div class="mt-12 flex justify-center space-x-6">
        <button @click="updateTokenTimes"
          class="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center transform hover:scale-105 shadow-lg">
          <Icon name="refresh-cw" size="24" class="mr-3" />
          更新令牌时间
        </button>
        <button @click="simulateApiCall"
          class="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center transform hover:scale-105 shadow-lg">
          <Icon name="zap" size="24" class="mr-3" />
          模拟 API 调用
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useTokenManagement } from '@/composables/useTokenManagement';
import { useApiSimulation } from '@/composables/useApiSimulation';
import { useAuthInitialization } from '@/composables/useAuthInitialization';
import api from '@/utils/api';
import DashboardCard from '@/components/dashboard/DashboardCard.vue';
import LogSection from '@/components/dashboard/LogSection.vue';
import Icon from '@/components/common/Icon.vue';

const { isLoading } = useAuthInitialization();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const showUserMenu = ref(false);

const {
  tokenRefreshLogs,
  apiCallLogs,
  dashboardCards,
  updateTokenTime,
  updateTokenUnit,
  updateTokenTimes,
  fetchTokenTimes,
  clearTokenRefreshLogs,
  clearApiCallLogs,
} = useTokenManagement(authStore, toast);

const { simulateApiCall } = useApiSimulation(api, apiCallLogs, toast);

// 用户操作函数
const logout = async () => {
  try {
    await authStore.logout();
    toast.success('已成功登出', { timeout: 2000 });
    router.push('/login');
  } catch (error) {
    toast.error('登出失败，请重试', { timeout: 2000 });
  }
};

const pushProfile = () => {
  router.push('/profile');
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 生命周期钩子
onMounted(async () => {
  await authStore.initializeAuth();
  if (authStore.isAuthenticated) {
    await fetchTokenTimes();
    authStore.startRefreshInterval();
  }
});

onUnmounted(() => {
  authStore.stopRefreshInterval();
});

// 监听 lastRefresh 的变化
watch(() => authStore.lastRefresh, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    tokenRefreshLogs.value.unshift({
      id: Date.now(),
      success: true,
      message: '访问令牌已刷新',
      timestamp: new Date(newValue),
    });
  }
});

// 组件卸载时取消监听
onUnmounted(() => {
  // 如果有需要取消的监听，可以在这里处理
});
</script>

<style scoped>
/* 可以添加一些自定义样式 */
.dashboard-card {
  @apply bg-gradient-to-br from-purple-500 to-indigo-600;
}

.log-section {
  @apply bg-gradient-to-br from-gray-800 to-gray-900;
}

/* 添加一些动画效果 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.pulse {
  animation: pulse 2s infinite;
}
</style>