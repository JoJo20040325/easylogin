<template>
  <div class="max-w-md w-full space-y-8">
    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="username" class="sr-only">用户名</label>
          <input id="username" v-model="username" name="username" type="text" required
            @input="debouncedValidateForm"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-300': errors.username, 'border-green-300': username && !errors.username }"
            placeholder="用户名" />
          <transition name="fade">
            <p v-if="errors.username" class="mt-2 text-sm text-red-600">{{ errors.username }}</p>
          </transition>
        </div>
        <div>
          <label for="email" class="sr-only">电子邮箱</label>
          <input id="email" v-model="email" name="email" type="email" required
            @input="debouncedValidateForm"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-300': errors.email, 'border-green-300': email && !errors.email }"
            placeholder="电子邮箱" />
          <transition name="fade">
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </transition>
        </div>
        <div>
          <label for="password" class="sr-only">密码</label>
          <input id="password" v-model="password" name="password" type="password" required
            @input="debouncedValidateForm"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-300': errors.password, 'border-green-300': password && !errors.password }"
            placeholder="密码" />
          <transition name="fade">
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
          </transition>
          <div v-if="password" class="mt-2">
            <div class="bg-gray-200 h-2 rounded-full">
              <div class="h-full rounded-full transition-all duration-300"
                :class="passwordStrengthClass"
                :style="{ width: `${passwordStrength * 25}%` }"></div>
            </div>
            <p class="text-xs mt-1" :class="passwordStrengthTextClass">{{ passwordStrengthText }}</p>
          </div>
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">确认密码</label>
          <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password" required
            @input="debouncedValidateForm"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            :class="{ 'border-red-300': errors.confirmPassword, 'border-green-300': confirmPassword && !errors.confirmPassword }"
            placeholder="确认密码" />
          <transition name="fade">
            <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </transition>
        </div>
      </div>

      <div>
        <button type="submit" :disabled="!isFormValid"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd" />
            </svg>
          </span>
          注册
        </button>
      </div>
    </form>

    <div class="mt-6 text-center">
    <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
      已有账户？点击登录
    </router-link>
  </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { validatePassword, validateInputs } from '@/utils/validationUtils';
import debounce from 'lodash/debounce';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errors = ref({});
const passwordStrength = ref(0);

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const validateForm = () => {
  errors.value = validateInputs({
    username: username.value,
    email: email.value,
    password: password.value
  });
  
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = '两次输入的密码不一致';
  } else {
    delete errors.value.confirmPassword;
  }

  const passwordValidation = validatePassword(password.value);
  passwordStrength.value = passwordValidation.score;
};

const debouncedValidateForm = debounce(validateForm, 300);

const isFormValid = computed(() => {
  return (
    username.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    Object.keys(errors.value).length === 0
  );
});

const passwordStrengthClass = computed(() => {
  const classes = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  return classes[passwordStrength.value] || classes[0];
});

const passwordStrengthText = computed(() => {
  const texts = ['非常弱', '弱', '一般', '强', '非常强'];
  return texts[passwordStrength.value] || texts[0];
});

const passwordStrengthTextClass = computed(() => {
  const classes = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-700'];
  return classes[passwordStrength.value] || classes[0];
});

const handleSubmit = async () => {
  validateForm();
  if (!isFormValid.value) {
    return;
  }
  
  try {
    await authStore.register(username.value, email.value, password.value);
    toast.success('注册成功！请登录');
    router.push({ name: 'Login', query: { registered: 'true' } });
  } catch (error) {
    console.error('注册失败:', error);
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>