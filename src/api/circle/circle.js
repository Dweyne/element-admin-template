import request from '@/utils/request'

// 查询圈子列表
export function circleList(data) {
  return request({
    url: '/eduCircle/getPageList',
    method: 'post',
    data
  })
}

// 查询圈子详情
export function circleInfo(id) {
  return request({
    url: '/eduCircle/info/' + id,
    method: 'get'
  })
}

// 新增圈子
export function circleAdd(data) {
  return request({
    url: '/eduCircle/add',
    method: 'post',
    data
  })
}

// 修改圈子
export function circleUpdate(data) {
  return request({
    url: '/eduCircle/update',
    method: 'post',
    data
  })
}

// 删除圈子
export function circleDel(id) {
  return request({
    url: '/eduCircle/delete/' + id,
    method: 'post'
  })
}
