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
import StarRating from '@/components/StarRating.vue'
import { useUserStore } from '@/stores/index.js'

const router = useRouter()
const userStore = useUserStore()

const categories = ['全部', '小说', '科技', '历史', '商业', '心理学']
const selectedCategory = ref('全部')

const allBooks = ref([
  {
    id: 1,
    title: '活着',
    author: '余华',
    cover: 'https://picsum.photos/id/24/300/450',
    rating: 4.9,
    reviews: 9876,
    genre: '小说',
    heat: 998,
    reading: 3456
  },
  {
    id: 2,
    title: '三体',
    author: '刘慈欣',
    cover: 'https://picsum.photos/id/25/300/450',
    rating: 4.8,
    reviews: 8765,
    genre: '科幻',
    heat: 976,
    reading: 3210
  },
  {
    id: 3,
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: 'https://picsum.photos/id/26/300/450',
    rating: 4.7,
    reviews: 7654,
    genre: '历史',
    heat: 932,
    reading: 2890
  },
  {
    id: 4,
    title: '原则',
    author: '瑞·达利欧',
    cover: 'https://picsum.photos/id/27/300/450',
    rating: 4.7,
    reviews: 7654,
    genre: '商业',
    heat: 921,
    reading: 2567
  },
  {
    id: 5,
    title: '人类群星闪耀时',
    author: '斯蒂芬·茨威格',
    cover: 'https://picsum.photos/id/28/300/450',
    rating: 4.6,
    reviews: 6543,
    genre: '历史',
    heat: 910,
    reading: 2134
  }
])

const filteredBooks = computed(() =>
  selectedCategory.value === '全部'
    ? allBooks.value
    : allBooks.value.filter(b => b.genre === selectedCategory.value)
)

function openBookDetail(book) {
  router.push({ name: 'BookDetail', params: { id: book.id } })
}

function addToShelf(id) {
  // 从allBooks中找到对应书籍
  const book = allBooks.value.find(b => b.id === id)
  if (book) {
    userStore.toggleFavorite(book)
    alert(`已${userStore.isFavorite(id) ? '添加' : '移除'}到书架`)
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
