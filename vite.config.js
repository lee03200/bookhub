import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 新增：引入path模块（Node.js内置，无需额外安装）
import tailwind from 'vite-plugin-tailwind'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bookhub/',
  plugins: [vue(),tailwind()],
  server: {
    port: 3000,
    open: true
  },
  // 新增：配置@别名映射到src目录
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // __dirname指向当前vite.config.js所在的项目根目录
    },
    // 可选：显式声明支持的扩展名，避免解析问题
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
