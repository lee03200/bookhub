<template>
  <div class="star-rating">
    <i 
      v-for="i in 5" 
      :key="i" 
      class="star fas fa-star"
      :class="{ 'filled': i <= currentRating }"
      @click="handleClick(i)"
    ></i>
  </div>
</template>

<script>
export default {
  name: 'StarRating',
  props: ['rating', 'readonly', 'modelValue'],
  emits: ['update:modelValue'],
  computed: {
    currentRating() {
      return this.modelValue !== undefined ? this.modelValue : this.rating;
    }
  },
  methods: {
    handleClick(i) {
      if (!this.readonly) {
        this.$emit('update:modelValue', i);
      }
    }
  }
}
</script>

<style scoped>
.star-rating {
  display: flex;
  gap: 4px;
}
.star {
  cursor: pointer;
  transition: color 0.2s;
}
.star.filled {
  color: #fbbf24;
}
</style>
