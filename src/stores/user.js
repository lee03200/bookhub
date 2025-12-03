import { defineStore } from 'pinia'
import { userApi } from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null,
    
    // 用户信息
    info: {
      isVip: false,
      vipExpireDate: ''
    },

    // 用户个人资料（只在登录后加载）
    profile: {
      username: '',
      avatar: '',
      memberSince: '',
      bio: '',
      gender: '',
      interests: []
    },
    
    // 加载状态
    loading: false
  }),

  getters: {
    // 只有同时具备 token 和 user 信息才算登录
    isLoggedIn: (state) => {
      const hasToken = !!state.token
      const hasValidProfile = !!state.profile.username
      return hasToken && hasValidProfile
    }
  },

  actions: {
    // 初始化检查：清除无效的登录状态
    init() {
      const token = localStorage.getItem('token')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      
      // 如果有 token 但没有用户信息，清除登录状态
      if (token && !this.profile.username) {
        console.log('检测到无效的登录状态，清除中...')
        this.token = ''
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('isLoggedIn')
      }
      
      // 如果有有效 token，尝试加载用户资料
      if (this.token && !this.profile.username) {
        this.loadUserProfile()
      }
    },
    
    // 用户注册（不自动登录）
    async register(userData) {
      try {
        this.loading = true
        const response = await userApi.register(userData)
        
        // 注册成功，但不自动登录
        // 让用户手动登录以验证账号
        return { success: true, data: response.data }
      } catch (error) {
        console.error('注册失败:', error)
        return { success: false, error: error.response?.data }
      } finally {
        this.loading = false
      }
    },
    
    // 用户登录
    async login(credentials) {
      try {
        this.loading = true
        const response = await userApi.login(credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', 'true')
        
        // 加载用户资料
        await this.loadUserProfile()
        
        return { success: true }
      } catch (error) {
        console.error('登录失败:', error)
        return { success: false, error: error.response?.data }
      } finally {
        this.loading = false
      }
    },
    
    // 用户登出
    async logout() {
      try {
        if (this.token) {
          await userApi.logout()
        }
      } catch (error) {
        console.error('登出请求失败:', error)
      } finally {
        this.token = ''
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('isLoggedIn')
      }
    },
    
    // 加载用户资料
    async loadUserProfile() {
      try {
        const response = await userApi.getProfile()
        const userData = response.data
        
        this.user = userData
        this.profile = {
          username: userData.username,
          avatar: userData.profile?.avatar || 'https://picsum.photos/id/64/200/200',
          memberSince: userData.profile?.member_since || '2023-01-15',
          bio: userData.profile?.bio || '',
          gender: userData.profile?.gender || '',
          interests: userData.profile?.interests || []
        }
        
        this.info = {
          isVip: userData.profile?.is_vip || false,
          vipExpireDate: userData.profile?.vip_expire_date || ''
        }
      } catch (error) {
        console.error('加载用户资料失败:', error)
      }
    },
    
    // 更新用户资料
    async updateProfile(profileData) {
      try {
        this.loading = true
        const response = await userApi.updateProfile(profileData)
        const userData = response.data
        
        this.user = userData
        this.profile = {
          username: userData.username,
          avatar: userData.profile?.avatar || this.profile.avatar,
          memberSince: userData.profile?.member_since || this.profile.memberSince,
          bio: userData.profile?.bio || '',
          gender: userData.profile?.gender || '',
          interests: userData.profile?.interests || []
        }
        
        return { success: true }
      } catch (error) {
        console.error('更新资料失败:', error)
        return { success: false, error: error.response?.data }
      } finally {
        this.loading = false
      }
    }
  }
})
