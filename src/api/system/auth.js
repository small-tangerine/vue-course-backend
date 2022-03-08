import request from '@/utils/request'
import user from "@/store/modules/user";

// 查询菜单列表
export function listAuth(query) {
  return request({
    url: '/system/auth',
    method: 'get',
    params: query
  })
}


// 新增菜单
export function addAuth(data) {
  return request({
    url: '/system/auth',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateAuth(data) {
  return request({
    url: '/system/auth',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delAuth(authId) {
  return request({
    url: '/system/auth',
    method: 'delete',
    params: {
      ids: authId + ''
    }
  })
}

// 修改菜单状态
export function changeAuthStatus(authId, status,authType) {
  const data = {
    authType: authType,
    id: authId,
    isEnabled: status
  }
  return request({
    url: '/system/auth/status',
    method: 'put',
    data: data
  })
}


// 导出菜单数据
export function exportAuth(query) {
  return request({
    url: '/system/auth/export',
    method: 'get',
    params: query
  })
}

export function changeEnabledStatus(id, status,user,desc) {
  const data = {
    id: id,
    userId: user,
    isPassed: status,
    reasonDesc: desc
  }
  return request({
    url: '/system/auth/status',
    method: 'put',
    data: data
  })
}
