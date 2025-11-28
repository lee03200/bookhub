<template>
  <div class="star-rating">
    <span 
      v-for="i in 5" 
      :key="i"
      class="star"
      :class="{ 'filled': i <= modelValue, 'readonly': readonly }"
      @click="!readonly && (onUpdateModelValue(i))"
    >
      <i class="fas fa-star"></i>
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
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
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 2px;
}

.star {
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.star.readonly {
  cursor: default;
}
</style>
