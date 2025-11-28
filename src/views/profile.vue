<template>
  <NavBar />
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
      <section class="profile-card rounded-2xl p-8 mb-12 shadow-md">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div class="flex-shrink-0">
            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img :src="userProfile.avatar" alt="用户头像" class="w-full h-full object-cover">
            </div>
            <div class="text-center mt-4">
              <h2 class="text-2xl font-bold text-gray-800 flex items-center justify-center">
                {{ userProfile.username }}
                <span v-if="userInfo.isVip" class="ml-2 px-2 py-0.5 text-xs rounded-full vip-badge">VIP</span>
              </h2>
              <p class="text-gray-600 mt-1">加入于 {{ userProfile.memberSince }}</p>
              <button class="mt-3 bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm" @click="toggleEdit">
                {{ editing ? '取消编辑' : '编辑资料' }}
              </button>
            </div>
          </div>

          <!-- 统计 -->
          <div class="flex-1 w-full">
            <div v-if="!editing" class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
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

            <!-- 会员状态 -->
            <div v-if="!editing" class="bg-white rounded-lg p-6 shadow-sm">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800">会员状态</h3>
                <button class="text-indigo-600 hover:text-indigo-800 font-medium" @click="openVip">
                  {{ userInfo.isVip ? '续费会员' : '开通会员' }}
                </button>
              </div>
              <div class="flex items-center">
                <i v-if="userInfo.isVip" class="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
                <i v-else class="fas fa-times-circle text-red-500 text-2xl mr-3"></i>
                <div>
                  <p class="text-gray-800 font-medium">{{ userInfo.isVip ? '高级会员' : '普通用户' }}</p>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ userInfo.isVip ? `有效期至: ${userInfo.vipExpireDate}` : '开通会员解锁更多特权' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 编辑表单 -->
            <div v-else class="bg-white rounded-lg p-6 shadow-sm">
              <h3 class="text-xl font-semibold text-gray-800 mb-6">编辑个人资料</h3>
              <form @submit.prevent="saveProfile">
                <div class="mb-6">
                  <label class="block text-gray-700 mb-2">用户名</label>
                  <input v-model="tempProfile.username" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                </div>
                <div class="mb-6">
                  <label class="block text-gray-700 mb-2">个人简介</label>
                  <textarea v-model="tempProfile.bio" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="简单介绍一下自己吧..."></textarea>
                  <p class="text-gray-500 text-xs mt-1">最多150个字符</p>
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
      </section>

      <!-- 我的书架 -->
      <section class="mb-12">
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
            @click="openBookDetail"
          />
        </div>
      </section>

      <!-- 阅读足迹 -->
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
              <div class="text-3xl font-bold text-green-600">{{ myShelfBooks.length }}</div>
              <div class="text-gray-600 mt-1">收藏书籍</div>
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
    </div>
  </main>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/books'
import NavBar from '@/components/NavBar.vue'
import BookCard from '@/components/BookCard.vue'

const router = useRouter()
const userStore = useUserStore()
const bookStore = useBookStore()

// 从store获取数据
const isLoggedIn = ref(userStore.isLoggedIn)
const userInfo = ref(userStore.info)
const userProfile = ref(userStore.profile)
const tempProfile = ref({ ...userProfile.value })
const readingStats = ref(bookStore.readingStats)
const myShelfBooks = ref(bookStore.myShelfBooks)
const currentlyReading = ref(bookStore.currentlyReading)
const editing = ref(false)

// 完善方法
function saveProfile() {
  if (!tempProfile.value.username.trim()) return alert('请输入用户名')
  if (tempProfile.value.bio.length > 150) return alert('个人简介不能超过150个字符')
  userStore.updateProfile(tempProfile.value) // 调用store方法更新
  userProfile.value = { ...tempProfile.value }
  editing.value = false
  alert('资料保存成功！')
}

function openBookDetail(book) {
  router.push({ name: 'BookDetail', params: { id: book.id } })
}

function openVip() {
  router.push('/vip') // 替换事件总线为路由跳转
}

function openLogin() {
  router.push('/login') // 替换事件总线为路由跳转
}

function showAllReadingHistory() {
  router.push('/history') // 跳转到完整记录页
}
</script>
