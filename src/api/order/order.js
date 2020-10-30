import request from '@/utils/request'

// 获取订单列表
export function getOrderList(data) {
  return request({
    url: '/api/admin/order/list',
    method: 'post',
    data
  })
}
//获取订单详情
export function getOrderDetail(id) {
  return request({
    url: '/api/admin/order/list/' + id,
    method: 'get'
  })
}
//删除订单
export function delOrder(id) {
  return request({
    url: '/eduOrder/delete/' + id,
    method: 'post'
  })
}

//修改订单
export function updateOrder(data) {
  return request({
    url: '/eduNotice/update',
    method: 'post',
    data
  })
}

//同意售后
export function agreeRefund(data) {
  return request({
    url: '/eduOrder/agreeRefund',
    method: 'post',
    data
  })
}

//拒绝售后
export function refusedRefund(data) {
  return request({
    url: '/eduOrder/refusedRefund',
    method: 'post',
    data
  })
}