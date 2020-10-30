import request from '@/utils/request'

// 查询banner列表
export function listBanner(data) {
  return request({
    url: '/eduBanner/getPageList',
    method: 'post',
    data
  })
}

// 查询banner详情
export function infoBanner(id) {
  return request({
    url: '/eduBanner/info/' + id,
    method: 'get'
  })
}

// 新增banner
export function addBanner(data) {
  return request({
    url: '/eduBanner/add',
    method: 'post',
    data
  })
}

// 修改banner
export function updateBanner(data) {
  return request({
    url: '/eduBanner/update',
    method: 'post',
    data
  })
}


// 删除banner
export function deleteBanner(id) {
  return request({
    url: '/eduBanner/delete/' + id,
    method: 'post'
  })
}
