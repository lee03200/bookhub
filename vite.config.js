import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/bookhub/', // 👈 关键！必须和你的部署路径一致
  plugins: [
    vue(),
    // 如果用 @tailwindcss/vite，也加上
    // tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
