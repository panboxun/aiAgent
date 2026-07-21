import { createVNode, render, ref } from 'vue'
import Loading from './globalLoading.vue'
import { useLoading } from '@/stores/useLoading'



// 全局响应式状态
const loadingState = ref({
  text: '加载中...'
})

let vnode = null
const createLoading = () => {
 
  vnode = createVNode(Loading, loadingState.value)
  render(vnode, document.body)
}

// 核心loading方法，单独导出给axios使用
export const $loading = {
  show(text = '加载中...') {
    const loadingStore = useLoading()
    loadingState.value.text = text
    loadingStore.globalLoading = true
    if (!vnode) createLoading()
  },
  close() {
    const loadingStore = useLoading()
    // 无法关闭loading，因为vnode为空，无法渲染loading
    loadingStore.globalLoading = false
  }
}

// Vue插件install
export default {
  install(app) {
    app.config.globalProperties.$loading = $loading
    app.provide('loading', $loading)
  }
}