<template>
  <div class="max-w-md w-full space-y-8">
    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="username" class="sr-only">用户名</label>
          <input id="username" v-model="username" name="username" type="text" required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="用户名" />
        </div>
        <div>
          <label for="password" class="sr-only">密码</label>
          <input id="password" v-model="password" name="password" type="password" required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="密码" />
        </div>
      </div>
      <div>
        <button type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd" />
            </svg>
          </span>
          登录
        </button>
      </div>
    </form>

    <div class="flex items-center justify-between mt-4">
      <div class="text-sm">
        <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          还没有账户？点击注册
        </router-link>
      </div>
      <div class="text-sm">
        <router-link to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
          忘记密码？
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const username = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const handleSubmit = async () => {
  await authStore.login(username.value, password.value);
  toast.success('登录成功！');
  router.push({ name: 'LoginSuccess' });
};
</script>