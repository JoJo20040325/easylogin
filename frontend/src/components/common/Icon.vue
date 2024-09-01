<template>
  <i :data-feather="name" :style="iconStyle" aria-hidden="true"></i>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import feather from 'feather-icons';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 24,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
});

const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  color: props.color,
}));

const renderIcon = () => {
  feather.replace({
    width: props.size,
    height: props.size,
  });
};

onMounted(renderIcon);

watch(() => [props.name, props.size], renderIcon);
</script>