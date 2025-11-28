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
              type="text"
              placeholder="搜索书籍、作者或ISBN..."
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- 导航链接 -->
          <nav class="flex space-x-6">
            <router-link to="/" class="text-gray-700 hover:text-indigo-600 font-medium">首页</router-link>
            <router-link to="/ranking" class="text-gray-700 hover:text-indigo-600 font-medium">热门书籍</router-link>
            <router-link to="/profile" class="text-gray-700 hover:text-indigo-600 font-medium">我的书架</router-link>
            <span class="text-indigo-600 font-semibold">👑 会员</span>
          </nav>

          <!-- 登录/注册按钮 -->
          <button
            @click="handleLogin"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {{ isLoggedIn ? '个人中心' : '登录/注册' }}
          </button>
        </div>
      </div>
    </header>

    <!-- =============== 页面内容 =============== -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

const handleLogin = () => {
  if (!isLoggedIn.value) {
    // 简单跳转到登录（你可以后续做弹窗或专门登录页）
    alert('跳转到登录页面（待实现）')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
