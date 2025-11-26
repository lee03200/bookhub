import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Profile from '../views/profile.vue'
import Ranking from '../views/ranking.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/profile', component: Profile },
  { path: '/ranking', component: Ranking }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router