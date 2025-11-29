import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 新增：引入path模块（Node.js内置，无需额外安装）
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bookhub/',
  plugins: [
    vue(),
  ],
  // 新增：配置@别名映射到src目录
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
