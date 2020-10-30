import request from '@/utils/request'

// 查询会员套餐列表
export function list(data) {
  return request({
    url: '/api/admin/member/list',
    method: 'get',
    data
  })
}

// 查询会员套餐详情
export function info(id) {
  return request({
    url: '/eduMemberPrice/info/' + id,
    method: 'get'
  })
}

// 新增/修改会员套餐
export function add(data) {
  return request({
    url: '/api/admin/member/create_or_update',
    method: 'post',
    data
  })
}

// 修改会员套餐
export function update(data) {
  return request({
    url: '/api/admin/member/create_or_update',
    method: 'post',
    data
  })
}


// 删除会员套餐
export function del(id) {
  return request({
    url: '/api/admin/member/delete/' + id,
    method: 'get'
  })
}



// 查询资源置顶套餐列表
export function resourceTopList(data) {
  return request({
    url: '/eduTopSpec/getPageList',
    method: 'post',
    data
  })
}

// 查询资源置顶套餐详情
export function resourceTopInfo(id) {
  return request({
    url: '/eduTopSpec/info/' + id,
    method: 'get'
  })
}

// 新增资源置顶套餐
export function resourceTopAdd(data) {
  return request({
    url: '/eduTopSpec/add',
    method: 'post',
    data
  })
}

// 修改资源置顶套餐
export function resourceTopUpdate(data) {
  return request({
    url: '/eduTopSpec/update',
    method: 'post',
    data
  })
}


// 删除资源置顶套餐
export function resourceTopDel(id) {
  return request({
    url: '/eduTopSpec/delete/' + id,
    method: 'post'
  })
}



// 查询悬赏置顶套餐列表
export function rewardTopList(data) {
  return request({
    url: '/eduTopSpec/getPageList',
    method: 'post',
    data
  })
}

// 查询悬赏置顶套餐详情
export function rewardTopInfo(id) {
  return request({
    url: '/eduTopSpec/info/' + id,
    method: 'get'
  })
}

// 新增悬赏置顶套餐
export function rewardTopAdd(data) {
  return request({
    url: '/eduTopSpec/add',
    method: 'post',
    data
  })
}

// 修改悬赏源置顶套餐
export function rewardTopUpdate(data) {
  return request({
    url: '/eduTopSpec/update',
    method: 'post',
    data
  })
}


// 删除悬赏置顶套餐
export function rewardTopDel(id) {
  return request({
    url: '/eduTopSpec/delete/' + id,
    method: 'post'
  })
}
