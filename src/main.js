import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

// 引入全局样式
import './assets/styles/reset.css'
import './assets/styles/variables.css'
import './assets/styles/fonts.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
