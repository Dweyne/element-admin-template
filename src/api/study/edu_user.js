import request from '@/utils/request'

// 查询用户列表
export function list(data) {
  return request({
    url: '/eduUser/getPageList',
    method: 'post',
    data
  })
}

// 查询用户详情
export function info(id) {
  return request({
    url: '/eduUser/info/' + id,
    method: 'get'
  })
}


// 修改用户
export function update(data) {
  return request({
    url: '/eduUser/update',
    method: 'post',
    data
  })
}


// 删除用户
export function del(id) {
  return request({
    url: '/eduUser/delete/' + id,
    method: 'post'
  })
}
