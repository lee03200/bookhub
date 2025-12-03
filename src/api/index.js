import axios from 'axios'

// API 基础地址 - 连接 Django 后端
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 Token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      // Django REST Framework 使用 Token 认证格式
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理响应
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      // 处理各种错误状态
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token
          localStorage.removeItem('token')
          localStorage.removeItem('isLoggedIn')
          window.location.href = '/'
          break
        case 403:
          console.error('没有权限访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
      }
    }
    return Promise.reject(error)
  }
)

// 书籍相关接口
export const bookApi = {
  // 获取书籍列表（支持筛选和搜索）
  fetchBooks: (params = {}) => instance.get('/books/', { params }),
  // 获取书籍详情
  fetchBookDetail: (id) => instance.get(`/books/${id}/`),
  // 获取推荐书籍
  fetchRecommended: () => instance.get('/books/recommended/'),
  // 获取热门书籍
  fetchPopular: () => instance.get('/books/popular/'),
  // 按分类获取书籍
  fetchByCategory: (category) => instance.get('/books/', { params: { category } }),
  // 搜索书籍
  searchBooks: (keyword) => instance.get('/books/', { params: { search: keyword } })
}

// 用户相关接口
export const userApi = {
  // 用户注册
  register: (data) => instance.post('/register', data),
  // 用户登录
  login: (data) => instance.post('/login', data),
  // 用户登出
  logout: () => instance.post('/logout'),
  // 获取用户信息
  getProfile: () => instance.get('/profile'),
  // 更新用户资料
  updateProfile: (data) => instance.put('/profile/update', data),
  // 获取用户统计
  getStats: () => instance.get('/user/stats'),
  // 获取我的书架
  getMyShelf: () => instance.get('/user/shelf'),
  // 获取我的阅读记录
  getMyReading: () => instance.get('/user/reading'),
  // 获取我的评论
  getMyComments: () => instance.get('/user/comments')
}

// 书架相关接口
export const bookshelfApi = {
  // 获取书架
  getBookshelf: () => instance.get('/bookshelf/'),
  // 添加到书架
  addBook: (bookId) => instance.post('/bookshelf/', { book_id: bookId }),
  // 从书架移除
  removeBook: (bookId) => instance.delete('/bookshelf/remove_book/', { data: { book_id: bookId } })
}

// 评论相关接口
export const commentApi = {
  // 获取书籍评论
  getComments: (bookId) => instance.get('/comments/', { params: { book_id: bookId } }),
  // 发表评论
  createComment: (data) => instance.post('/comments/', data),
  // 点赞评论
  likeComment: (commentId) => instance.post(`/comments/${commentId}/like/`),
  // 点踩评论
  dislikeComment: (commentId) => instance.post(`/comments/${commentId}/dislike/`)
}

// 阅读进度相关接口
export const progressApi = {
  // 获取阅读进度
  getProgress: () => instance.get('/reading-progress/'),
  // 更新阅读进度
  updateProgress: (bookId, progress) => instance.post('/reading-progress/', { 
    book_id: bookId, 
    progress 
  })
}

// 分类相关接口
export const categoryApi = {
  // 获取所有分类
  getCategories: () => instance.get('/categories/'),
  // 获取分类详情
  getCategoryDetail: (slug) => instance.get(`/categories/${slug}/`)
}

export default instance
