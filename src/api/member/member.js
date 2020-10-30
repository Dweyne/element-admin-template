import request from '@/utils/request'

// 获取会员列表
export function getMemberList(data) {
  return request({
    url: '/api/admin/member/user_list',
    method: 'post',
    data
  })
}
//获取会员详情
export function getMemberDetail(id) {
  return request({
    url: '/api/admin/member/user_info/' + id,
    method: 'get'
  })
}

export function exportMember(data) {
  return request({
    url: '/api/admin/member/export/user_list',
    method: 'get',
    params: data
  })
}
