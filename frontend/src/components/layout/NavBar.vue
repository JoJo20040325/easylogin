<template>
  <nav class="fixed z-10 w-full bg-white bg-opacity-90 backdrop-blur-lg backdrop-filter transition-all duration-300"
    :class="{ 'shadow-md': scrolled }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex flex-shrink-0 items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <img class="h-8 w-auto" src="@/assets/logo.svg" alt="EasyLogin logo" />
            <span class="text-xl font-bold tracking-tight text-gray-800">EasyLogin</span>
          </router-link>
        </div>
        <div class="hidden space-x-4 sm:flex">
          <router-link v-for="item in navItems" :key="item.name" :to="item.href"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:text-indigo-600"
            :class="{ 'bg-indigo-50 text-indigo-600': item.current }" :aria-current="item.current ? 'page' : undefined">
            {{ item.name }}
          </router-link>
          <button v-if="authStore.isAuthenticated" @click="logout"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:text-indigo-600">
            登出
          </button>
        </div>
        <div class="sm:hidden">
          <button @click="toggleMobileMenu"
            class="text-gray-500 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none" aria-expanded="false"
            :aria-label="mobileMenuOpen ? '关闭菜单' : '打开菜单'">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile menu -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-show="mobileMenuOpen" class="sm:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <router-link v-for="item in navItems" :key="item.name" :to="item.href"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 transition duration-150 ease-in-out hover:text-indigo-600"
            :class="{ 'bg-indigo-50 text-indigo-600': item.current }" :aria-current="item.current ? 'page' : undefined">
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const navItems = computed(() => [
  { name: '首页', href: '/', current: route.path === '/' },
  { name: '仪表板', href: '/dashboard', current: route.path === '/dashboard' },
  { name: '用户', href: '/profile', current: route.path === '/profile' },
  // 可以根据需要添加更多导航项
]);

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const logout = async () => {
  await authStore.logout();
  router.push('/');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>