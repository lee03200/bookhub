import { defineStore } from 'pinia'
import { bookApi, bookshelfApi, commentApi, progressApi, userApi } from '@/api'

export const useBookStore = defineStore('books', {
  state: () => ({
    // 书籍列表
    recommended: [],
    popular: [],
    allBooks: [],
    
    // 我的书架
    myShelfBooks: [],

    // 正在阅读
    currentlyReading: [],

    // 阅读统计
    readingStats: {
      total: 0,
      thisMonth: 0,
      avgRating: 0
    },

    // 我的评论
    myComments: [],
    
    // 加载状态
    loading: false
  }),
  
  actions: {
    // 获取推荐书籍
    async fetchRecommended() {
      try {
        this.loading = true
        const response = await bookApi.fetchRecommended()
        this.recommended = response.data
      } catch (error) {
        console.error('获取推荐书籍失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取热门书籍
    async fetchPopular() {
      try {
        this.loading = true
        const response = await bookApi.fetchPopular()
        this.popular = response.data
      } catch (error) {
        console.error('获取热门书籍失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有书籍
    async fetchAllBooks(params = {}) {
      try {
        this.loading = true
        const response = await bookApi.fetchBooks(params)
        this.allBooks = response.data.results || response.data
        return response.data
      } catch (error) {
        console.error('获取书籍列表失败:', error)
        return { results: [] }
      } finally {
        this.loading = false
      }
    },
    
    // 获取书籍详情
    async fetchBookDetail(bookId) {
      try {
        const response = await bookApi.fetchBookDetail(bookId)
        return response.data
      } catch (error) {
        console.error('获取书籍详情失败:', error)
        return null
      }
    },
    
    // 搜索书籍
    async searchBooks(keyword) {
      try {
        this.loading = true
        const response = await bookApi.searchBooks(keyword)
        return response.data.results || response.data
      } catch (error) {
        console.error('搜索书籍失败:', error)
        return []
      } finally {
        this.loading = false
      }
    },
    
    // 获取我的书架
    async fetchMyShelf() {
      try {
        const response = await bookshelfApi.getBookshelf()
        this.myShelfBooks = response.data.map(item => item.book)
      } catch (error) {
        console.error('获取书架失败:', error)
      }
    },
    
    // 添加/移除收藏
    async toggleFavorite(book) {
      try {
        const isInShelf = this.myShelfBooks.some(b => b.id === book.id)
        
        if (isInShelf) {
          // 移除收藏
          await bookshelfApi.removeBook(book.id)
          this.myShelfBooks = this.myShelfBooks.filter(b => b.id !== book.id)
        } else {
          // 添加收藏
          await bookshelfApi.addBook(book.id)
          this.myShelfBooks.push(book)
        }
        
        return { success: true, isInShelf: !isInShelf }
      } catch (error) {
        console.error('操作书架失败:', error)
        return { success: false, error: error.response?.data }
      }
    },
    
    // 获取阅读进度
    async fetchReadingProgress() {
      try {
        const response = await progressApi.getProgress()
        this.currentlyReading = response.data.map(item => ({
          id: item.book.id,
          title: item.book.title,
          cover: item.book.cover,
          progress: item.progress,
          isPremium: item.book.is_premium
        }))
      } catch (error) {
        console.error('获取阅读进度失败:', error)
      }
    },
    
    // 更新阅读进度
    async updateReadingProgress(bookId, progress) {
      try {
        await progressApi.updateProgress(bookId, progress)
        const book = this.currentlyReading.find(b => b.id === bookId)
        if (book) {
          book.progress = progress
        }
        return { success: true }
      } catch (error) {
        console.error('更新阅读进度失败:', error)
        return { success: false }
      }
    },
    
    // 获取我的评论
    async fetchMyComments() {
      try {
        const response = await userApi.getMyComments()
        // 转换为 profile.vue 期望的格式
        this.myComments = response.data.map(comment => ({
          id: comment.id,
          bookId: comment.book?.id || comment.book,
          bookTitle: comment.book?.title || '未知书籍',
          bookCover: comment.book?.cover || 'https://picsum.photos/id/24/200/300',
          rating: comment.rating || 5,
          content: comment.content,
          date: comment.created_at || new Date().toISOString().split('T')[0]
        }))
      } catch (error) {
        console.error('获取评论失败:', error)
        this.myComments = []
      }
    }
  }
})
