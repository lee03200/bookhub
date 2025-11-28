<template>
  <div class="flex items-center">
    <div 
      v-for="star in 5" 
      :key="star"
      class="text-gray-300 hover:text-yellow-400 cursor-pointer transition"
      :class="{ 'text-yellow-400': star <= rating }"
      @click="handleClick(star)"
    >
      <i class="fas fa-star"></i>
    </div>
  </div>
</template>

<script setup>
import { defineProps, emit } from 'vue';

const props = defineProps({
  rating: {
    type: Number,
    default: 0
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = emit();

const handleClick = (star) => {
  if (!props.readonly) {
    emit('update:rating', star);
  }
};
</script>
