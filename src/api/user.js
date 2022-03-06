import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/account/login',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/account/reset-password',
    method: 'post',
    data
  })
}

// 用户登录信息
export function getInfo() {
  return request({
    url: '/account/info',
    method: 'get'
  })
}

export function getRouters() {
  return request({
    url: '/account/permission-routers',
    method: 'get'
  })
}
export function logout() {
  return request({
    url: '/account/logout',
    method: 'post'
  })
}
