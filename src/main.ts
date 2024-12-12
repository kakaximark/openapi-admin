// import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 异步初始化认证状态
const init = () => {
  const authStore = useAuthStore()
  authStore.initialize()
  app.mount('#app')
}

init()
