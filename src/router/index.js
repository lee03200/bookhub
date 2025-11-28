import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Profile from '../views/profile.vue'
import Ranking from '../views/ranking.vue'
// 新增书籍详情页和分类页路由（先创建空组件占位）
import BookDetail from '../views/BookDetail.vue'
import Category from '../views/Category.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/profile', component: Profile },
  { path: '/ranking', component: Ranking },
  { path: '/book/:id', name: 'BookDetail', component: BookDetail }, // 补充书籍详情页
  { path: '/category/:cat', name: 'Category', component: Category } // 补充分类页
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 简单路由守卫示例（处理未登录访问个人中心）
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (to.path === '/profile' && !isLoggedIn) {
    alert('请先登录')
    next('/')
  } else {
    next()
  }
})

export default router
