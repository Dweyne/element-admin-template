import request from '@/utils/request'


// 查询常见问题列表
export function normalQuestionList(data) {
  return request({
    url: '/eduUsualQuestion/getPageList',
    method: 'post',
    data
  })
}

// 查询常见问题详情
export function normalQuestionInfo(id) {
  return request({
    url: '/eduUsualQuestion/info/' + id,
    method: 'get'
  })
}

// 新增常见问题
export function normalQuestionAdd(data) {
  return request({
    url: '/eduUsualQuestion/add',
    method: 'post',
    data
  })
}

// 修改常见问题
export function normalQuestionUpdate(data) {
  return request({
    url: '/eduUsualQuestion/update',
    method: 'post',
    data
  })
}


// 删除资源置顶套餐
export function normalQuestionDel(id) {
  return request({
    url: '/eduUsualQuestion/delete/' + id,
    method: 'post'
  })
}
