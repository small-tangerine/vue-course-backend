import request from '@/utils/request'

// 查询课程列表
export function listCourseVideo(query) {
  return request({
    url: '/course-video/list',
    method: 'get',
    params: query
  })
}

export function listStudentList(params) {
  return request({
    url: '/course-video/student-list',
    method: 'get',
    params
  })
}

// 查询课程详细
export function getCourseVideoOptions() {
  return request({
    url: '/user/course-video-select',
    method: 'get'
  })
}

// 新增课程
export function addCourseVideo(data) {
  return request({
    url: '/course-video/create',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateCourseVideo(data) {
  return request({
    url: '/course-video/update',
    method: 'post',
    data: data
  })
}

// 课程数据权限
export function listDetail(id) {
  return request({
    url: '/course-video/detail-list',
    method: 'get',
    params:id
  })
}

// 课程数据权限
export function courseDetail(id) {
  return request({
    url: '/course-video/detail',
    method: 'get',
    params:id
  })
}

export function courseView(id) {
  return request({
    url: '/course-video/view',
    method: 'get',
    params:id
  })
}


// 课程显示菜单
export function courseVideoAudit(data) {
  return request({
    url: '/course-video/audit',
    method: 'post',
    data: data
  })
}

// 课程状态修改
export function changeCourseVideoStatus(courseId, status) {
  const data = {
    id: courseId,
    isEnabled: status
  }
  return request({
    url: '/course-video/status',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delCourseVideo(courseId) {
  return request({
    url: '/course-video/delete',
    method: 'post',
    data: {
      id:courseId
    }
  })
}

// 导出课程
export function fileCourseVideo(query) {
  return request({
    url: '/course-video/export',
    method: 'get',
    params: query
  })
}
