import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    favorites: []
  }),
  actions: {
    login(username) {
      this.isLoggedIn = true
      this.username = username
    },
    logout() {
      this.$reset()
    },
    toggleFavorite(bookId) {
      const index = this.favorites.indexOf(bookId)
      if (index >= 0) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(bookId)
      }
    }
  },
  getters: {
    isFavorite: (state) => (bookId) => state.favorites.includes(bookId),
    favoriteCount: (state) => state.favorites.length
  }
})