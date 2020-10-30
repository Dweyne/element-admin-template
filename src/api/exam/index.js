                                                                                                                                                                                                                import request from '@/utils/request'

// 获取试卷列表
// export function getPapersList(data){
//   return request({
//     url:'/eduCourseSyllabus/getList',
//     method:'post',
//     data
//   })
// }

//模考相关接口

// 添加模考
export function addMock(data){
  return request({
    url:'/eduCoursePk/add',
    method:'post',
    data
  })
}

// 编辑模考
export function editMock(data){
  return request({
    url:'/eduCoursePk/update',
    method:'post',
    data
  })
}

// 删除模考
export function delMock(id){
  return request({
    url:'/eduCoursePk/delete/'+id,
    method:'post'
  })
}

// 获取模考列表
export function getMockList(data){
  return request({
    url:'/eduCoursePk/getPageList',
    method:'post',
    data
  })
}

//大题相关接口

// 获取题目列表
export function getQuestionList(data){
  return request({
    url:'/eduCourseExercise/getPageList',
    method:'post',
    data
  })
}
// 添加题目
export function addBigQuestion(data){
  return request({
    url:'/eduCourseExercise/add',
    method:'post',
    data
  })
}

// 修改题目
export function editBigQuestion(data){
  return request({
    url:'/eduCourseExercise/update',
    method:'post',
    data
  })
}

// 删除题目
export function delBigQuestion(id){
  return request({
    url:'/eduCourseExercise/delete/'+id,
    method:'post'
  })
}

//小题相关接口

//获取小题列表
export function getSmallQuestionList(data){
  return request({
    url:'/eduCourseExerciseQa/getPageList',
    method:'post',
    data
  })
}

//添加小题
export function addSmallQuestion(data){
  return request({
    url:'/eduCourseExerciseQa/add',
    method:'post',
    data
  })
}

// 修改小题
export function editSmallQuestion(data){
  return request({
    url:'/eduCourseExerciseQa/update',
    method:'post',
    data
  })
}

// 删除小题
export function delSmallQuestion(id){
  return request({
    url:'/eduCourseExerciseQa/delete/'+id,
    method:'post'
  })
}

// 选择题选项接口

// 获取选择题选项列表
export function getOptionList(data){
  return request({
    url:'/eduCourseExerciseOption/getPageList',
    method:'post',
    data
  })
}

// 添加选择题选项
export function addOption(data){
  return request({
    url:'/eduCourseExerciseOption/add',
    method:'post',
    data
  })
}

// 修改选择题选项
export function editOption(data){
  return request({
    url:'/eduCourseExerciseOption/update',
    method:'post',
    data
  })
}

// 删除选择题选项
export function delOption(id){
  return request({
    url:'/eduCourseExerciseOption/delete/'+id,
    method:'post'
  })
}
