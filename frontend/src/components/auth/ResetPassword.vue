<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          重置密码
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="password" class="sr-only">新密码</label>
          <input id="password" name="password" type="password" required v-model="password"
            class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="新密码" />
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">确认新密码</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required v-model="confirmPassword"
            class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="确认新密码" />
        </div>
        <div>
          <button type="submit" :disabled="isSubmitting || !isPasswordValid"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
            {{ isSubmitting ? '重置中...' : '重置密码' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const password = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);

const isPasswordValid = computed(
  () => password.value.length >= 8 && password.value === confirmPassword.value
);

const handleSubmit = async () => {
  if (isSubmitting.value || !isPasswordValid.value) return;

  isSubmitting.value = true;
  try {
    await authStore.resetPassword(route.params.token, password.value);
    toast.success('密码重置成功，请使用新密码登录');
    router.push('/login');
  } catch (error) {
    console.error('重置密码失败:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>