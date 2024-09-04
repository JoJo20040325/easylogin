<template>
  <div
    class="bg-white bg-opacity-10 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:bg-opacity-20">
    <div class="flex items-center justify-between px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-black">{{ title }}</h3>
      <button @click="$emit('clear')" class="text-sm text-red-400 hover:text-red-300 transition-colors duration-200">
        清除日志
      </button>
    </div>
    <div class="border-t border-gray-700">
      <ul class="divide-y divide-gray-700">
        <TransitionGroup name="list" tag="div">
          <li v-for="log in logs" :key="log.id"
            class="flex items-center space-x-4 px-4 py-4 transition-all duration-300 hover:bg-black hover:bg-opacity-5">
            <span class="flex-shrink-0">
              <Icon :name="log.success ? 'check-circle' : 'alert-circle'"
                :class="log.success ? 'text-green-400' : 'text-red-400'" size="20" />
            </span>
            <span class="flex-grow text-sm text-black">{{
              log.message
              }}</span>
            <span class="flex-shrink-0 text-sm text-black">{{
              formatTime(log.timestamp)
              }}</span>
          </li>
        </TransitionGroup>
      </ul>
    </div>
    <div v-if="logs.length === 0" class="px-4 py-5 text-center text-gray-400 sm:px-6">
      暂无日志
    </div>
  </div>
</template>

<script setup>
import Icon from '@/components/common/Icon.vue';

defineProps({
  title: String,
  logs: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['clear']);

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>