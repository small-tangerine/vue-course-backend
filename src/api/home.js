import request from '@/utils/request'

// 校验手机号
export function getInfoIndex(type) {
  return request({
    url: '/home/index',
    method: 'get',
    params:{
      type:type
    }
  })
}
