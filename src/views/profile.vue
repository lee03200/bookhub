<template>
  <main class="container mx-auto px-4 py-8">
    <!-- 未登录 -->
    <div v-if="!isLoggedIn" class="text-center py-16 bg-white rounded-lg shadow-md">
      <i class="fas fa-user-circle text-6xl text-gray-400 mb-6"></i>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">请先登录</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">登录后即可查看您的个人资料、书架和阅读记录，享受更个性化的阅读体验</p>
      <button class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold" @click="openLogin">
        立即登录
      </button>
    </div>

    <!-- 已登录 -->
    <div v-else>
      <!-- 个人信息卡片 -->
      <section class="profile-card rounded-2xl p-8 mb-12 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div class="flex-shrink-0">
            <!-- 用户头像 -->
            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img :src="userProfile.avatar" alt="用户头像" class="w-full h-full object-cover">
            </div>
            <div class="text-center mt-4">
              <h2 class="text-2xl font-bold text-gray-800">
                {{ userProfile.username }}
              </h2>
            </div>
          </div>

          <!-- 统计和编辑区域 -->
          <div class="flex-1 w-full">
            <!-- 统计信息 -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div class="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div class="text-3xl font-bold text-indigo-600">{{ readingStats.total }}</div>
                  <div class="text-gray-600 mt-1">总阅读数</div>
                </div>
                <div class="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div class="text-3xl font-bold text-green-600">{{ myShelfBooks.length }}</div>
                  <div class="text-gray-600 mt-1">收藏书籍</div>
                </div>
                <div class="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div class="text-3xl font-bold text-yellow-600">{{ readingStats.avgRating }}</div>
                  <div class="text-gray-600 mt-1">平均评分</div>
                </div>
              </div>

              <!-- 个人信息展示 -->
              <div v-if="userProfile.gender || userProfile.bio || userProfile.interests.length" class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">个人信息</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div v-if="userProfile.gender" class="flex items-center">
                    <i class="fas fa-venus-mars text-indigo-600 mr-3 text-xl"></i>
                    <span class="text-gray-700">
                      {{ userProfile.gender === 'male' ? '男' : userProfile.gender === 'female' ? '女' : '保密' }}
                    </span>
                  </div>
                  <div v-if="userProfile.bio" class="md:col-span-2">
                    <div class="flex items-start">
                      <i class="fas fa-user text-indigo-600 mr-3 mt-1"></i>
                      <p class="text-gray-700">{{ userProfile.bio }}</p>
                    </div>
                  </div>
                  <div v-if="userProfile.interests.length" class="md:col-span-3">
                    <div class="flex items-start">
                      <i class="fas fa-book-open text-indigo-600 mr-3 mt-1"></i>
                      <div>
                        <span class="text-gray-700 mr-2">阅读兴趣:</span>
                        <span v-for="interest in userProfile.interests" :key="interest" class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                          {{ getInterestName(interest) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      <!-- 编辑资料弹窗 -->
      <div v-if="editing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">编辑资料</h2>
              <button @click="toggleEdit" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>

            <form @submit.prevent="saveProfile">
              <!-- 头像上传 -->
              <div class="mb-6 flex justify-center">
                <div class="avatar-upload w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg relative cursor-pointer">
                  <img :src="tempProfile.avatar" alt="用户头像" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <i class="fas fa-camera text-white text-2xl"></i>
                  </div>
                  <input type="file" accept="image/*" @change="handleAvatarUpload" class="absolute inset-0 opacity-0 cursor-pointer">
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-gray-700 mb-2">用户名</label>
                <input v-model="tempProfile.username" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 mb-2">个人简介</label>
                <textarea v-model="tempProfile.bio" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="简单介绍一下自己吧..."></textarea>
                <p class="text-gray-500 text-xs mt-1">最多150个字符</p>
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 mb-2">性别</label>
                <div class="flex space-x-6">
                  <label class="inline-flex items-center">
                    <input type="radio" name="gender" value="male" v-model="tempProfile.gender" class="mr-2">
                    <span>男</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" name="gender" value="female" v-model="tempProfile.gender" class="mr-2">
                    <span>女</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" name="gender" value="other" v-model="tempProfile.gender" class="mr-2">
                    <span>保密</span>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 mb-2">阅读兴趣 (可选)</label>
                <select v-model="tempProfile.interests" multiple class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="fiction">小说</option>
                  <option value="nonfiction">非虚构</option>
                  <option value="science">科学</option>
                  <option value="history">历史</option>
                  <option value="biography">传记</option>
                  <option value="business">商业</option>
                  <option value="technology">科技</option>
                  <option value="philosophy">哲学</option>
                </select>
                <p class="text-gray-500 text-xs mt-1">按住Ctrl键可多选</p>
              </div>
              <div class="flex justify-end space-x-4">
                <button type="button" @click="toggleEdit" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  取消
                </button>
                <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 我的书架 -->
      <section class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800">我的书架</h3>
          <div class="flex items-center gap-4">
            <span class="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center">
              <i class="fas fa-info-circle mr-1"></i>
              <span>您已收藏 {{ myShelfBooks.length }} 本书籍</span>
            </span>
            <router-link
              to="/"
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
            to="/"
            class="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            浏览书籍
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="book in myShelfBooks"
            :key="book.id"
            class="book-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            @click="openBookDetail(book)"
          >
            <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
              <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover">
              <button
                class="absolute top-2 left-2 bg-white bg-opacity-80 text-red-500 rounded-full p-1 hover:bg-opacity-100 transition"
                @click.stop="removeFromShelf(book.id)"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="p-4">
              <h4 class="font-bold text-gray-800 mb-2 truncate">{{ book.title }}</h4>
              <p class="text-gray-600 text-sm mb-3">{{ book.author }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-1">
                  <StarRating :rating="book.rating" :readonly="true" />
                  <span class="text-sm text-gray-600">{{ book.rating }}</span>
                </div>
                <span class="text-sm text-gray-500">{{ book.reviews }} 评价</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 阅读足迹 -->
      <section class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800">我的阅读足迹</h3>
          <button class="text-indigo-600 hover:text-indigo-800 font-semibold" @click="showAllReadingHistory">
            查看完整记录 →
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div>
            <h4 class="font-semibold text-gray-800 mb-4">最近在读</h4>
            <div v-if="currentlyReading.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-book-reader text-4xl mb-2"></i>
              <p>暂无正在阅读的书籍</p>
              <router-link to="/" class="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                去浏览书籍 →
              </router-link>
            </div>
            <div v-else class="flex space-x-4 overflow-x-auto pb-2">
              <div
                v-for="book in currentlyReading"
                :key="book.id"
                class="flex-shrink-0 w-24 text-center cursor-pointer"
                @click="openBookDetail(book)"
              >
                <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-2 overflow-hidden relative">
                  <img :src="book.cover" class="w-full h-full object-cover">
                </div>
                <p class="text-xs text-gray-700 truncate">{{ book.title }}</p>
                <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div class="bg-indigo-600 h-1 rounded-full" :style="{ width: book.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h4 class="font-semibold text-gray-800 mb-4">我的评论</h4>
            <div v-if="myComments.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-comment-slash text-4xl mb-2"></i>
              <p>暂无评论记录</p>
            </div>
            <div v-else class="space-y-6">
              <div v-for="(comment, idx) in myComments" :key="idx" class="border-b border-gray-100 pb-4">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded overflow-hidden">
                    <img :src="comment.bookCover" alt="书籍封面" class="w-full h-full object-cover">
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <h5 class="font-medium text-gray-800">{{ comment.bookTitle }}</h5>
                      <span class="text-sm text-gray-500">{{ comment.date }}</span>
                    </div>
                    <div class="flex items-center space-x-2 mb-2">
                      <StarRating :rating="comment.rating" :readonly="true" />
                    </div>
                    <p class="text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/books'
import StarRating from '@/components/StarRating.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const bookStore = useBookStore()

// 使用computed实时获取登录状态（从 localStorage 中读取）
const isLoggedIn = computed(() => localStorage.getItem('isLoggedIn') === 'true')
const userInfo = computed(() => userStore.info)
const userProfile = computed(() => userStore.profile)
const tempProfile = ref({ 
  username: '',
  avatar: '',
  bio: '',
  gender: '',
  interests: []
})
const readingStats = ref(bookStore.readingStats)
const myShelfBooks = ref(bookStore.myShelfBooks)
const currentlyReading = ref(bookStore.currentlyReading)
const myComments = ref(bookStore.myComments || [])
const editing = ref(false)

// 监听 URL 参数，如果有 edit=true 则自动进入编辑模式
onMounted(async () => {
  if (isLoggedIn.value) {
    // 加载用户书架数据
    await bookStore.fetchMyShelf()
    myShelfBooks.value = bookStore.myShelfBooks
    
    // 加载阅读进度
    await bookStore.fetchReadingProgress()
    currentlyReading.value = bookStore.currentlyReading
    
    // 加载评论数据
    await bookStore.fetchMyComments()
    myComments.value = bookStore.myComments
    
    // 更新统计数据
    readingStats.value = {
      total: myShelfBooks.value.length + currentlyReading.value.length,
      thisMonth: currentlyReading.value.length,
      avgRating: 4.5 // 可以从评论中计算
    }
  }
  
  // 检查是否需要打开编辑弹窗
  if (route.query.edit === 'true') {
    toggleEdit()
  }
})

// 监听路由参数变化
watch(() => route.query.edit, (newValue) => {
  if (newValue === 'true' && !editing.value) {
    toggleEdit()
  }
})

// 监听路由变化，刷新数据
watch(() => route.path, async (newPath) => {
  if (newPath === '/profile' && isLoggedIn.value) {
    // 重新加载书架数据
    await bookStore.fetchMyShelf()
    myShelfBooks.value = bookStore.myShelfBooks
    
    // 重新加载评论数据
    await bookStore.fetchMyComments()
    myComments.value = bookStore.myComments
    
    // 更新统计数据
    readingStats.value = {
      total: myShelfBooks.value.length + currentlyReading.value.length,
      thisMonth: currentlyReading.value.length,
      avgRating: 4.5
    }
  }
})

// 完善方法
async function saveProfile() {
  if (!tempProfile.value.username.trim()) {
    alert('请输入用户名')
    return
  }
  if (tempProfile.value.bio && tempProfile.value.bio.length > 150) {
    alert('个人简介不能超过150个字符')
    return
  }
  
  try {
    // 调用store方法更新资料
    const result = await userStore.updateProfile({
      username: tempProfile.value.username,
      bio: tempProfile.value.bio || '',
      gender: tempProfile.value.gender || '',
      interests: tempProfile.value.interests || []
    })
    
    if (result.success) {
      editing.value = false
      // 清除 URL 参数
      if (route.query.edit) {
        router.replace({ path: '/profile' })
      }
      alert('资料保存成功！')
    } else {
      alert('保存失败: ' + (result.error?.detail || '请稍后重试'))
    }
  } catch (error) {
    console.error('保存资料错误:', error)
    alert('保存失败，请稍后重试')
  }
}

function toggleEdit() {
  if (editing.value) {
    // 取消编辑，恢复原数据
    tempProfile.value = { 
      ...userProfile.value,
      gender: userProfile.value.gender || '',
      interests: userProfile.value.interests || []
    }
    // 清除 URL 参数
    if (route.query.edit) {
      router.replace({ path: '/profile' })
    }
  } else {
    // 进入编辑模式，复制当前资料
    tempProfile.value = { 
      ...userProfile.value,
      gender: userProfile.value.gender || '',
      interests: userProfile.value.interests || []
    }
  }
  editing.value = !editing.value
}

async function removeFromShelf(bookId) {
  if (!confirm('确定要从书架移除这本书吗？')) {
    return
  }
  
  try {
    // 找到要移除的书籍
    const book = myShelfBooks.value.find(b => b.id === bookId)
    if (!book) return
    
    // 调用 store 的 toggleFavorite 方法来移除
    const result = await bookStore.toggleFavorite(book)
    
    if (result.success) {
      // 更新本地数据
      myShelfBooks.value = myShelfBooks.value.filter(b => b.id !== bookId)
      alert('已从书架移除！')
    } else {
      alert('移除失败，请稍后重试')
    }
  } catch (error) {
    console.error('移除书籍错误:', error)
    alert('移除失败，请稍后重试')
  }
}

function handleAvatarUpload(e) {
  const file = e.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      tempProfile.value.avatar = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

function getInterestName(interestKey) {
  const interestMap = {
    'fiction': '小说',
    'nonfiction': '非虚构',
    'science': '科学',
    'history': '历史',
    'biography': '传记',
    'business': '商业',
    'technology': '科技',
    'philosophy': '哲学'
  }
  return interestMap[interestKey] || interestKey
}

function openBookDetail(book) {
  router.push({ name: 'BookDetail', params: { id: book.id } })
}

function openLogin() {
  // 向父组件提供器发送事件，不用跳转
  window.dispatchEvent(new CustomEvent('openLoginModal'))
}

function showAllReadingHistory() {
  alert('完整阅读记录页面开发中，即将上线！')
}
</script>

<style scoped>
.profile-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf5 100%);
}

.avatar-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.avatar-upload input {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 100px;
  opacity: 0;
  cursor: pointer;
}

.book-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
