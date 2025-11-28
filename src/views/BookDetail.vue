<!-- src/views/BookDetail.vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <!-- 书籍信息（简化） -->
    <div class="book-header mb-8">
      <h1 class="text-2xl font-bold text-gray-900">《{{ book.title }}》</h1>
      <p class="text-gray-600 mt-1">作者：{{ book.author }}</p>
      <div class="mt-4 flex items-center">
        <span class="text-yellow-500">★</span>
        <span class="ml-1">{{ book.rating }}</span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-gray-600">{{ book.genre }}</span>
      </div>
    </div>

    <!-- 书籍简介 -->
    <div class="mb-8 p-4 bg-white rounded-lg border">
      <h3 class="font-bold mb-2">简介</h3>
      <p class="text-gray-700">{{ book.description }}</p>
    </div>

    <!-- =============== 评论区 =============== -->
    <div class="comments-section mt-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">读者评论（{{ comments.length }}）</h3>
      </div>

      <!-- 评论列表 -->
      <div v-if="comments.length === 0" class="text-gray-500 py-4">
        暂无评论，快来抢沙发吧！
      </div>
      <div v-else class="space-y-4 mb-6">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item p-4 bg-white rounded-lg border"
        >
          <div class="flex justify-between">
            <strong class="text-gray-900">{{ comment.username }}</strong>
            <span class="text-gray-500 text-sm">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="mt-2 text-gray-700">{{ comment.content }}</p>
          <div class="flex items-center mt-2 text-sm">
            <button
              @click="likeComment(comment.id)"
              class="mr-3 text-gray-500 hover:text-indigo-600 flex items-center"
            >
              👍 <span class="ml-1">{{ comment.likes }}</span>
            </button>
            <button
              @click="dislikeComment(comment.id)"
              class="text-gray-500 hover:text-red-500 flex items-center"
            >
              👎 <span class="ml-1">{{ comment.dislikes }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 写评论按钮 + 弹出框 -->
      <div class="mt-4">
        <button
          v-if="userStore.isLoggedIn"
          @click="showCommentInput = !showCommentInput"
          class="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
        >
          <i class="fas fa-edit mr-1"></i>
          {{ showCommentInput ? '取消评论' : '写评论' }}
        </button>
        <p v-else class="text-gray-500">
          <router-link to="/profile" class="text-indigo-600 hover:underline">登录</router-link>
          后可发表评论
        </p>

        <!-- 评论输入框（弹出） -->
        <Transition name="slide-fade">
          <div v-if="showCommentInput" class="mt-4 p-4 bg-gray-50 rounded-lg border">
            <textarea
              v-model="newComment"
              placeholder="写下你的评论..."
              class="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            ></textarea>
            <div class="flex justify-end space-x-2">
              <button
                @click="showCommentInput = false"
                class="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
              >
                取消
              </button>
              <button
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                发表
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 路由参数
const route = useRoute()
const bookId = route.params.id

// 状态
const showCommentInput = ref(false)
const newComment = ref('')
const comments = ref([])

// 用户 Store
const userStore = useUserStore()

// 模拟书籍数据（实际应从 API 获取）
const book = {
  id: bookId,
  title: '深入理解 Vue 3',
  author: '前端小明',
  rating: 4.8,
  genre: '编程 / 前端',
  description: '本书系统讲解 Vue 3 的响应式原理、组合式 API、性能优化等核心知识，适合中高级开发者。'
}

// 模拟评论数据（实际应从 /api/comments?bookId=xxx 获取）
const fetchComments = () => {
  comments.value = [
    {
      id: 1,
      username: '张三',
      content: '这本书太棒了！情节紧凑，人物立体，读完收获很大。',
      likes: 12,
      dislikes: 2,
      createdAt: '2024-05-12T10:00:00Z'
    },
    {
      id: 2,
      username: '李四',
      content: '例子很实用，但第5章讲得有点快，建议配合视频学习。',
      likes: 5,
      dislikes: 1,
      createdAt: '2024-06-01T14:30:00Z'
    }
  ]
}

// 提交评论
const submitComment = () => {
  if (!userStore.isLoggedIn) return

  const comment = {
    id: Date.now(),
    username: userStore.user?.name || '匿名用户',
    content: newComment.value.trim(),
    likes: 0,
    dislikes: 0,
    createdAt: new Date().toISOString()
  }

  comments.value.unshift(comment)
  newComment.value = ''
  showCommentInput.value = false // 自动收起
}

// 点赞 / 踩
const likeComment = (id) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) comment.likes++
}

const dislikeComment = (id) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) comment.dislikes++
}

// 格式化日期
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('zh-CN')
}

// 初始化
onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
