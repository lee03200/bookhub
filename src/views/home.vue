<!-- src/views/Home.vue -->
<template>
  <div class="home-page max-w-7xl mx-auto px-4 py-6">

    <!-- =============== 英雄区 =============== -->
    <section class="hero text-center py-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-xl mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">发现你的下一本好书</h1>
      <p class="text-white/90 mb-6 max-w-2xl mx-auto">
        基于智能推荐和真实评价，为你精选最适合的阅读选择
      </p>
      <div class="flex justify-center space-x-4">
        <button class="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition">
          开始探索
        </button>
        <button class="px-6 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition">
          查看推荐
        </button>
      </div>
    </section>

    <!-- =============== 会员专享特权 =============== -->
    <section class="vip-benefits mb-12">
      <h2 class="text-2xl font-bold mb-6">会员专享特权</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 class="font-bold text-lg">无限阅读</h3>
          <p class="text-gray-600 mt-2">畅读平台所有付费书籍，无阅读限制</p>
        </div>
        <div class="p-6 bg-green-50 rounded-lg border border-green-100">
          <h3 class="font-bold text-lg">离线下载</h3>
          <p class="text-gray-600 mt-2">支持下载任意书籍，随时随地阅读</p>
        </div>
        <div class="p-6 bg-purple-50 rounded-lg border border-purple-100">
          <h3 class="font-bold text-lg">专属福利</h3>
          <p class="text-gray-600 mt-2">每月免费领取精选新书，参与会员活动</p>
        </div>
      </div>
      <button class="btn-primary">立即开通会员</button>
    </section>

    <!-- =============== 为你推荐 =============== -->
    <section class="recommend mb-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">为你推荐</h2>
        <button v-if="recommendedBooks.length > 0" class="text-indigo-600">查看更多 →</button>
      </div>
      <div v-if="recommendedBooks.length === 0" class="text-gray-500">
        未找到相关书籍
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <BookCard
          v-for="book in recommendedBooks"
          :key="book.id"
          :book="book"
          :is-in-shelf="myShelfIds.includes(book.id)"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>

    <!-- =============== 热门书籍 =============== -->
    <section class="popular mb-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">热门书籍</h2>
        <button class="text-indigo-600">查看完整榜单 →</button>
      </div>
      <div v-if="popularBooks.length === 0" class="text-gray-500">
        未找到相关书籍
      </div>
      <div v-else class="space-y-4">
        <div v-for="(book, index) in popularBooks" :key="book.id" class="flex items-center p-4 border rounded-lg">
          <span class="text-xl font-bold mr-4 text-gray-500">{{ index + 1 }}</span>
          <img :src="book.cover" class="w-16 h-20 object-cover rounded mr-4" />
          <div class="flex-1">
            <h3 class="font-bold">{{ book.title }}</h3>
            <p class="text-gray-600 text-sm">{{ book.author }}</p>
            <div class="flex items-center mt-1">
              <span class="text-yellow-500">★</span>
              <span class="ml-1 text-sm">{{ book.rating }}</span>
              <span class="mx-2">•</span>
              <span class="text-gray-500 text-sm">{{ book.genre }}</span>
              <span class="mx-2">•</span>
              <span class="text-red-500">{{ book.heat }}° 热度</span>
            </div>
            <p class="text-gray-500 text-xs mt-1">{{ book.reading }} 人在读</p>
          </div>
        </div>
      </div>
    </section>

    <!-- =============== 浏览分类 =============== -->
    <section class="categories mb-12">
      <h2 class="text-2xl font-bold mb-4">浏览分类</h2>
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="px-4 py-2 rounded-full border"
          :class="selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-white'"
        >
          {{ category }}
        </button>
      </div>
      <div v-if="filteredBooks.length === 0" class="text-gray-500">
        该分类下未找到相关书籍
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
    </section>

    <!-- =============== 我的书架 =============== -->
    <section class="my-shelf mb-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">我的书架</h2>
        <router-link to="/shelf" class="text-indigo-600">管理书架 →</router-link>
      </div>
      <p v-if="!isLoggedIn" class="text-gray-500 mb-4">登录后即可查看和管理你的书架</p>
      <p v-else class="text-gray-600 mb-4">
        会员可收藏无限书籍<br/>
        普通用户可收藏 {{ myShelfBooks.length }}/10 本
      </p>
      <div v-if="myShelfBooks.length === 0" class="text-gray-500">
        书架为空，快去添加书籍吧
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <BookCard
          v-for="book in myShelfBooks"
          :key="book.id"
          :book="book"
          :is-in-shelf="true"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>

    <!-- =============== 阅读足迹 =============== -->
    <section class="reading-stats">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">我的阅读足迹</h2>
        <router-link to="/profile" class="text-indigo-600">查看完整记录 →</router-link>
      </div>
      <div v-if="!isLoggedIn" class="text-gray-500">
        登录后即可查看阅读记录
      </div>
      <div v-else class="grid grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-2xl font-bold">{{ readingStats.total }}</div>
          <div class="text-gray-600">总阅读数</div>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ readingStats.thisMonth }}</div>
          <div class="text-gray-600">本月阅读</div>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ readingStats.avgRating }}</div>
          <div class="text-gray-600">平均评分</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/books'
import BookCard from '@/components/BookCard.vue'


// Stores
const userStore = useUserStore()
const bookStore = useBookStore()

// Computed
const isLoggedIn = computed(() => userStore.isLoggedIn)
const myShelfBooks = computed(() => bookStore.myShelfBooks)
const myShelfIds = computed(() => myShelfBooks.value.map(b => b.id))
const readingStats = computed(() => bookStore.readingStats)

// 推荐 & 热门（确保有默认值）
import { recommendedBooksData } from '@/data/books'
const recommendedBooks = computed(() => bookStore.recommended || recommendedBooksData)
const popularBooks = computed(() => bookStore.popular || [])

// 分类浏览
const categories = ['全部', '小说', '科技', '心理学', '历史', '文学']
const selectedCategory = ref('全部')
const allBooks = computed(() => bookStore.allBooks || [])
const filteredBooks = computed(() => {
  if (selectedCategory.value === '全部') return allBooks.value
  return allBooks.value.filter(book => book.genre?.includes(selectedCategory.value))
})

// Methods
const toggleFavorite = (book) => {
  if (!isLoggedIn.value) {
    // 跳转登录
    return
  }
  bookStore.toggleFavorite(book)
}
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition;
}
.btn-outline {
  @apply px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition;
}
</style>




