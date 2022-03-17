import request from '@/utils/request'

// 查询角色列表
export function listOrder(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getOrder(orderId) {
  return request({
    url: '/system/order/' + orderId,
    method: 'get'
  })
}

// 查询角色详细
export function getOrderOptions() {
  return request({
    url: '/user/order-select',
    method: 'get'
  })
}

// 新增角色
export function addOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'post',
    data: data
  })
}

// 角色数据权限
export function listDetail(id) {
  return request({
    url: '/order/detail-list',
    method: 'get',
    params:id
  })
}

// 角色显示菜单
export function menuScope(id, menus) {
  return request({
    url: '/system/order/menu-scope',
    method: 'post',
    data: {
      id: id,
      menuCollect: menus
    }
  })
}

// 角色状态修改
export function changeOrderStatus(orderId, status) {
  const data = {
    id: orderId,
    isEnabled: status
  }
  return request({
    url: '/system/order/status',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delOrder(orderId) {
  return request({
    url: '/order/delete',
    method: 'post',
    data: {
      resourceCollect: orderId
    }
  })
}

// 导出角色
export function exportOrder(query) {
  return request({
    url: '/system/order/export',
    method: 'get',
    params: query
  })
}
