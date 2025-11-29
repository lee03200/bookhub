// src/stores/index.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    isVip: false,
    username: '',
    joinDate: '',
    bio: '',
    interests: [],
    myShelfBooks: [], // 仅在此处管理
    readingHistory: []
  }),

  getters: {
    shelfCount(state) {
      return state.myShelfBooks.length
    },
    canAddToShelf(state) {
      if (state.isVip) return true
      return state.shelfCount < 10
    }
  },

  actions: {
    login(userData = {}) {
      this.isLoggedIn = true
      this.isVip = userData.isVip || false
      this.username = userData.username || '用户'
      this.joinDate = userData.joinDate || new Date().toISOString().split('T')[0]
      this.bio = userData.bio || '暂无简介'
      this.interests = userData.interests || ['小说']
      // 模拟从 localStorage 恢复书架
      const saved = localStorage.getItem('myShelfBooks')
      if (saved) this.myShelfBooks = JSON.parse(saved)
      localStorage.setItem('isLoggedIn', 'true')
    },

    logout() {
      this.$reset()
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('myShelfBooks')
    },

    updateProfile(profile) {
      this.bio = profile.bio
      this.interests = profile.interests
    },

    addToShelf(book) {
      if (!this.canAddToShelf) return false
      if (this.myShelfBooks.some(b => b.id === book.id)) return false
      this.myShelfBooks.push(book)
      localStorage.setItem('myShelfBooks', JSON.stringify(this.myShelfBooks))
      return true
    },

    removeFromShelf(bookId) {
      this.myShelfBooks = this.myShelfBooks.filter(b => b.id !== bookId)
      localStorage.setItem('myShelfBooks', JSON.stringify(this.myShelfBooks))
    }
  }
})
