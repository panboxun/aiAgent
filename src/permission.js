import NProgress from 'nprogress' // progress bar
import router from './router'
import { ElMessage } from 'element-plus'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  
  // 判断是否有 token
  const hasToken = localStorage.getItem('token')
  
  if (hasToken) {
    if (to.path === '/login') {
      // 已登录则重定向到首页
      next({ path: '/index/dashboard' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单中，直接进入
      next()
    } else {
      // 否则全部重定向到登录页
      ElMessage.warning('请先登录')
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})