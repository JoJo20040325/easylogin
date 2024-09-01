<template>
  <div
    class="bg-white bg-opacity-10 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:bg-opacity-20">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg">
          <Icon :name="icon" class="h-6 w-6 text-white" />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dt class="truncate text-sm font-medium text-gray-300">
            {{ title }}
          </dt>
          <dd v-if="!isEditable" class="mt-1 text-3xl font-semibold text-white">
            {{ value }}
          </dd>
          <div v-else class="mt-1 flex rounded-md shadow-sm">
            <input :value="value" @input="$emit('update:value', $event.target.value)" type="number" min="1"
              class="block w-full flex-1 rounded-l-md border-gray-300 bg-white bg-opacity-20 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            <select :value="selectedUnit" @change="$emit('update:selectedUnit', $event.target.value)"
              class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-white bg-opacity-20 text-black focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option v-for="unit in units" :key="unit" :value="unit">
                {{ unit }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from '@/components/common/Icon.vue';

defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  isEditable: Boolean,
  units: Array,
  selectedUnit: String,
});

defineEmits(['update:value', 'update:selectedUnit']);
</script>