<!-- src/views/ranking.vue -->
<template>
  <div class="ranking-page">
    <!-- 未登录提示 -->
    <div v-if="!isLoggedIn" class="container mx-auto px-4 py-16 text-center">
      <div class="bg-white rounded-lg shadow-md p-12">
        <i class="fas fa-lock text-6xl text-gray-400 mb-6"></i>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">请先登录</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          登录后可查看完整的热门书籍榜单，添加书籍到书架，发表评论和评分
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
    <div v-else>
    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <section class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800">热门书籍榜单</h2>
        <p class="text-gray-600 mt-2">发现最受欢迎的书籍，探索不同类别的热门读物</p>
      </section>

      <!-- 分类筛选 -->
      <section class="mb-8">
        <div class="flex flex-wrap gap-3">
          <button 
            v-for="category in categories" 
            :key="category" 
            @click="filterByCategory(category)"
            :class="[
              'px-4 py-2 rounded-full transition',
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </section>

      <!-- 榜单内容 -->
      <section>
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          {{ selectedCategory === '全部' ? '全品类热门榜' : selectedCategory + '热门榜' }}
        </h3>

        <div v-if="filteredBooks.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">未找到相关书籍</p>
        </div>

        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="divide-y divide-gray-100">
            <div 
              v-for="(book, index) in filteredBooks" 
              :key="book.id"
              class="flex items-center space-x-4 p-4 hover:bg-gray-50 cursor-pointer transition"
              @click="openBookDetail(book)"
            >
              <!-- 排名 -->
              <div class="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                {{ index + 1 }}
              </div>

              <!-- 书籍封面 -->
              <div class="flex-shrink-0 w-20 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded overflow-hidden relative">
                <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover">
              </div>

              <!-- 书籍信息 -->
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-800 truncate">{{ book.title }}</h4>
                <p class="text-gray-600 text-sm">{{ book.author }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <div class="flex items-center space-x-1">
                    <StarRating :rating="book.rating" :readonly="true" />
                    <span class="text-sm text-gray-600">{{ book.rating }}</span>
                  </div>
                  <span class="text-sm text-gray-500">{{ book.genre }}</span>
                  <span class="text-sm text-indigo-600 font-semibold">{{ book.heat }}° 热度</span>
                </div>
              </div>

              <!-- 统计信息（桌面显示） -->
              <div class="text-right hidden md:block">
                <p class="text-sm text-gray-500">{{ book.reviews }} 人评价</p>
                <p class="text-xs text-gray-400 mt-1">{{ book.reading }} 人在读</p>
              </div>

              <!-- 添加按钮 -->
              <button 
                class="ml-auto text-gray-400 hover:text-indigo-600 transition"
                @click.stop="addToShelf(book)"
              >
                <i class="fas fa-plus-circle text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 书籍详情模态框 -->
    <div v-if="selectedBook" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-3xl font-bold text-gray-800">{{ selectedBook.title }}</h2>
            <button @click="selectedBook = null" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 左侧：书籍信息 -->
            <div>
              <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 overflow-hidden">
                <img :src="selectedBook.cover" :alt="selectedBook.title" class="w-full h-full object-cover">
              </div>
              <div class="space-y-2 text-sm">
                <p><span class="font-semibold">作者:</span> {{ selectedBook.author }}</p>
                <p><span class="font-semibold">出版社:</span> {{ selectedBook.publisher }}</p>
                <p><span class="font-semibold">出版日期:</span> {{ selectedBook.publishDate }}</p>
                <p><span class="font-semibold">页数:</span> {{ selectedBook.pages }}</p>
                <p><span class="font-semibold">ISBN:</span> {{ selectedBook.isbn }}</p>
              </div>
            </div>

            <!-- 右侧：详细信息 -->
            <div class="md:col-span-2">
              <!-- 简介 -->
              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-3">书籍简介</h3>
                <p class="text-gray-700 leading-relaxed">{{ selectedBook.description }}</p>
              </div>

              <!-- 评分和评论 -->
              <div class="mb-6">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="flex items-center space-x-2">
                    <StarRating v-model="userRating" :readonly="false" />
                    <span class="text-lg font-semibold">{{ userRating }}/5</span>
                  </div>
                  <button
                    class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    @click="submitRating"
                  >
                    提交评分
                  </button>
                </div>

                <!-- 评论框 -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold mb-2">写评论</h4>
                  <textarea
                    v-model="commentContent"
                    rows="3"
                    placeholder="分享你的阅读感受..."
                    class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    @click="submitComment"
                  >
                    发布评论
                  </button>
                </div>
              </div>

              <!-- 评论列表 -->
              <div v-if="selectedBook.comments && selectedBook.comments.length > 0">
                <h4 class="font-semibold mb-4">读者评论</h4>
                <div class="space-y-4">
                  <div 
                    v-for="(comment, idx) in selectedBook.comments" 
                    :key="idx"
                    class="border-b border-gray-100 pb-4"
                  >
                    <div class="flex items-center space-x-2 mb-2">
                      <img :src="comment.avatar" alt="用户头像" class="w-8 h-8 rounded-full">
                      <span class="font-medium">{{ comment.username }}</span>
                      <StarRating :rating="comment.rating" :readonly="true" />
                    </div>
                    <p class="text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/books'
import { commentApi } from '@/api'
import StarRating from '@/components/StarRating.vue'

const router = useRouter()
const userStore = useUserStore()
const bookStore = useBookStore()

// ... existing code ...
const searchKeyword = ref('')
const selectedCategory = ref('全部')
const selectedBook = ref(null)
const userRating = ref(0)
const commentContent = ref('')

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 打开登录模态框
const openLogin = () => {
  window.dispatchEvent(new CustomEvent('openLoginModal'))
}

const categories = ['全部', '文学', '科幻', '历史', '传记', '心理学', '商业', '科技', '哲学', '艺术']

// 从后端API加载书籍数据
const booksFromApi = ref([])

// 加载书籍数据
onMounted(async () => {
  try {
    const result = await bookStore.fetchAllBooks()
    booksFromApi.value = result.results || result || []
  } catch (error) {
    console.error('加载书籍数据失败:', error)
    booksFromApi.value = []
  }
})

const allBooks = computed(() => {
  // 使用从 API 加载的书籍数据
  return booksFromApi.value.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    rating: book.rating || 0,
    reviews: book.reviews || 0,
    genre: book.genre || '未分类',
    heat: book.heat || 0,
    reading: book.reading || '0',
    cover: book.cover || 'https://picsum.photos/id/24/200/300',
    publisher: book.publisher || '未知出版社',
    publishDate: book.publish_date || '',
    pages: book.pages || 0,
    isbn: book.isbn || '',
    description: book.description || '暂无简介',
    isPremium: book.is_premium || false,
    comments: []
  }))
})

const filteredBooks = computed(() => {
  let books = allBooks.value

  // 按分类筛选
  if (selectedCategory.value !== '全部') {
    books = books.filter(book => book.genre === selectedCategory.value)
  }

  // 按搜索词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    books = books.filter(book =>
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword)
    )
  }

  // 按热度排序
  return books.sort((a, b) => b.heat - a.heat)
})

// 方法
const filterByCategory = (category) => {
  selectedCategory.value = category
}

const handleSearch = () => {
  // 搜索结果会自动通过 filteredBooks 计算属性更新
}

const openBookDetail = (book) => {
  selectedBook.value = { ...book }
  userRating.value = book.rating
  commentContent.value = ''
}

const submitRating = () => {
  if (!isLoggedIn.value) {
    alert('请先登录')
    return
  }
  alert(`已提交评分: ${userRating.value}星`)
  selectedBook.value = null
}

const submitComment = async () => {
  if (!isLoggedIn.value) {
    alert('请先登录')
    return
  }
  if (!commentContent.value.trim()) {
    alert('请输入评论内容')
    return
  }
  if (userRating.value === 0) {
    alert('请先进行评分')
    return
  }

  try {
    // 调用后端API提交评论
    const response = await commentApi.createComment({
      book: selectedBook.value.id,
      content: commentContent.value.trim(),
      rating: Math.round(userRating.value)  // 确保评分是整数
    })

    // 添加到当前书籍的评论列表（前端展示）
    if (!selectedBook.value.comments) {
      selectedBook.value.comments = []
    }

    const newComment = {
      username: userStore.profile.username || '用户',
      avatar: userStore.profile.avatar || 'https://picsum.photos/id/64/100/100',
      rating: Math.round(userRating.value),
      content: commentContent.value
    }
    
    selectedBook.value.comments.unshift(newComment)
    
    // 清空评论框
    commentContent.value = ''
    
    alert('评论发布成功！可在个人中心查看')
  } catch (error) {
    console.error('发布评论失败:', error)
    
    // 更详细的错误处理
    if (error.response?.data) {
      const errorData = error.response.data
      
      // 处理书籍ID不存在的情况
      if (errorData.book && errorData.book[0]?.includes('无效主键')) {
        alert('该书籍不存在于数据库中，无法评论。请尝试其他书籍。')
        return
      }
      
      // 处理评分错误
      if (errorData.rating) {
        alert('评分错误：' + errorData.rating[0])
        return
      }
      
      // 处理评论内容错误
      if (errorData.content) {
        alert('评论内容错误：' + errorData.content[0])
        return
      }
      
      // 其他错误
      const errorMsg = errorData.detail || '发布评论失败'
      alert(errorMsg)
    } else {
      alert('发布评论失败，请稍后重试')
    }
  }
}

const addToShelf = async (book) => {
  if (!isLoggedIn.value) {
    alert('请先登录')
    return
  }
  
  try {
    // 调用 bookStore 的 toggleFavorite 方法
    const result = await bookStore.toggleFavorite(book)
    
    if (result.success) {
      if (result.isInShelf) {
        alert('已添加到书架！可在“我的书架”中查看')
      } else {
        alert('已从书架移除')
      }
    } else {
      alert('操作失败，请稍后重试')
    }
  } catch (error) {
    console.error('添加书籍到书架失败:', error)
    alert('操作失败，请稍后重试')
  }
}
</script>

<style scoped>
</style>
