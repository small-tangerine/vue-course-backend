import request from '@/utils/request'

// 校验手机号
export function getInfoIndex() {
  return request({
    url: '/home/index',
    method: 'get'
  })
}
