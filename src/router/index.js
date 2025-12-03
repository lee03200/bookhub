import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Profile from '../views/profile.vue'
import Ranking from '../views/ranking.vue'
// 新增书籍详情页和分类页路由（先创建空组件占位）
import BookDetail from '../views/BookDetail.vue'
import Category from '../views/Category.vue'
import RecommendedBooks from '../views/RecommendedBooks.vue'
import SearchResults from '../views/SearchResults.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/profile', component: Profile },
  { path: '/ranking', component: Ranking },
  { path: '/recommended', name: 'RecommendedBooks', component: RecommendedBooks }, // 推荐书籍页
  { path: '/search', name: 'SearchResults', component: SearchResults }, // 搜索结果页
  { path: '/book/:id', name: 'BookDetail', component: BookDetail }, // 补充书籍详情页
  { path: '/category/:cat', name: 'Category', component: Category } // 补充分类页
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫（检查未登录访题个人中心）
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (to.path === '/profile' && !isLoggedIn) {
    // 不转移，让profile组件内需来显示登录页面
    next()
  } else {
    next()
  }
})

export default router
