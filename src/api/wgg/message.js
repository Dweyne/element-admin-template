import request from '@/utils/request'

// 查询留言列表
export function listMessage(data) {
  return request({
    url: '/customerMessage/getPageList',
    method: 'post',
    data
  })
}
// 查询留言详情
export function getMessage(id) {
  return request({
    url: '/customerMessage/info/' + id,
    method: 'get'
  })
}
// 操作
export function sure(data) {
  return request({
    url: '/customerMessage/sure/',
    method: 'post',
    data
  })
}

// 删除首页轮播图
export function deleteMessage(id) {
  return request({
    url: '/customerMessage/delete/' + id,
    method: 'post'
  })
}