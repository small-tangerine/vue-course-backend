import request from '@/utils/request'

// 查询权限下拉树结构
export function treeselect() {
  return request({
    url: '/role/menu-list',
    method: 'get'
  })
}
