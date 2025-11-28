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

    <!-- 简介 -->
    <div class="mb-8 p-4 bg-white rounded-lg border">
      <h3 class="font-bold mb-2">简介</h3>
      <p class="text-gray-700">{{ book.description }}</p>
    </div>

    <!-- 评论区 -->
    <div class="comments-section mt-8">
      <h3 class="text-xl font-bold mb-4">读者评论（{{ comments.length }}）</h3>

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
            <strong>{{ comment.username }}</strong>
            <span class="text-gray-500 text-sm">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="mt-2">{{ comment.content }}</p>
          <div class="flex items-center mt-2 text-sm text-gray-500">
            <button
              @click="likeComment(comment.id)"
              class="mr-3 hover:text-indigo-600"
            >
              👍 赞 ({{ comment.likes }})
            </button>
            <button
              @click="dislikeComment(comment.id)"
              class="hover:text-red-500"
            >
              👎 踩 ({{ comment.dislikes }})
            </button>
          </div>
        </div>
      </div>

      <!-- 写评论按钮 + 输入框（所有用户可见） -->
      <div class="mt-4">
        <button
          @click="showCommentInput = !showCommentInput"
          class="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
        >
          <i class="fas fa-edit mr-1"></i>
          {{ showCommentInput ? '取消评论' : '写评论' }}
        </button>

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
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 路由
const route = useRoute()
const router = useRouter()
const bookId = route.params.id

// 状态
const showCommentInput = ref(false)
const newComment = ref('')
const comments = ref([])

// 用户状态
const userStore = useUserStore()

// 模拟书籍数据
const book = {
  id: bookId,
  title: 'Vue 3 实战指南',
  author: '前端小明',
  rating: 4.7,
  genre: '编程 / 前端',
  description: '从入门到进阶，全面掌握 Vue 3 的核心概念与工程化实践。'
}

// 模拟评论
const fetchComments = () => {
  comments.value = [
    {
      id: 1,
      username: '张三',
      content: '例子非常实用，适合项目开发参考！',
      likes: 8,
      dislikes: 1,
      createdAt: '2024-05-20T09:00:00Z'
    }
  ]
}

// 提交评论（关键逻辑）
const submitComment = () => {
  if (!newComment.value.trim()) return

  // ✅ 提交时才检查登录
  if (!userStore.isLoggedIn) {
    const confirmed = window.confirm('请先登录才能发表评论，是否前往登录？')
    if (confirmed) {
      // 跳转登录页，并带上当前 URL 作为 redirect
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      })
    }
    return
  }

  // 已登录：提交评论
  const comment = {
    id: Date.now(),
    username: userStore.user?.name || '用户',
    content: newComment.value.trim(),
    likes: 0,
    dislikes: 0,
    createdAt: new Date().toISOString()
  }

  comments.value.unshift(comment)
  newComment.value = ''
  showCommentInput.value = false
}

// 点赞功能
const likeComment = (id) => {
  const c = comments.value.find(c => c.id === id)
  if (c) c.likes++
}
const dislikeComment = (id) => {
  const c = comments.value.find(c => c.id === id)
  if (c) c.dislikes++
}

// 工具函数
const formatDate = (iso) => new Date(iso).toLocaleDateString('zh-CN')

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
