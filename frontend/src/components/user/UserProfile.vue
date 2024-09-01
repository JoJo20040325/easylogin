<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <div class="md:flex">
          <div class="md:flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
            <div class="text-center">
              <div class="relative inline-block">
                <img class="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-white shadow-inner transition-all duration-300 hover:scale-105"
                  :src="`https://ui-avatars.com/api/?name=${user.username}&background=random`" :alt="user.username" />
                <div class="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 class="text-2xl font-semibold">{{ user.username }}</h2>
              <p class="mt-2 text-indigo-200">用户详情</p>
            </div>
            <div class="mt-8">
              <button @click="logout"
                class="w-full bg-white text-indigo-600 rounded-lg py-2 px-4 hover:bg-indigo-100 transition duration-300 flex items-center justify-center group">
                <svg class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                  </path>
                </svg>
                登出
              </button>
            </div>
          </div>
          <div class="p-8 md:p-12 w-full">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">个人信息</h3>
            <div class="space-y-6">
              <div class="transition-all duration-300 hover:bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                <div v-if="!editMode.username" class="flex items-center">
                  <span class="text-lg text-gray-900">{{ user.username }}</span>
                  <button @click="toggleEditMode('username')" class="ml-4 text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                      </path>
                    </svg>
                  </button>
                </div>
                <div v-else class="flex items-center">
                  <input v-model="editedUser.username"
                    class="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  <button @click="updateField('username')" :disabled="isLoading || !isFieldChanged('username')"
                    class="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ isLoading ? '保存中...' : '保存' }}
                  </button>
                  <button @click="cancelEdit('username')"
                    class="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
                    取消
                  </button>
                </div>
              </div>
              <div class="transition-all duration-300 hover:bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <div v-if="!editMode.email" class="flex items-center">
                  <span class="text-lg text-gray-900">{{ user.email }}</span>
                  <button @click="toggleEditMode('email')" class="ml-4 text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                      </path>
                    </svg>
                  </button>
                </div>
                <div v-else class="flex items-center">
                  <input v-model="editedUser.email"
                    class="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                  <button @click="updateField('email')" :disabled="isLoading || !isFieldChanged('email')"
                    class="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ isLoading ? '保存中...' : '保存' }}
                  </button>
                  <button @click="cancelEdit('email')"
                    class="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
                    取消
                  </button>
                </div>
              </div>
              <div class="transition-all duration-300 hover:bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
                <button @click="showChangePasswordModal = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                  更改密码
                </button>
              </div>
            </div>
            <div class="mt-8 pt-6 border-t border-gray-200">
              <button @click="showDeleteAccountModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                删除账户
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ChangePasswordModal v-if="showChangePasswordModal" @close="showChangePasswordModal = false"
      @change-password="changePassword" />

    <ConfirmModal v-if="showDeleteAccountModal" @confirm="deleteAccount" @cancel="showDeleteAccountModal = false"
      title="确认删除账户" message="您确定要删除您的账户吗？此操作不可逆。" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import api from '@/utils/api';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const user = ref({});
const editedUser = reactive({});
const editMode = reactive({
  username: false,
  email: false,
});
const isLoading = ref(false);

const showChangePasswordModal = ref(false);
const showDeleteAccountModal = ref(false);

onMounted(async () => {
  try {
    const response = await api.get('/user/profile');
    user.value = response.data;
    editedUser.username = user.value.username;
    editedUser.email = user.value.email;
  } catch (error) {
    toast.error('获取用户信息失败');
  }
});

const isFieldChanged = (field) => editedUser[field] !== user.value[field];

const toggleEditMode = (field) => {
  editMode[field] = !editMode[field];
  if (!editMode[field]) {
    editedUser[field] = user.value[field];
  }
};

const cancelEdit = (field) => {
  editMode[field] = false;
  editedUser[field] = user.value[field];
};

const updateField = async (field) => {
  if (!isFieldChanged(field)) return;

  isLoading.value = true;
  try {
    const updateData = { [field]: editedUser[field] };
    await authStore.updateProfile(updateData);
    user.value[field] = editedUser[field];
    editMode[field] = false;
    toast.success(`${field === 'username' ? '用户名' : '邮箱'}更新成功`);
  } catch (error) {
    toast.error(`更新${field === 'username' ? '用户名' : '邮箱'}失败: ${error.message}`);
    editedUser[field] = user.value[field];
  } finally {
    isLoading.value = false;
  }
};

const changePassword = async (oldPassword, newPassword) => {
  try {
    await authStore.changePassword(oldPassword, newPassword);
    showChangePasswordModal.value = false;
    toast.success('密码修改成功，请使用新密码重新登录');
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    toast.error(`密码修改失败: ${error.message}`);
  }
};

const deleteAccount = async () => {
  try {
    await api.delete('/user/account');
    await authStore.logout();
    toast.success('账户已成功删除');
    router.push('/login');
  } catch (error) {
    toast.error(`删除账户失败: ${error.message}`);
  }
};

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
    toast.success('已成功登出');
  } catch (error) {
    toast.error(`登出失败: ${error.message}`);
  }
};
</script>