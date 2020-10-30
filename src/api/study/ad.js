import request from '@/utils/request'

// 查询自定义页面列表
export function listAd(data) {
  return request({
    url: '/eduEduAd/getPageList',
    method: 'post',
    data
  })
}

// 查询广告
export function infoAd(id) {
  return request({
    url: '/eduEduAd/info/' + id,
    method: 'get'
  })
}

// 新增广告
export function addAd(data) {
  return request({
    url: '/eduEduAd/add',
    method: 'post',
    data
  })
}

// 修改广告
export function updateAd(data) {
  return request({
    url: '/eduEduAd/update',
    method: 'post',
    data
  })
}


// 查询广告
export function deleteAd(id) {
  return request({
    url: '/eduEduAd/delete/' + id,
    method: 'post'
  })
}
