import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 1. 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 接口基础地址（vite环境）
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 2. 请求拦截器
service.interceptors.request.use(
  //判断开发环境还是生产环境
  // 开发环境：/api
  // 生产环境：/ai-agent-psi-lake.vercel.app/api

  config => {
    // 自动携带 token（从本地存储获取）
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    https://ai-agent-5cb9i74id-httpssearchbilibilicomallkeyworde5898.vercel.app/api/user/login
    // 生产环境：/ai-agent-psi-lake.vercel.app/api
    if (import.meta.env.VITE_API_URL == '/api') {
      config.url =replace(/^\/ai-agent-5cb9i74id-httpssearchbilibilicomallkeyworde5898.vercel.app/, '');
    }
    return config;
  },
  error => {
    console.error('请求错误：', error);
    return Promise.reject(error);
  }
);

// 3. 响应拦截器
service.interceptors.response.use(
  response => {
    // 直接返回后端数据（根据你的接口结构调整）
    const res = response.data;
    // 后端自定义成功码（例如 200 / 0 / 'success'）
    if (res.code == 200) {
      return res;
    }else{
      ElMessage.error(res.msg || '请求失败');
    }
    
    
  },
  error => {
    console.error('响应异常：', error);
    let errMsg = '网络异常，请稍后重试';
    ElMessage.error(errMsg);
    // HTTP 状态码处理
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          errMsg = '请求参数错误';
          break;
        case 401:
          errMsg = '登录已过期，请重新登录';
          // 清除 token + 跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          router.push('/login');
          break;
        case 403:
          errMsg = '没有权限访问';
          break;
        case 404:
          errMsg = '接口不存在';
          break;
        case 500:
          errMsg = '服务器异常';
          break;
      }
    }

    return Promise.reject(errMsg);
  }
);

// 4. 导出封装好的实例
export default service;
