import request from '@/utils/request'

// 用户密码重置
export function updateUserPassword(data) {
  return request({
    url: '/user-info/update-password',
    method: 'post',
    data: data
  })
}
