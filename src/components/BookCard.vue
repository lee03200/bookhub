<!-- src/components/BookCard.vue -->
<template>
  <div class="book-card bg-white rounded-lg shadow hover:shadow-md transition p-4">
    <!-- 封面图（从 books.js 数据中取 cover 字段） -->
    <div class="book-cover-container overflow-hidden rounded mb-3 bg-gray-200">
      <img 
        :src="book.cover" 
        :alt="book.title" 
        class="w-full h-full object-cover" 
        @error="onImageError"
      />
    </div>

    <!-- 标题 -->
    <h3 class="font-bold text-lg truncate">{{ book.title }}</h3>

    <!-- 作者 -->
    <p class="text-gray-600 text-sm mt-1">{{ book.author }}</p>

    <!-- 评分 + 评价人数 -->
    <div class="flex items-center mt-2">
      <span class="text-yellow-500">★</span>
      <span class="ml-1 text-sm">{{ book.rating }}</span>
      <span class="ml-2 text-gray-500 text-xs">{{ book.reviews }} 人评价</span>
    </div>

    <!-- （可选）热度、分类、在读人数 -->
    <div v-if="showExtra" class="mt-2 text-xs text-gray-500">
      <span>{{ book.genre }}</span> • 
      <span>{{ book.heat }}° 热度</span>
      <div v-if="book.reading">🔥 {{ book.reading }} 人在读</div>
    </div>

    <!-- 操作按颁（加入书架 / 已在书架） -->
    <button 
      @click="$emit('toggle-favorite', book)"
      class="mt-3 w-full py-2 text-sm rounded border font-medium transition"
      :class="isInShelf ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
    >
      {{ isInShelf ? '已在书架' : '加入书架' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  book: { type: Object, required: true },
  showExtra: { type: Boolean, default: false },
  isInShelf: { type: Boolean, default: false }
})
defineEmits(['toggle-favorite'])

const imageLoaded = ref(true)

const onImageError = () => {
  imageLoaded.value = false
}
</script>

<style scoped>
.book-card {
  min-width: 140px;
}

.book-cover-container {
  aspect-ratio: 3/4;
  width: 100%;
}
</style>
