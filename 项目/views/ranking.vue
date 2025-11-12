<template>
  <NavBar />
  <main class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-2">热门书籍榜单</h2>
    <p class="text-gray-600 mb-6">发现最受欢迎的书籍，探索不同类别的热门读物</p>

    <!-- 分类筛选 -->
    <div class="flex flex-wrap gap-3 mb-8">
      <button
        v-for="c in categories"
        :key="c"
        :class="[
          'px-4 py-2 rounded-full transition',
          selectedCategory === c
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        ]"
        @click="selectedCategory = c"
      >
        {{ c }}
      </button>
    </div>

    <!-- 榜单列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="divide-y divide-gray-100">
        <div
          v-for="(book, index) in filteredBooks"
          :key="book.id"
          class="flex items-center space-x-4 p-4 hover:bg-gray-50 cursor-pointer transition"
          @click="openBookDetail(book)"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
            {{ index + 1 }}
          </div>
          <div class="flex-shrink-0 w-20 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded overflow-hidden">
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
          <div class="text-right hidden md:block">
            <p class="text-sm text-gray-500">{{ book.reviews }} 人评价</p>
            <p class="text-xs text-gray-400 mt-1">{{ book.reading }} 人在读</p>
          </div>
          <button class="ml-auto text-gray-400 hover:text-indigo-600 transition" @click.stop="addToShelf(book.id)">
            <i class="fas fa-plus-circle text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import StarRating from '@/components/StarRating.vue'

const router = useRouter()

const categories = ref(['全部', '文学', '科幻', '历史', '传记', '商业', '科技', '哲学'])
const selectedCategory = ref('全部')

const allBooks = ref([
  {
    id: 1,
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: 'https://picsum.photos/id/24/300/450',
    rating: 4.8,
    reviews: 12543,
    genre: '历史',
    heat: 987,
    reading: 5621
  },
  {
    id: 2,
    title: '三体',
    author: '刘慈欣',
    cover: 'https://picsum.photos/id/20/300/450',
    rating: 4.9,
    reviews: 25678,
    genre: '科幻',
    heat: 976,
    reading: 8932
  },
  {
    id: 3,
    title: '活着',
    author: '余华',
    cover: 'https://picsum.photos/id/21/300/450',
    rating: 4.7,
    reviews: 18965,
    genre: '文学',
    heat: 965,
    reading: 6321
  },
  {
    id: 4,
    title: '思考，快与慢',
    author: '丹尼尔·卡尼曼',
    cover: 'https://picsum.photos/id/22/300/450',
    rating: 4.6,
    reviews: 11234,
    genre: '心理学',
    heat: 954,
    reading: 4521
  },
  {
    id: 5,
    title: '史蒂夫·乔布斯传',
    author: '沃尔特·艾萨克森',
    cover: 'https://picsum.photos/id/23/300/450',
    rating: 4.8,
    reviews: 9876,
    genre: '传记',
    heat: 943,
    reading: 3256
  },
  {
    id: 6,
    title: '未来简史',
    author: '尤瓦尔·赫拉利',
    cover: 'https://picsum.photos/id/25/300/450',
    rating: 4.5,
    reviews: 8765,
    genre: '历史',
    heat: 932,
    reading: 2890
  },
  {
    id: 7,
    title: '原则',
    author: '瑞·达利欧',
    cover: 'https://picsum.photos/id/26/300/450',
    rating: 4.7,
    reviews: 7654,
    genre: '商业',
    heat: 921,
    reading: 2567
  },
  {
    id: 8,
    title: '人类群星闪耀时',
    author: '斯蒂芬·茨威格',
    cover: 'https://picsum.photos/id/27/300/450',
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
  alert('已添加到书架 ' + id)
}
</script>