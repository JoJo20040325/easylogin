<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4" id="modal-title">
            更改密码
          </h3>
          <div class="space-y-4">
            <div>
              <label for="oldPassword" class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
              <input v-model="oldPassword" id="oldPassword" type="password" placeholder="请输入当前密码"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-300"
                :class="{'border-red-300': errors.oldPassword}" />
              <p v-if="errors.oldPassword" class="mt-1 text-sm text-red-600">{{ errors.oldPassword }}</p>
            </div>
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <input v-model="newPassword" id="newPassword" type="password" placeholder="请输入新密码"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-300"
                :class="{'border-red-300': errors.newPassword}" />
              <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">{{ errors.newPassword }}</p>
              <div v-if="newPassword" class="mt-2">
                <div class="bg-gray-200 h-2 rounded-full">
                  <div class="h-full rounded-full transition-all duration-300"
                    :class="passwordStrengthClass"
                    :style="{ width: `${passwordStrength.score * 25}%` }"></div>
                </div>
                <p class="text-xs mt-1" :class="passwordStrengthTextClass">{{ passwordStrengthText }}</p>
              </div>
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
              <input v-model="confirmPassword" id="confirmPassword" type="password" placeholder="请再次输入新密码"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-300"
                :class="{'border-red-300': errors.confirmPassword}" />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button @click="changePassword" type="button"
            :disabled="!isFormValid"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            确认修改
          </button>
          <button @click="$emit('close')" type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-300">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { validatePassword } from '@/utils/validationUtils';

const toast = useToast();
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errors = ref({});

const emit = defineEmits(['close', 'change-password']);

const passwordStrength = computed(() => validatePassword(newPassword.value));

const passwordStrengthClass = computed(() => {
  const classes = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  return classes[passwordStrength.value.score] || classes[0];
});

const passwordStrengthText = computed(() => {
  const texts = ['非常弱', '弱', '一般', '强', '非常强'];
  return texts[passwordStrength.value.score] || texts[0];
});

const passwordStrengthTextClass = computed(() => {
  const classes = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-700'];
  return classes[passwordStrength.value.score] || classes[0];
});

const isFormValid = computed(() => 
  oldPassword.value && newPassword.value && confirmPassword.value && 
  newPassword.value === confirmPassword.value &&
  passwordStrength.value.score >= 2 &&
  Object.keys(errors.value).length === 0
);

const validateForm = () => {
  errors.value = {};
  if (!oldPassword.value) errors.value.oldPassword = '请输入当前密码';
  if (!newPassword.value) errors.value.newPassword = '请输入新密码';
  else if (passwordStrength.value.score < 2) errors.value.newPassword = '密码强度不足';
  if (!confirmPassword.value) errors.value.confirmPassword = '请确认新密码';
  else if (newPassword.value !== confirmPassword.value) errors.value.confirmPassword = '两次输入的密码不一致';
};

const changePassword = () => {
  validateForm();
  if (isFormValid.value) {
    emit('change-password', oldPassword.value, newPassword.value);
  } else {
    toast.error('请正确填写所有字段');
  }
};
</script>