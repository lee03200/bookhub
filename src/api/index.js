// 模拟 API 请求（实际项目替换为真实接口）
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchBooks() {
  // 模拟延迟
  await new Promise(r => setTimeout(r, 300))
  return [
    { id: 1, title: '《前端架构设计》', author: '张三' },
    { id: 2, title: '《Vue 3 实战》', author: '李四' }
  ]
}

export async function fetchUserProfile() {
  await new Promise(r => setTimeout(r, 200))
  return { username: 'book_lover', level: 5 }
}