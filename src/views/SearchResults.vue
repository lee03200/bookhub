<!-- src/views/SearchResults.vue -->
<template>
  <div class="search-results max-w-7xl mx-auto px-4 py-6">
    <!-- 搜索标题 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        搜索结果
      </h1>
      <p class="text-gray-600">
        关键词: <span class="font-semibold text-indigo-600">"{{ searchQuery }}"</span>
        <span v-if="!loading" class="ml-4">找到 {{ filteredBooks.length }} 本书籍</span>
      </p>
    </div>

    <!-- 重新搜索 -->
    <div class="mb-6 flex items-center gap-3">
      <input
        v-model="newSearchKeyword"
        @keyup.enter="handleNewSearch"
        type="text"
        placeholder="继续搜索书籍、作者或ISBN..."
        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button 
        @click="handleNewSearch"
        class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
      >
        <i class="fas fa-search mr-2"></i>搜索
      </button>
    </div>

    <!-- 筛选和排序 -->
    <div class="mb-6 flex justify-between items-center">
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
        <option value="heat">热度最高</option>
      </select>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
      <p class="text-gray-600">正在搜索...</p>
    </div>

    <!-- 空结果 -->
    <div v-else-if="filteredBooks.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 mb-4">未找到相关书籍</p>
      <p class="text-gray-400 text-sm">试试使用其他关键词搜索</p>
    </div>

    <!-- 搜索结果 -->
    <div v-else>
      <!-- 统计信息 -->
      <div class="mb-6 bg-indigo-50 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fas fa-book text-indigo-600 text-xl"></i>
          <span class="text-gray-700">共找到 <span class="font-bold text-indigo-600">{{ filteredBooks.length }}</span> 本书籍</span>
        </div>
        <div class="text-sm text-gray-600">
          已收藏: {{ myShelfIds.length }} 本
        </div>
      </div>

      <!-- 书籍网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <BookCard
          v-for="book in sortedBooks"
          :key="book.id"
          :book="book"
          :is-in-shelf="myShelfIds.includes(book.id)"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useUserStore } from '@/stores/user'
import BookCard from '@/components/BookCard.vue'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const userStore = useUserStore()

// 搜索关键词
const searchQuery = ref('')
const newSearchKeyword = ref('')
const loading = ref(false)
const searchResults = ref([])

// 筛选和排序
const filters = ['全部', '小说', '科技', '心理学', '历史', '文学', '科幻', '商业', '哲学']
const selectedFilter = ref('全部')
const sortBy = ref('default')

// 我的书架
const myShelfBooks = computed(() => bookStore.myShelfBooks)
const myShelfIds = computed(() => myShelfBooks.value.map(b => b.id))
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 执行搜索
const performSearch = async (keyword) => {
  if (!keyword) return
  
  loading.value = true
  searchQuery.value = keyword
  newSearchKeyword.value = keyword
  
  try {
    // 调用后端搜索API
    const result = await bookStore.searchBooks(keyword)
    searchResults.value = result
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// 筛选后的书籍
const filteredBooks = computed(() => {
  let books = searchResults.value
  
  // 按分类筛选
  if (selectedFilter.value !== '全部') {
    books = books.filter(book => book.genre === selectedFilter.value)
  }
  
  return books
})

// 排序后的书籍
const sortedBooks = computed(() => {
  const books = [...filteredBooks.value]
  
  switch (sortBy.value) {
    case 'rating':
      return books.sort((a, b) => b.rating - a.rating)
    case 'reviews':
      return books.sort((a, b) => b.reviews - a.reviews)
    case 'heat':
      return books.sort((a, b) => b.heat - a.heat)
    default:
      return books
  }
})

// 处理新搜索
const handleNewSearch = () => {
  const keyword = newSearchKeyword.value.trim()
  if (!keyword) {
    alert('请输入搜索关键词')
    return
  }
  
  // 更新URL并重新搜索
  router.push({ name: 'SearchResults', query: { q: keyword } })
}

// 切换收藏
const toggleFavorite = async (book) => {
  if (!isLoggedIn.value) {
    window.dispatchEvent(new CustomEvent('openLoginModal'))
    return
  }
  await bookStore.toggleFavorite(book)
}

// 监听路由变化
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    performSearch(newQuery)
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  const query = route.query.q
  if (query) {
    performSearch(query)
  }
})
</script>

<style scoped>
/* 可以添加特定样式 */
</style>
