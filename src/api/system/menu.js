import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/tree',
    method: 'get'
  })
}


// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu',
    method: 'delete',
    params: {
      ids: menuId + ''
    }
  })
}

// 修改菜单状态
export function changeMenuStatus(menuId, status,menuType) {
  const data = {
    menuType: menuType,
    id: menuId,
    isEnabled: status
  }
  return request({
    url: '/system/menu/status',
    method: 'put',
    data: data
  })
}

// 修改菜单状态
export function changeMenuHiddenStatus(menuId, status,menuType) {
  const data = {
    menuType: menuType,
    id: menuId,
    isHidden: status
  }
  return request({
    url: '/system/menu/hidden-status',
    method: 'put',
    data: data
  })
}

// 导出菜单数据
export function exportMenu(query) {
  return request({
    url: '/system/menu/export',
    method: 'get',
    params: query
  })
}
