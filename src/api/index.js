import axios from 'axios'  // 需先安装：npm install axios

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const instance = axios.create({
  baseURL: API_BASE,
  timeout: 5000
})

// 添加请求拦截器（处理 token 等）
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 书籍相关接口
export const bookApi = {
  fetchBooks: () => instance.get('/books'),
  fetchBookDetail: (id) => instance.get(`/books/${id}`),
  fetchCategoryBooks: (cat) => instance.get(`/categories/${cat}/books`)
}

// 用户相关接口
export const userApi = {
  login: (data) => instance.post('/login', data),
  getProfile: () => instance.get('/profile'),
  updateProfile: (data) => instance.put('/profile', data)
}
