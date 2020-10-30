import request from '@/utils/request'

// 查询首页轮播图列表
export function listBanner(data) {
  return request({
    url: '/wggBanner/getPageList',
    method: 'post',
    data
  })
}

// 查询首页轮播图详细
export function getBanner(id) {
  return request({
    url: '/wggBanner/info/' + id,
    method: 'get'
  })
}

// 新增首页轮播图
export function addBanner(data) {
  return request({
    url: '/wggBanner/add/',
    method: 'post',
    data
  })
}


// 删除首页轮播图
export function delBanner(id) {
  return request({
    url: '/wggBanner/delete/' + id,
    method: 'post'
  })
}
