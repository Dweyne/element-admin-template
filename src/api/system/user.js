import request from '@/utils/request'

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/api/admin/admin_list',
    method: 'post',
    data
  })
}
// 获取当前登陆的用户信息
export function getUserInfo() {
  return request({
    url: '/sysUser/getSysUserInfo',
    method: 'get'
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/api/admin/admin_info/' + userId,
    method: 'get'
  })
}

// 新增管理员
export function addUser(data) {
  return request({
    url: '/api/admin/create',
    method: 'post',
    data: data
  })
}

export function changeUserStatus(userId){
  return request({
    url: '/api/admin/update_status/' + userId,
    method: 'get'
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/api/admin/update_admin',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/api/admin/delete_admin/' + userId,
    method: 'delete'
  })
}

// 重置密码
export function updatePassword(data) {
  return request({
    url: '/api/admin/update_admin',
    method: 'post',
    data: data
  })
}

// 修改密码
export function modifyPassword(data) {
  return request({
    url: '/api/admin/update_password',
    method: 'post',
    data
  })
}