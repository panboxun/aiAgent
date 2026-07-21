import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from "./router"
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
import GlobalLoading from '@/plugins/globalLoading/globalLoading.js'
// 全局注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 自定义指令：懒加载图片
app.directive('lazy', {
  mounted(el) {
    // 使用IntersectionObserver API 实现懒加载图片
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 图片进入视口，加载图片
          el.src = el.dataset.src
          // 图片加载完成后，移除 IntersectionObserver 监听
          observer.disconnect()
        }
      })
    })
  }
})

app.provide("appName","AI助手" )

app.use(router)
app.use(ElementPlus)
app.use(GlobalLoading)
app.mount('#app')