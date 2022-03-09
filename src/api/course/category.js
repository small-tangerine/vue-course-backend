import request from '@/utils/request'

// 查询字典数据列表
export function listSQLDict(query) {
  return request({
    url: '/category/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(query) {
  return request({
    url: '/category/level-list',
    method: 'get',
    params: query
  })
}

// 根据字典类型查询字典数据信息
export function getDictDetail(tablle, field) {
  return request({
    url: '/system/sql-dict/' + tablle + '/' + field,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/category/create',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/category/delete',
    method: 'post',
    data: {
      ids: dictCode
    }
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/sql-dict/export',
    method: 'get',
    params: query
  })
}

// 字典状态修改
export function changeSQLDictStatus(id, status) {
  const data = {
    id: id,
    isEnabled: status
  }
  return request({
    url: '/system/sql-dict/status',
    method: 'put',
    data: data
  })
}

// 新增字典详情数据
export function addDataDetail(data) {
  return request({
    url: '/category/create',
    method: 'post',
    data: data
  })
}

// 修改字典详情数据
export function updateDataDetail(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data: data
  })
}
