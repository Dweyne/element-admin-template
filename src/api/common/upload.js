import request from '@/utils/request'

// 图片上传到阿里云
export function uploadToOss(data) {
  return request({
    url: '/upload/uploadToOss',
    method: 'post',
    data
  })
}
