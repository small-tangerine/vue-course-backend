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

export function updateBaseInfo(data) {
  return request({
    url: '/user-info/update-base-info',
    method: 'post',
    data
  })
}
export function updateTeacherInfo(data) {
  return request({
    url: '/user-info/update-teacher-info',
    method: 'post',
    data
  })
}
export function updatePhone(data) {
  return request({
    url: '/user-info/update-phone',
    method: 'post',
    data
  })
}
export function updateEmail(data) {
  return request({
    url: '/user-info/update-email',
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

export function uploadAvatar(data)
{
  return request({
    url: '/avatar/upload',
    method: 'post',
    data
  })
}
export function uploadUserAvatar(data)
{
  return request({
    url: '/avatar/user-upload',
    method: 'post',
    data
  })
}
