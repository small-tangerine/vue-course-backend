import request from '@/utils/request'

// 校验手机号
export function uploadFile(formData) {
  return request({
    url: '/file/image-upload',
    method: 'post',
    data:formData
  })
}

export function uploadMergeFile(formData) {
  return request({
    url: '/upload/merge',
    method: 'post',
    data:formData
  })
}

