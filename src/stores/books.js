import { defineStore } from 'pinia'

export const useBookStore = defineStore('books', {
  state: () => ({
    allBooks: [],       // 所有书籍
    recommended: [],    // 为你推荐
    popular: [],        // 热门书籍
    allBooks: [
      {
        id: 31,
        title: '思考，快与慢',
        author: '丹尼尔·卡尼曼',
        rating: 4.7,
        reviews: 5678,
        genre: '心理学',
        heat: 9800,
        cover: 'https://dh.woshipm.com/wp-content/uploads/2022/01/1900338879_ii_cover.jpeg'
      },
      {
        id: 32,
        title: 'Python编程：从入门到实践',
        author: '埃里克·马瑟斯',
        rating: 4.8,
        reviews: 4567,
        genre: '科技',
        heat: 8900,
        cover: 'https://booklibimg.kfzimg.com/data/book_lib_img_v2/isbn/0/cf65/cf658bc055dbdf070b4b6be038bba380_0_0_0_0_water.jpg'
      },
      {
        id: 33,
        title: '红楼梦',
        author: '曹雪芹',
        rating: 4.9,
        reviews: 12000,
        genre: '小说',
        heat: 9999,
        cover: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.P-X1Ubk9KAx2eNUPWL2TAwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
      }
    ],
    recommended: [
      {
        id: 31,
        title: '思考，快与慢',
        author: '丹尼尔·卡尼曼',
        rating: 4.7,
        reviews: 5678,
        genre: '心理学',
        cover: 'https://dh.woshipm.com/wp-content/uploads/2022/01/1900338879_ii_cover.jpeg'
      }
    ],
    popular: [
      {
        id: 33,
        title: '红楼梦',
        author: '曹雪芹',
        rating: 4.9,
        reviews: 12000,
        genre: '小说',
        heat: 9999,
        reading: 1245,
        cover: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.P-X1Ubk9KAx2eNUPWL2TAwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
      },
      {
        id: 32,
        title: 'Python编程：从入门到实践',
        author: '埃里克·马瑟斯',
        rating: 4.8,
        reviews: 4567,
        genre: '科技',
        heat: 8900,
        reading: 987,
        cover: 'https://booklibimg.kfzimg.com/data/book_lib_img_v2/isbn/0/cf65/cf658bc055dbdf070b4b6be038bba380_0_0_0_0_water.jpg'
      }
    ],

    // 原有字段保留
    myShelfBooks: [
      {
        id: 31,
        title: '思考，快与慢',
        author: '丹尼尔·卡尼曼',
        rating: 4.7,
        reviews: 5678,
        cover: 'https://dh.woshipm.com/wp-content/uploads/2022/01/1900338879_ii_cover.jpeg'
      },
      {
        id: 32,
        title: 'Python编程：从入门到实践',
        author: '埃里克·马瑟斯',
        rating: 4.8,
        reviews: 4567,
        cover: 'https://booklibimg.kfzimg.com/data/book_lib_img_v2/isbn/0/cf65/cf658bc055dbdf070b4b6be038bba380_0_0_0_0_water.jpg'
      }
    ],
    currentlyReading: [
      {
        id: 31,
        title: '思考，快与慢',
        progress: 35,
        cover: 'https://dh.woshipm.com/wp-content/uploads/2022/01/1900338879_ii_cover.jpeg',
        isPremium: false
      },
      {
        id: 32,
        title: 'Python编程：从入门到实践',
        progress: 67,
        cover: 'https://booklibimg.kfzimg.com/data/book_lib_img_v2/isbn/0/cf65/cf658bc055dbdf070b4b6be038bba380_0_0_0_0_water.jpg',
        isPremium: true
      },
      {
        id: 33,
        title: '红楼梦',
        progress: 12,
        cover: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.P-X1Ubk9KAx2eNUPWL2TAwHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
        isPremium: false
      }
    ],
    readingStats: {
      total: 24,
      thisMonth: 3,
      avgRating: 4.5
    }
  }),
  actions: {
    toggleFavorite(book) {
      const index = this.myShelfBooks.findIndex(b => b.id === book.id)
      if (index > -1) {
        this.myShelfBooks.splice(index, 1)
      } else {
        this.myShelfBooks.push(book)
      }
    },
    updateReadingProgress(bookId, progress) {
      const book = this.currentlyReading.find(b => b.id === bookId)
      if (book) book.progress = progress
    },

    // 可选：未来可扩展加载方法
    async loadAllBooks() {
      // 模拟 API 调用
      return this.allBooks
    },
    async loadRecommended() {
      return this.recommended
    },
    async loadPopular() {
      return this.popular
    }
  }
})
