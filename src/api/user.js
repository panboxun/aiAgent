import request from '@/utils/axios';

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  });
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}
