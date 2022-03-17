import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

// 查询角色详细
export function getRoleOptions() {
  return request({
    url: '/user/role-select',
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data: data
  })
}

// 角色数据权限
export function dataScope(id, resources) {
  return request({
    url: '/role/permission-scope',
    method: 'post',
    data: {
      id: id,
      resourceCollect: resources
    }
  })
}

// 角色显示菜单
export function menuScope(id, menus) {
  return request({
    url: '/system/role/menu-scope',
    method: 'post',
    data: {
      id: id,
      menuCollect: menus
    }
  })
}


// 删除角色
export function delRole(roleId) {
  return request({
    url: '/role/delete',
    method: 'post',
    data: {
      resourceCollect: roleId
    }
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/system/role/export',
    method: 'get',
    params: query
  })
}
