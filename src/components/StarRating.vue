<template>
  <div class="flex items-center">
    <div 
      v-for="star in 5" 
      :key="star"
      class="text-gray-300 hover:text-yellow-400 cursor-pointer transition"
      :class="{ 'text-yellow-400': star <= currentRating }"
      @click="handleClick(star)"
    >
      <i class="fas fa-star"></i>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Number,
    default: 0
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const currentRating = computed({
  get() {
    return props.modelValue !== undefined && props.modelValue !== 0 ? props.modelValue : props.rating
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const handleClick = (star) => {
  if (!props.readonly) {
    currentRating.value = star
  }
}
</script>
