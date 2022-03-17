import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/permission/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/permission/' + menuId,
    method: 'get'
  })
}


// 新增菜单
export function addMenu(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/permission/update',
    method: 'post',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/permission/delete',
    method: 'post',
    data: {
      ids: menuId
    }
  })
}

// 修改菜单状态
export function changeMenuHiddenStatus(menuId) {
  const data = {
    id: menuId
  }
  return request({
    url: '/permission/hidden-status',
    method: 'post',
    data: data
  })
}
