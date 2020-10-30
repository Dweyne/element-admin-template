import request from '@/utils/request'


// 查询悬赏列表
export function rewardList(data) {
  return request({
    url: '/eduOfferAReward/getPageList',
    method: 'post',
    data
  })
}

// 查询悬赏详情
export function rewardInfo(id) {
  return request({
    url: '/eduOfferAReward/info/' + id,
    method: 'get'
  })
}

// 删除悬赏
export function rewardDel(id) {
  return request({
    url: '/eduOfferAReward/delete/' + id,
    method: 'post'
  })
}
