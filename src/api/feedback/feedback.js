import request from '@/utils/request'

// 获取反馈分页列表
export function getFeedbackList(data) {
  return request({
    url: '/eduOpinion/getPageList',
    method: 'post',
    data
  })
}



// 获取反馈详情
export function getFeedbackDetail(id) {
  return request({
    url: '/eduOpinion/info/'+id,
    method: 'get'
  })
}


// 删除反馈详情
export function feedbackDel(id) {
  return request({
    url: '/eduOpinion/delete/'+id,
    method: 'post'
  })
}
