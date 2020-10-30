import request from '@/utils/request'


// 查询悬赏置顶套餐列表
export function couponList(data) {
  return request({
    url: '/eduCoupon/getPageList',
    method: 'post',
    data
  })
}

// 查询资源置顶套餐详情
export function couponInfo(id) {
  return request({
    url: '/eduCoupon/info/' + id,
    method: 'get'
  })
}

// 新增资源置顶套餐
export function couponAdd(data) {
  return request({
    url: '/eduCoupon/add',
    method: 'post',
    data
  })
}

// 修改资源置顶套餐
export function couponUpdate(data) {
  return request({
    url: '/eduCoupon/update',
    method: 'post',
    data
  })
}


// 删除资源置顶套餐
export function couponDel(id) {
  return request({
    url: '/eduCoupon/delete/' + id,
    method: 'post'
  })
}
