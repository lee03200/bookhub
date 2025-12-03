<!-- src/App.vue -->
<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- =============== 全局导航栏 =============== -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <i class="fas fa-book text-indigo-600 text-xl"></i>
            <span class="ml-2 font-bold text-xl">BookHub</span>
          </div>

          <!-- 搜索框（中屏以上显示） -->
          <div class="hidden md:flex items-center w-80 mx-4">
            <input
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="搜索书籍、作者或ISBN..."
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              @click="handleSearch"
              class="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>

          <!-- 导航chain接 -->
          <nav class="flex space-x-6">
            <router-link 
              to="/" 
              :class="['font-medium transition', currentRoute === '/' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-gray-700 hover:text-indigo-600']"
            >首页</router-link>
            <router-link 
              to="/ranking" 
              :class="['font-medium transition', currentRoute === '/ranking' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-gray-700 hover:text-indigo-600']"
            >热门书籍</router-link>
            <router-link 
              to="/profile" 
              :class="['font-medium transition', currentRoute === '/profile' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-gray-700 hover:text-indigo-600']"
            >我的书架</router-link>
          </nav>

          <!-- 登录/注册按钮或用户菜单 -->
          <div v-if="!isLoggedIn">
            <button
              @click="handleLogin"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              登录/注册
            </button>
          </div>
          
          <!-- 已登录：用户头像和下拉菜单 -->
          <div v-else class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <img
                :src="userStore.profile.avatar"
                alt="用户头像"
                class="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover"
              />
              <span class="hidden md:block font-medium text-gray-700">{{ userStore.profile.username }}</span>
              <i class="fas fa-chevron-down text-gray-500 text-sm"></i>
            </button>
            
            <!-- 下拉菜单 -->
            <transition name="dropdown">
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <router-link
                  to="/profile"
                  @click="showUserMenu = false"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                >
                  <i class="fas fa-user mr-2"></i>
                  个人中心
                </router-link>
                <router-link
                  to="/profile"
                  @click="showUserMenu = false"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                >
                  <i class="fas fa-book mr-2"></i>
                  我的书架
                </router-link>
                <button
                  @click="handleEditProfile"
                  class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                >
                  <i class="fas fa-edit mr-2"></i>
                  编辑资料
                </button>
                <div class="border-t border-gray-200 my-2"></div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  退出登录
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- =============== 页面内容 =============== -->
    <main>
      <router-view />
    </main>

    <!-- 登录/注册模态框 -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-gray-800">{{ isRegistering ? '注册' : '登录' }}</h2>
            <button @click="showLoginModal = false" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- 登录表单 -->
          <form v-if="!isRegistering" @submit.prevent="handleLoginSubmit">
            <div class="mb-4">
              <label for="login-username" class="block text-gray-700 mb-2">用户名</label>
              <input 
                type="text" 
                id="login-username"
                v-model="loginForm.username"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required>
            </div>

            <div class="mb-6">
              <label for="login-password" class="block text-gray-700 mb-2">密码</label>
              <input 
                type="password" 
                id="login-password"
                v-model="loginForm.password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required>
            </div>

            <button type="submit" class="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">
              登录
            </button>

            <div class="text-center mt-4 text-gray-600 text-sm">
              还没有账号？<a href="#" class="text-indigo-600 hover:text-indigo-800 font-semibold" @click.prevent="isRegistering = true">立即注册</a>
            </div>
          </form>

          <!-- 注册表单 -->
          <form v-else @submit.prevent="handleRegisterSubmit">
            <div class="mb-4">
              <label for="register-username" class="block text-gray-700 mb-2">用户名</label>
              <input 
                type="text" 
                id="register-username"
                v-model="registerForm.username"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required>
            </div>

            <div class="mb-4">
              <label for="register-password" class="block text-gray-700 mb-2">密码</label>
              <input 
                type="password" 
                id="register-password"
                v-model="registerForm.password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required>
            </div>

            <div class="mb-6">
              <label for="register-confirm" class="block text-gray-700 mb-2">确认密码</label>
              <input 
                type="password" 
                id="register-confirm"
                v-model="registerForm.confirmPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                required>
            </div>

            <button type="submit" class="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">
              注册
            </button>

            <div class="text-center mt-4 text-gray-600 text-sm">
              已有账号？<a href="#" class="text-indigo-600 hover:text-indigo-800 font-semibold" @click.prevent="isRegistering = false">立即登录</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentRoute = computed(() => router.currentRoute.value.path)

const showLoginModal = ref(false)
const isRegistering = ref(false)
const showUserMenu = ref(false)
const userMenuRef = ref(null)

// 搜索功能
const searchKeyword = ref('')

const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  if (!keyword) {
    alert('请输入搜索关键词')
    return
  }
  // 跳转到搜索结果页
  router.push({ name: 'SearchResults', query: { q: keyword } })
  searchKeyword.value = '' // 清空搜索框
}

const loginForm = ref({
  username: '',
  password: ''
})
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 监听profile组件发送的登录事件
onMounted(() => {
  // 初始化检查用户状态
  userStore.init()
  
  window.addEventListener('openLoginModal', () => {
    showLoginModal.value = true
    isRegistering.value = false
  })
  
  // 监听切换到注册模式
  window.addEventListener('switchToRegister', () => {
    isRegistering.value = true
  })
  
  // 点击外部关闭下拉菜单
  document.addEventListener('click', (e) => {
    if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
      showUserMenu.value = false
    }
  })
})

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 处理登录按钮点击
const handleLogin = () => {
  showLoginModal.value = true
}

// 处理编辑资料
const handleEditProfile = () => {
  showUserMenu.value = false
  router.push('/profile?edit=true')
}

// 处理登出
const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await userStore.logout()
    showUserMenu.value = false
    router.push('/')
    alert('已退出登录')
  }
}

const handleLoginSubmit = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请输入用户名和密码')
    return
  }
  
  try {
    const result = await userStore.login({
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    
    if (result.success) {
      showLoginModal.value = false
      loginForm.value = { username: '', password: '' }
      alert('登录成功！')
      router.push('/profile')
    } else {
      alert(result.error?.detail || '登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('登录错误:', error)
    alert('登录失败，请稍后重试')
  }
}

const handleRegisterSubmit = async () => {
  if (!registerForm.value.username) {
    alert('请输入用户名')
    return
  }
  if (!registerForm.value.password) {
    alert('请输入密码')
    return
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  if (registerForm.value.password.length < 6) {
    alert('密码长度至少6位')
    return
  }
  
  try {
    const result = await userStore.register({
      username: registerForm.value.username,
      email: registerForm.value.username + '@example.com',
      password: registerForm.value.password,
      password2: registerForm.value.confirmPassword
    })
    
    if (result.success) {
      // 注册成功，切换到登录表单
      alert('注册成功！请登录')
      
      // 将注册的用户名填充到登录表单
      loginForm.value.username = registerForm.value.username
      loginForm.value.password = ''
      
      // 清空注册表单
      registerForm.value = { username: '', password: '', confirmPassword: '' }
      
      // 切换到登录表单
      isRegistering.value = false
      
      // 不关闭模态框，让用户登录
    } else {
      alert(result.error?.username?.[0] || result.error?.detail || '注册失败')
    }
  } catch (error) {
    console.error('注册错误:', error)
    alert('注册失败，请稍后重试')
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
