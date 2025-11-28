// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    info: {
      id: null,
      name: '',
      email: '',
      isVip: false,
      avatar: ''
    }
  }),

  actions: {
    login(userData) {
      this.isLoggedIn = true
      this.info = { ...userData }
    },

    logout() {
      this.isLoggedIn = false
      this.info = {
        id: null,
        name: '',
        email: '',
        isVip: false,
        avatar: ''
      }
    }
  },

  // 可选：持久化（需安装 pinia-plugin-persistedstate）
  // persist: true
})
