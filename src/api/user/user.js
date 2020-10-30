import request from '@/utils/request'

// 获取用户分页列表
export function getUserList(data) {
  return request({
    url: '/api/admin/user/list',
    method: 'post',
    data
  })
}

// 获取用户全部列表
export function getUserAllList() {
  return request({
    url: '/admin/user/list',
    method: 'get'
  })
}

// 获取用户详情
export function getUserDetail(id) {
  return request({
    url: '/api/admin/user/list/'+id,
    method: 'get'
  })
}


// 获取提现分页列表
export function getWithdraList(data) {
  return request({
    url: '/eduCashOut/getPageList',
    method: 'post',
    data
  })
}

// 获取用户详情
export function getWithdraDetail(id) {
  return request({
    url: '/eduCashOut/info/'+id,
    method: 'get'
  })
}


// 确认提现
export function WithdraNow(data) {
  return request({
    url: '/eduCashOut/sure',
    method: 'post',
    data
  })
}