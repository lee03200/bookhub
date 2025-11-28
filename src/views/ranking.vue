<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">书籍排行榜</h1>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">分类筛选</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category"
          :class="[
            'px-4 py-2 rounded-full text-sm',
            selectedCategory === category
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="divide-y divide-gray-200">
        <div 
          v-for="(book, index) in filteredBooks" 
          :key="book.id"
          class="flex items-center p-4 hover:bg-gray-50 transition"
        >
          <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mr-4">
            {{ index + 1 }}
          </div>
          
          <div class="w-20 h-28 flex-shrink-0 mr-4">
            <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover rounded">
          </div>
          
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-1">{{ book.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">作者: {{ book.author }}</p>
            <div class="flex items-center gap-4">
              <div class="flex items-center">
                <StarRating :modelValue="book.rating" readonly />
                <span class="ml-1 text-sm text-gray-600">{{ book.rating }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ book.reviews }} 评价</span>
              <span class="text-sm text-gray-500">{{ book.genre }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-6">
            <div class="text-center">
              <div class="text-indigo-600 font-bold">{{ book.heat }}°</div>
              <div class="text-xs text-gray-500">热度</div>
            </div>
            <div class="text-center">
              <div class="text-green-600 font-bold">{{ book.reading }}</div>
              <div class="text-xs text-gray-500">在读</div>
            </div>
          </div>
          
          <div class="ml-4 flex gap-2">
            <button 
              class="p-2 text-gray-600 hover:text-indigo-600"
              @click="openBookDetail(book)"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button 
              class="p-2 text-gray-600 hover:text-indigo-600"
              @click="addToShelf(book.id)"
            >
              <i class="fas fa-bookmark"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'

const router = useRouter()
const bookStore = useBookStore()

// 完善添加书架功能
function addToShelf(book) {
  bookStore.toggleFavorite(book) // 调用store方法
  alert(`《${book.title}》已添加到书架`)
}
</script>
