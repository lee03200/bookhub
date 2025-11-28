<template>
  <div class="container mx-auto p-4">
    <button @click="$router.back()" class="btn btn-primary mb-4">返回</button>
    <div v-if="book" class="flex flex-col md:flex-row gap-6">
      <img :src="book.cover" alt="book.title" class="w-64 h-auto mx-auto md:mx-0">
      <div>
        <h1 class="text-3xl font-bold">{{ book.title }}</h1>
        <p class="text-gray-600">作者: {{ book.author }}</p>
        <p class="mt-4">评分: {{ book.rating }}</p>
        <button 
          class="btn btn-primary mt-4"
          @click="addToShelf(book)"
        >
          添加到书架
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/books'

const route = useRoute()
const bookStore = useBookStore()
const book = ref(null)

onMounted(() => {
  // 实际项目中应调用API获取详情
  const mockBooks = [/* 书籍数据 */]
  book.value = mockBooks.find(b => b.id === Number(route.params.id))
})

function addToShelf(book) {
  bookStore.toggleFavorite(book)
}
</script>
