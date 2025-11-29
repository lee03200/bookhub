import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null // 可以是 { id, name, email } 等
  }),

  getters: {
    // ✅ 显式定义 isLoggedIn
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    login(userData, token) {
      this.token = token
      this.user = userData
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
