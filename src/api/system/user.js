import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function getUserRoleId(query) {
  return request({
    url: '/system/user/role',
    method: 'get',
    params: {id: query}
  })
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: '/system/user/' + id,
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}


// 新增用户
export function assignRole(data) {
  return request({
    url: '/user/assign-role',
    method: 'post',
    data: data
  })
}


export function getUserRoleInfo(id) {
  return request({
    url: '/system/user/info-role',
    method: 'get',
    params: {id: id}
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(id) {
  return request({
    url: '/user/delete',
    method: 'post',
    data:{
      ids:id
    }
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}


// 用户密码重置
export function resetUserPassword(ids, password) {
  const data = {
    ids,
    password
  }
  return request({
    url: '/system/user/reset-password',
    method: 'post',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(id, isEnabled) {
  const data = {
    id,
    isEnabled
  }
  return request({
    url: '/system/user/status',
    method: 'put',
    data: data
  })
}


// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}

// 下载用户导入模板
export function UserMenuList(roleId) {
  return request({
    url: '/system/role/menu-scope',
    method: 'get',
    params: {id: roleId}
  })
}

export function UserResourceList(roleId) {
  return request({
    url: '/system/role/resource-scope',
    method: 'get',
    params: {id: roleId}
  })
}


// 用户数据权限
export function dataScope(id, roleId, resources, name) {
  return request({
    url: '/system/user/resource-scope',
    method: 'post',
    params: {name: name},
    data: {
      userId: id,
      roleId: roleId,
      userRoleResourceCollect: resources
    }
  })
}

// 用户显示菜单
export function menuScope(id, roleId, menus, name) {
  return request({
    url: '/system/user/menu-scope',
    method: 'post',
    params: {name: name},
    data: {
      userId: id,
      roleId: roleId,
      userRoleMenuCollect: menus
    }
  })
}

export function getUserinfo(id) {
  return request({
    url: '/system/user/detail-info/' + id,
    method: 'get'
  })
}

export function getUserFollow(id, type) {
  return request({
    url: '/system/user/follow',
    method: 'get',
    params: {
      id: id,
      type: type
    }
  })
}

export function getUserFavor(id) {
  return request({
    url: '/system/user/favor',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function getUserFollowChange(userId,ids, type) {
  return request({
    url: '/system/user/follow/change',
    method: 'put',
    params: {
      type: type
    },
    data: {
      ids: ids,
      userId: userId
    }
  })
}

export function exportUserFollow(query) {
  return request({
    url: '/system/user/follow/export',
    method: 'get',
    params: query
  })
}

export function exportUserFavor(query) {
  return request({
    url: '/system/user/favor/export',
    method: 'get',
    params: query
  })
}

export function registerUser(data) {
  return request({
    url: '/system/portal/user/register',
    method: 'post',
    data
  })
}

export function getTeacherInfo(id){
  return request({
    url: '/user/teacher-info',
    method: 'get',
    params: {
      id:id
    }
  })
}
