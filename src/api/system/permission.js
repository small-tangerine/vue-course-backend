import request from '@/utils/request'

// 查询权限列表
export function listPermission(query) {
  return request({
    url: '/system/permission',
    method: 'get',
    params: query
  })
}

// 查询权限详细
export function getPermission() {
  return request({
    url: '/system/permission',
    method: 'get'
  })
}

// 查询权限下拉树结构
export function treeselect() {
  return request({
    url: '/role/menu-list',
    method: 'get'
  })
}

// 新增权限
export function addPermission(data) {
  return request({
    url: '/system/permission',
    method: 'post',
    data: data
  })
}

// 修改权限
export function updatePermission(data) {
  return request({
    url: '/system/permission',
    method: 'put',
    data: data
  })
}

// 删除权限
export function delPermission(permissionId) {
  return request({
    url: '/system/permission',
    method: 'delete',
    params: {
      ids: permissionId + ''
    }
  })
}

// 修改权限状态
export function changePermissionStatus(permissionId, status) {
  const data = {
    id: permissionId,
    isEnabled: status
  }
  return request({
    url: '/system/permission/status',
    method: 'put',
    data: data
  })
}

// 修改权限状态
export function changePermission(permissionId, status) {
  const data = {
    id: permissionId,
    isPermission: status
  }
  return request({
    url: '/system/permission/auth-status',
    method: 'put',
    data: data
  })
}

// 导出权限数据
export function exportPermission(query) {
  return request({
    url: '/system/permission/export',
    method: 'get',
    params: query
  })
}
