import request from '@/utils/request'

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/chat/getChatList',
    method: 'post',
    data
  })
}

// 获取用户消息列表
export function getNewsList(data) {
  return request({
    url: '/chat/getChatListByHead',
    method: 'post',
    data
  })
}

// 获取头像
export function getHead(data) {
  return request({
    url: '/chat/getChatHead',
    method: 'post',
    data
  })
}

// 给单或多个用户发送消息
export function sendMoreMessage(data) {
  return request({
    url: '/chat/systemToUser',
    method: 'post',
    data
  })
}

// 给所有用户发送消息
export function sendAllMessage(data) {
  return request({
    url: '/chat/systemToAllUser',
    method: 'post',
    data
  })
}
