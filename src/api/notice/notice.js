import request from '@/utils/request'

// 获取消息列表
export function getNoticeList(data) {
  return request({
    url: '/api/admin/message/system_message_list',
    method: 'post',
    data
  })
}
// 获取考试资讯列表
export function getExamNoticeList(data) {
  return request({
    url: '/api/admin/message/exam_message_list',
    method: 'post',
    data
  })
}
//获取公告详情
export function getNoticeDetail(id) {
  return request({
    url: '/api/admin/message/message_info/' + id,
    method: 'get'
  })
}
//删除公告
export function delNotice(id) {
  return request({
    url: '/api/admin/message/delete/' + id,
    method: 'get'
  })
}

//新增公告
export function addNotice(data) {
  return request({
    url: '/api/admin/message/create',
    method: 'post',
    data
  })
}
//修改公告
export function updateNotice(data) {
  return request({
    url: '/api/admin/message/update',
    method: 'post',
    data
  })
}
//获取所有省的信息 输入省份id获取省份对应城市列表
export function getProvince(data) {
  return request({
    url: '/wx/notice/getChinaCity',
    method: 'post',
    data
  })
}

//获取一级类型
export function getType() {
  return request({
    url: '/eduNotice/queryCourse',
    method: 'post'
  })
}


//发布消息
export function getRelease(id) {
  return request({
    url: '/api/admin/message/release/'+id,
    method: 'get'
  })
}
//撤回消息
export function getWithdraw(id) {
  return request({
    url: '/api/admin/message/back/'+id,
    method: 'get'
  })
}