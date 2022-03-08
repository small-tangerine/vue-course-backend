import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/system/user/name',
    method: 'get',
    params: { username: name}
  })
}

export function searchListUser(ids) {
  return request({
    url: '/system/user/id',
    method: 'get',
    params: {ids: ids + ''}
  })
}

export function addNotice(query) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: query
  })
}

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/system/notice',
    method: 'get',
    params: query
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/system/notice',
    method: 'delete',
    params: {
      ids: noticeId + ''
    }
  })
}

// 导出公告
export function exportNotice(query) {
  return request({
    url: '/system/notice/export',
    method: 'get',
    params: query
  })
}

// 导出公告
export function fetchNotice(id) {
  return request({
    url: '/system/notice/' + id + '/detail',
    method: 'get'
  })
}

// 查询公告类别数据列表
export function listNoticeCategory(query) {
  return request({
    url: '/system/notice/category',
    method: 'get',
    params: query
  })
}

// 新增公告类别数据
export function addNoticeCategory(data) {
  return request({
    url: '/system/notice/category',
    method: 'post',
    data: data
  })
}

// 修改公告类别数据
export function updateNoticeCategory(data) {
  return request({
    url: '/system/notice/category',
    method: 'put',
    data: data
  })
}

// 删除公告类别数据
export function delNoticeCategory(dictCode) {
  return request({
    url: '/system/notice/category',
    method: 'delete',
    params: {
      ids: dictCode + ''
    }
  })
}

// 导出公告类别数据
export function exportNoticeCategory(query) {
  return request({
    url: '/system/notice/category/export',
    method: 'get',
    params: query
  })
}

// 公告类别状态修改
export function changeNoticeCategoryStatus(id, status) {
  const data = {
    id: id,
    isEnabled: status
  }
  return request({
    url: '/system/notice/category/status',
    method: 'put',
    data: data
  })
}

// 查询公告类别数据详细
export function getNoticeData(query) {
  return request({
    url: '/system/notice/category/notice-list',
    method: 'get',
    params: query
  })
}


export function categoryTree() {
  return request({
    url: '/system/notice/category/tree',
    method: 'get'
  })
}

export function noticeRevoke(id) {
  return request({
    url: '/system/notice/revoke/' + id,
    method: 'put'
  })
}

export function noticePublish(id) {
  return request({
    url: '/system/notice/publish/' + id,
    method: 'put'
  })
}

export function updateNotice(data, type) {
  return request({
    url: '/system/notice/update',
    method: 'put',
    params: {type: type},
    data: data
  })
}
