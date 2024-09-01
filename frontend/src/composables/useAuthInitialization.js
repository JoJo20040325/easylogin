import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

export function useAuthInitialization() {
  const authStore = useAuthStore();
  const { isAuthenticated, isInitialized } = storeToRefs(authStore);
  const isLoading = ref(true);

  const initializeAuth = async () => {
    if (!isAuthenticated.value) {
      await authStore.initializeAuth();
    }
    isLoading.value = false;
  };

  onMounted(initializeAuth);

  watch(isInitialized, (newValue) => {
    if (newValue) {
      isLoading.value = false;
    }
  });

  return { isLoading };
}