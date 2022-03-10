import request from '@/utils/request'

// 校验手机号
export function getInfoIndex() {
  return request({
    url: '/system/portal/index/info',
    method: 'get'
  })
}
