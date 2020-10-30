import request from '@/utils/request'

// 查询圈子列表
export function abnormalList(data) {
  return request({
    url: '/eduReport/getPageList',
    method: 'post',
    data
  })
}

// 查询圈子详情
export function abnormalInfo(id) {
  return request({
    url: '/eduReport/info/' + id,
    method: 'get'
  })
}



// 删除圈子
export function abnormalDel(id) {
  return request({
    url: '/eduReport/delete/' + id,
    method: 'post'
  })
}
