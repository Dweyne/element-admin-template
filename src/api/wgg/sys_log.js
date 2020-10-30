import request from '@/utils/request'

// 查询系统操作日志
export function listSysLog(data) {
  return request({
    url: '/api/admin/record/list',
    method: 'post',
    data
  })
}


// 查询系统操作日志
export function getAnalyze() {
  return request({
    url: '/accessLog/getAnalyze',
    method: 'post'
  })
}