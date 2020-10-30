import request from '@/utils/request'

// 获取首页统计信息
export function getInfo() {
  return request({
    url: '/api/admin/index/count',
    method: 'get'
  })
}

export function getChartInfo(){
  return request({
    url: '/api/admin/index/week_count',
    method: 'get'
  })
}

export function uploadImage(data){
  return request({
    url: '/api/load/uploadToCos',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data
  })
}
