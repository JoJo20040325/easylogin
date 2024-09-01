<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          忘记密码
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="sr-only">电子邮箱</label>
          <input id="email" name="email" type="email" required v-model="email"
            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="电子邮箱地址" />
        </div>
        <div>
          <button type="submit" :disabled="isSubmitting"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {{ isSubmitting ? '发送中...' : '发送重置密码邮件' }}
          </button>
        </div>
      </form>
      <div class="text-center text-sm">
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          返回登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useToast } from 'vue-toastification';

const email = ref('');
const isSubmitting = ref(false);
const authStore = useAuthStore();
const toast = useToast();

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    await authStore.forgotPassword(email.value);
    toast.success('重置密码邮件已发送，请查看您的邮箱');
    email.value = '';
  } catch (error) {
    console.error('忘记密码请求失败:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>