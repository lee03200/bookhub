<!-- src/views/Home.vue -->
<template>
  <!-- 保持原模板内容不变 -->
  <!-- ========= 1. 英雄区 ========= -->
  <section class="gradient-bg rounded-2xl text-white p-8 mb-12">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl md:text-6xl font-bold mb-6">发现你的下一本好书</h2>
      <p class="text-xl mb-8 opacity-90">基于智能推荐和真实评价，为你精选最适合的阅读选择</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          class="glass-effect text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition"
          @click="scrollToCategories"
        >
          开始探索
        </button>
        <button
          class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          @click="scrollToRecommend"
        >
          查看推荐
        </button>
      </div>
    </div>
  </section>

  <!-- ========= 2. 会员特权 ========= -->
  <section class="mb-12 bg-white rounded-lg shadow-md p-6">
    <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">会员专享特权</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="text-center p-4 rounded-lg bg-indigo-50">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-book-open text-2xl text-indigo-600"></i>
        </div>
        <h4 class="font-semibold text-gray-800 mb-2">无限阅读</h4>
        <p class="text-gray-600 text-sm">畅读平台所有付费书籍，无阅读限制</p>
      </div>
      <div class="text-center p-4 rounded-lg bg-indigo-50">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-download text-2xl text-indigo-600"></i>
        </div>
        <h4 class="font-semibold text-gray-800 mb-2">离线下载</h4>
        <p class="text-gray-600 text-sm">支持下载任意书籍，随时随地阅读</p>
      </div>
      <div class="text-center p-4 rounded-lg bg-indigo-50">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-gift text-2xl text-indigo-600"></i>
        </div>
        <h4 class="font-semibold text-gray-800 mb-2">专属福利</h4>
        <p class="text-gray-600 text-sm">每月免费领取精选新书，参与会员活动</p>
      </div>
    </div>
    <div class="text-center mt-6">
      <button class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition" @click="showVipModal">
        立即开通会员
      </button>
    </div>
  </section>

  <!-- ========= 3. 为你推荐 ========= -->
  <section class="mb-12">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800">为你推荐</h3>
    </div>

    <div v-if="recommendedBooks.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">未找到相关书籍</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="b in recommendedBooks"
        :key="b.id"
        :book="b"
        :user-info="userInfo"
        @click="() => openBookDetail(b)"
      />
    </div>
  </section>

  <!-- ========= 4. 热门书籍 ========= -->
  <section id="popular-books" class="mb-12">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800">热门书籍</h3>
      <button class="text-indigo-600 hover:text-indigo-800 font-semibold" @click="showFullRanking">
        查看完整榜单 →
      </button>
    </div>

    <div v-if="popularBooks.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">未找到相关书籍</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-4">
        <div
          v-for="(book, index) in popularBooks"
          :key="book.id"
          class="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition"
          @click="openBookDetail(book)"
        >
          <div class="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
            {{ index + 1 }}
          </div>
          <div class="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded overflow-hidden">
            <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-800 truncate">{{ book.title }}</h4>
            <p class="text-gray-600 text-sm">{{ book.author }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <div class="flex items-center space-x-1">
                <StarRating :modelValue="book.rating" readonly />
                <span class="text-sm text-gray-600">{{ book.rating }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ book.genre }}</span>
              <span class="text-sm text-indigo-600 font-semibold">{{ book.heat }}° 热度</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">{{ book.reviews }} 人评价</p>
            <p class="text-xs text-gray-400 mt-1">{{ book.reading }} 人在读</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========= 5. 浏览分类 ========= -->
  <section class="mb-12">
    <h3 id="browse-categories" class="text-2xl font-bold text-gray-800 mb-6">浏览分类</h3>
    <div class="flex flex-wrap gap-3">
      <button
        v-for="category in categories"
        :key="category"
        :class="[
          'px-4 py-2 rounded-full transition',
          selectedCategory === category
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        ]"
        @click="filterByCategory(category)"
      >
        {{ category }}
      </button>
    </div>
  </section>

  <!-- ========= 6. 分类结果 ========= -->
  <section class="mb-12">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">
      {{ selectedCategory === '全部' ? '所有书籍' : selectedCategory + '类书籍' }}
    </h3>

    <div v-if="filteredBooks.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">该分类下未找到相关书籍</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="b in filteredBooks"
        :key="b.id"
        :book="b"
        :user-info="userInfo"
        @click="() => openBookDetail(b)"
      />
    </div>
  </section>

  <!-- ========= 7. 我的书架（登录后） ========= -->
  <section id="my-shelf" class="mb-12" v-if="isLoggedIn">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800">我的书架</h3>
      <div class="flex items-center gap-4">
        <span v-if="userInfo.isVip" class="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center">
          <i class="fas fa-check-circle mr-1"></i>
          <span>会员可收藏无限书籍</span>
        </span>
        <span v-else class="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center">
          <i class="fas fa-info-circle mr-1"></i>
          <span>普通用户可收藏 {{ myShelfBooks.length }}/10 本</span>
        </span>
        <router-link
          :to="{ name: 'Category', params: { cat: '全部' } }"
          class="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          添加书籍 →
        </router-link>
      </div>
    </div>

    <div v-if="myShelfBooks.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <i class="fas fa-book-reader text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">书架为空，快去添加书籍吧</p>
      <router-link
        :to="{ name: 'Category', params: { cat: '全部' } }"
        class="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        浏览书籍
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="b in myShelfBooks"
        :key="b.id"
        :book="b"
        :user-info="userInfo"
        @click="() => openBookDetail(b)"
      />
    </div>
  </section>

  <!-- ========= 8. 阅读足迹 ========= -->
  <section>
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800">我的阅读足迹</h3>
      <button class="text-indigo-600 hover:text-indigo-800 font-semibold" @click="showAllReadingHistory">
        查看完整记录 →
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="text-center p-4 bg-indigo-50 rounded-lg">
          <div class="text-3xl font-bold text-indigo-600">{{ readingStats.total }}</div>
          <div class="text-gray-600 mt-1">总阅读数</div>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-3xl font-bold text-green-600">{{ readingStats.thisMonth }}</div>
          <div class="text-gray-600 mt-1">本月阅读</div>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <div class="text-3xl font-bold text-yellow-600">{{ readingStats.avgRating }}</div>
          <div class="text-gray-600 mt-1">平均评分</div>
        </div>
      </div>

      <div>
        <h4 class="font-semibold text-gray-800 mb-4">最近在读</h4>
        <div class="flex space-x-4 overflow-x-auto pb-2">
          <div
            v-for="book in currentlyReading"
            :key="book.id"
            class="flex-shrink-0 w-24 text-center cursor-pointer"
            @click="openBookDetail(book)"
          >
            <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-2 overflow-hidden">
              <img :src="book.cover" class="w-full h-full object-cover">
            </div>
            <p class="text-xs text-gray-700 truncate">{{ book.title }}</p>
            <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div class="bg-indigo-600 h-1 rounded-full" :style="{ width: book.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/* -------------------- 依赖 -------------------- */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import BookCard from '@/components/BookCard.vue'
// 新增StarRating组件引入
import StarRating from '@/components/StarRating.vue'
// 引入Pinia状态管理
import { useUserStore } from '@/stores/index.js'

/* -------------------- 数据 -------------------- */
const router = useRouter()
const userStore = useUserStore()

// 从Pinia获取登录状态和用户信息
const isLoggedIn = ref(userStore.isLoggedIn)
const userInfo = ref(userStore.userInfo)
const myShelfBooks = ref(userStore.myShelfBooks)

const categories = ref(['全部', '小说', '科技', '历史', '传记', '心理学'])
const selectedCategory = ref('全部')

const recommendedBooks = ref([
  {
    id: 1,
    title: 'JavaScript高级程序设计',
    author: '尼古拉斯·泽卡斯',
    rating: 4.8,
    reviews: 1234,
    cover: 'https://picsum.photos/id/1/300/450',
    isPremium: false
  },
  {
    id: 2,
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    rating: 4.9,
    reviews: 5678,
    cover: 'https://picsum.photos/id/2/300/450',
    isPremium: true
  },
  {
    id: 3,
    title: '三体',
    author: '刘慈欣',
    rating: 4.7,
    reviews: 4321,
    cover: 'https://picsum.photos/id/3/300/450',
    isPremium: false
  },
  {
    id: 4,
    title: '活着',
    author: '余华',
    rating: 4.8,
    reviews: 3456,
    cover: 'https://picsum.photos/id/4/300/450',
    isPremium: false
  }
])

const popularBooks = ref([
  {
    id: 11,
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    rating: 4.8,
    genre: '历史',
    heat: 98,
    reviews: 8765,
    reading: 1234,
    cover: 'https://picsum.photos/id/11/300/450',
    isPremium: false
  },
  {
    id: 12,
    title: '月亮与六便士',
    author: '毛姆',
    rating: 4.7,
    genre: '小说',
    heat: 95,
    reviews: 7654,
    reading: 1098,
    cover: 'https://so1.360tres.com/t017c401645dd63e333.png',
    isPremium: true
  },
  {
    id: 13,
    title: '影响力',
    author: '罗伯特·西奥迪尼',
    rating: 4.9,
    genre: '心理学',
    heat: 92,
    reviews: 6543,
    reading: 987,
    cover: 'https://pica.zhimg.com/v2-ab9d0d8626207673c986e7b372c75974_720w.jpg?source=172ae18b',
    isPremium: false
  },
  {
    id: 14,
    title: '明朝那些事儿',
    author: '当年明月',
    rating: 4.9,
    genre: '历史',
    heat: 90,
    reviews: 9876,
    reading: 1567,
    cover: 'https://p1.ssl.qhimg.com/t0125a05a1f6442097e.jpg',
    isPremium: true
  }
])

const filteredBooks = ref([
  {
    id: 21,
    title: '追风筝的人',
    author: '卡勒德·胡赛尼',
    rating: 4.8,
    reviews: 7654,
    category: '小说',
    cover: 'https://picx.zhimg.com/v2-fea6f7055effc5edf256ae5875c42694_720w.jpg?source=172ae18b',
    isPremium: false
  },
  {
    id: 22,
    title: '白夜行',
    author: '东野圭吾',
    rating: 4.7,
    reviews: 6543,
    category: '小说',
    cover: 'https://ts3.tc.mm.bing.net/th/id/OIP-C.-oMw4HZKTRTFrnAXhML48AHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
    isPremium: false
  },
  {
    id: 23,
    title: 'Python编程',
    author: '埃里克·马瑟斯',
    rating: 4.8,
    reviews: 5432,
    category: '科技',
    cover: 'https://booklibimg.kfzimg.com/data/book_lib_img_v2/isbn/0/cf65/cf658bc055dbdf070b4b6be038bba380_0_0_0_0_water.jpg',
    isPremium: true
  }
])

const readingStats = ref({
  total: 24,
  thisMonth: 3,
  avgRating: 4.5
})

const currentlyReading = ref([
  {
    id: 31,
    title: '思考，快与慢',
    progress: 35,
    cover: 'https://dh.woshipm.com/wp-content/uploads/2022/01/1900338879_ii_cover.jpeg',
    isPremium: false
  },
  {
    id: 32,
    title: 'Python编程：从入门到实践',
    progress: 67,
    cover: 'https://booklibimg.kfzimg.com/data/book_lib_img_v2/isbn/0/cf65/cf658bc055dbdf070b4b6be038bba380_0_0_0_0_water.jpg',
    isPremium: true
  },
  {
    id: 33,
    title: '红楼梦',
    progress: 12,
    cover: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.P-X1Ubk9KAx2eNUPWL2TAwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
    isPremium: false
  }
])

/* -------------------- 方法 -------------------- */
function scrollToCategories() {
  document.getElementById('browse-categories')?.scrollIntoView({ behavior: 'smooth' })
}
function scrollToRecommend() {
  document.querySelector('section:nth-of-type(3)')?.scrollIntoView({ behavior: 'smooth' })
}
function showFullRanking() {
  router.push('/ranking')
}
function filterByCategory(cat) {
  selectedCategory.value = cat
  // 这里后续接接口/Pinia
}
function openBookDetail(book) {
  router.push({ name: 'BookDetail', params: { id: book.id } })
}
function showVipModal() {
  // 由 NavBar 或全局事件总线控制弹窗
}
function showAllReadingHistory() {
  alert('完整记录开发中')
}
</script>

<style scoped>
/* 保留原 html 里和首页相关的自定义样式 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.book-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
