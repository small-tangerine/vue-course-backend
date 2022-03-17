import request from '@/utils/request'

// 查询课程列表
export function listCourse(query) {
  return request({
    url: '/course/list',
    method: 'get',
    params: query
  })
}

export function listStudentList(params) {
  return request({
    url: '/course/student-list',
    method: 'get',
    params
  })
}

// 查询课程详细
export function getCourseOptions() {
  return request({
    url: '/user/course-select',
    method: 'get'
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: '/course/create',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateCourse(data) {
  return request({
    url: '/course/update',
    method: 'post',
    data: data
  })
}

// 课程数据权限
export function listDetail(id) {
  return request({
    url: '/course/detail-list',
    method: 'get',
    params:id
  })
}

// 课程数据权限
export function courseDetail(id) {
  return request({
    url: '/course/detail',
    method: 'get',
    params:id
  })
}

export function courseView(id) {
  return request({
    url: '/course/view',
    method: 'get',
    params:id
  })
}


// 课程显示菜单
export function courseAudit(data) {
  return request({
    url: '/course/audit',
    method: 'post',
    data: data
  })
}

// 课程状态修改
export function changeCourseStatus(courseId, status) {
  const data = {
    id: courseId,
    isEnabled: status
  }
  return request({
    url: '/course/status',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delCourse(courseId) {
  return request({
    url: '/course/delete',
    method: 'post',
    data: {
      id:courseId
    }
  })
}

// 导出课程
export function fileCourse(query) {
  return request({
    url: '/course/export',
    method: 'get',
    params: query
  })
}
