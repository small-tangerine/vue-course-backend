import request from '@/utils/request'

// 用户密码重置
export function updateUserPassword(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/account/update-password',
    method: 'post',
    data: data
  })
}
