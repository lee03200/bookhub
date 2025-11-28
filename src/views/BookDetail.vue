<!-- src/views/BookDetail.vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <!-- 书籍详情（略） -->
    <div class="book-header mb-8">
      <h1 class="text-2xl font-bold">{{ book.title }}</h1>
      <p class="text-gray-600">{{ book.author }}</p>
    </div>

    <!-- =============== 评论区 =============== -->
    <div class="comments-section mt-8">
      <h3 class="text-xl font-bold mb-4">读者评论</h3>

      <!-- 评论列表 -->
      <div v-if="comments.length === 0" class="text-gray-500">
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

      <!-- 发表评论 -->
      <div class="add-comment">
        <textarea
          v-model="newComment"
          placeholder="写下你的评论..."
          class="w-full p-3 border rounded-lg mb-2"
          rows="3"
        ></textarea>
        <button
          @click="submitComment"
          :disabled="!newComment.trim()"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          发表评论
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Props / Route
const route = useRoute()
const bookId = route.params.id

// State
const newComment = ref('')
const comments = ref([])

// Stores
const userStore = useUserStore()

// Mock 数据（实际应从 API 获取）
const fetchComments = async () => {
  // 模拟 API 调用
  comments.value = [
    {
      id: 1,
      username: '张三',
      content: '这本书太棒了！情节紧凑，人物立体...',
      likes: 12,
      dislikes: 2,
      createdAt: '2024-05-12T10:00:00Z'
    },
    {
      id: 2,
      username: '李四',
      content: '结局有点仓促，但整体值得一读。',
      likes: 5,
      dislikes: 1,
      createdAt: '2024-06-01T14:30:00Z'
    }
  ]
}

const submitComment = () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录后再评论')
    return
  }
  if (!newComment.value.trim()) return

  const comment = {
    id: Date.now(),
    username: userStore.user?.name || '匿名用户',
    content: newComment.value.trim(),
    likes: 0,
    dislikes: 0,
    createdAt: new Date().toISOString()
  }

  comments.value.unshift(comment) // 添加到顶部
  newComment.value = ''
}

const likeComment = (id) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) comment.likes++
}

const dislikeComment = (id) => {
  const comment = comments.value.find(c => c.id === id)
  if (comment) comment.dislikes++
}

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('zh-CN')
}

// Lifecycle
onMounted(() => {
  fetchComments()
})
</script>
