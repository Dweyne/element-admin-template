import request from '@/utils/request'

// 查询圈子列表
export function commentList(data) {
  return request({
    url: '/eduComment/getPageList',
    method: 'post',
    data
  })
}

// 查询圈子详情
export function commentInfo(id) {
  return request({
    url: '/eduComment/info/' + id,
    method: 'get'
  })
}



// 删除圈子
export function commentDel(id) {
  return request({
    url: '/eduComment/delete/' + id,
    method: 'post'
  })
}
