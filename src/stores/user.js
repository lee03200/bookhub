import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    info: {
      isVip: false,
      vipExpireDate: '2023-12-31'
    },
    profile: {
      username: '默认用户',
      avatar: 'https://picsum.photos/id/64/200',
      bio: '',
      memberSince: '2023-01-01'
    }
  }),
  actions: {
    login() {
      this.isLoggedIn = true
    },
    logout() {
      this.isLoggedIn = false
    },
    updateProfile(data) {
      this.profile = { ...this.profile, ...data }
    }
  }
})
