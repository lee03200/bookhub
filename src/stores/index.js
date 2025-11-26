import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    favorites: [],
    // 补充用户信息字段，与视图层匹配
    userInfo: {
      isVip: false,
      vipExpireDate: '2023-12-31',
      avatar: 'https://picsum.photos/id/64/200' // 默认头像
    },
    // 补充书架和阅读记录数据
    myShelfBooks: [],
    readingHistory: []
  }),
  actions: {
    login(username) {
      this.isLoggedIn = true
      this.username = username
      localStorage.setItem('isLoggedIn', 'true') // 持久化登录状态
    },
    logout() {
      this.$reset()
      localStorage.removeItem('isLoggedIn')
    },
    toggleFavorite(book) {
      // 切换收藏状态时同步更新书架
      const index = this.myShelfBooks.findIndex(b => b.id === book.id)
      if (index > -1) {
        this.myShelfBooks.splice(index, 1)
      } else {
        this.myShelfBooks.push(book)
      }
    }
  },
  getters: {
    isFavorite: (state) => (bookId) => 
      state.myShelfBooks.some(b => b.id === bookId),
    favoriteCount: (state) => state.myShelfBooks.length
  }
})
