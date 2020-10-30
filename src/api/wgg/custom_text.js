import request from '@/utils/request'

// 查询自定义页面列表
export function listCustom_text(data) {
  return request({
    url: '/customText/getPageList',
    method: 'post',
    data
  })
}

// 查询自定义页面详细
export function getCustom_text(id) {
  return request({
    url: '/customText/info/' + id,
    method: 'get'
  })
}

// 新增自定义页面
export function addCustom_text(data) {
  return request({
    url: '/customText/add',
    method: 'post',
    data
  })
}

// 修改自定义页面
export function updateCustom_text(data) {
  return request({
    url: '/customText/update',
    method: 'post',
    data
  })
}
// 修改自定义页面
export function getAll() {
  return request({
    url: '/customText/getAll',
    method: 'post'
  })
}