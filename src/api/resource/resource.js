import request from '@/utils/request'


// 查询悬赏列表
export function resourceList(data) {
  return request({
    url: '/eduResources/getPageList',
    method: 'post',
    data
  })
}

// 查询悬赏详情
export function resourceInfo(id) {
  return request({
    url: '/eduResources/info/' + id,
    method: 'get'
  })
}

// 删除悬赏
export function resourceDel(id) {
  return request({
    url: '/eduResources/delete/' + id,
    method: 'post'
  })
}
