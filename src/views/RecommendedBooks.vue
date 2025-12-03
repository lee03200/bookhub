<template>
  <div class="recommended-books-page">
    <!-- 未登录提示 -->
    <div v-if="!isLoggedIn" class="container mx-auto px-4 py-16 text-center">
      <div class="bg-white rounded-lg shadow-md p-12">
        <i class="fas fa-lock text-6xl text-gray-400 mb-6"></i>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">请先登录</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          登录后可查看所有推荐书籍，添加书籍到书架，发表评论和评分
        </p>
        <button 
          @click="openLogin"
          class="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          立即登录
        </button>
      </div>
    </div>

    <!-- 已登录用户内容 -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <section class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800">为你推荐</h2>
        <p class="text-gray-600 mt-2">基于你的阅读兴趣，为你精选最适合的书籍</p>
      </section>

      <!-- 筛选和排序 -->
      <section class="mb-6 flex justify-between items-center">
        <div class="flex gap-3">
          <button
            v-for="filter in filters"
            :key="filter"
            @click="selectedFilter = filter"
            :class="[
              'px-4 py-2 rounded-full transition',
              selectedFilter === filter
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            {{ filter }}
          </button>
        </div>
        
        <select 
          v-model="sortBy" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="default">默认排序</option>
          <option value="rating">评分最高</option>
          <option value="reviews">评价最多</option>
        </select>
      </section>

      <!-- 统计信息 -->
      <div class="mb-6 bg-indigo-50 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fas fa-book text-indigo-600 text-xl"></i>
          <span class="text-gray-700">共找到 <span class="font-bold text-indigo-600">{{ filteredBooks.length }}</span> 本推荐书籍</span>
        </div>
        <div class="text-sm text-gray-600">
          已收藏: {{ myShelfIds.length }} 本
        </div>
      </div>

      <!-- 书籍网格 -->
      <div v-if="filteredBooks.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">暂无符合条件的书籍</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <BookCard
          v-for="book in filteredBooks"
          :key="book.id"
          :book="book"
          :is-in-shelf="myShelfIds.includes(book.id)"
          @toggle-favorite="toggleFavorite"
        />
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        
        <button
          v-for="page in displayPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-4 py-2 rounded-lg',
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/books'
import BookCard from '@/components/BookCard.vue'
import { recommendedBooksData } from '@/data/books'

const userStore = useUserStore()
const bookStore = useBookStore()

// 登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const myShelfIds = computed(() => bookStore.myShelfBooks.map(b => b.id))

// 筛选和排序
const filters = ['全部', '小说', '科技', '历史', '文学', '心理学']
const selectedFilter = ref('全部')
const sortBy = ref('default')
const currentPage = ref(1)
const booksPerPage = 20

// 所有推荐书籍
const allBooks = computed(() => recommendedBooksData)

// 筛选书籍
const filteredBooks = computed(() => {
  let books = allBooks.value

  // 按分类筛选
  if (selectedFilter.value !== '全部') {
    books = books.filter(book => book.genre?.includes(selectedFilter.value))
  }

  // 排序
  if (sortBy.value === 'rating') {
    books = [...books].sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'reviews') {
    books = [...books].sort((a, b) => b.reviews - a.reviews)
  }

  // 分页
  const start = (currentPage.value - 1) * booksPerPage
  const end = start + booksPerPage
  return books.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  let books = allBooks.value
  if (selectedFilter.value !== '全部') {
    books = books.filter(book => book.genre?.includes(selectedFilter.value))
  }
  return Math.ceil(books.length / booksPerPage)
})

// 显示的页码
const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 切换收藏
const toggleFavorite = (book) => {
  bookStore.toggleFavorite(book)
}

// 打开登录框
const openLogin = () => {
  window.dispatchEvent(new CustomEvent('openLoginModal'))
}
</script>

<style scoped>
.recommended-books-page {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}
</style>
