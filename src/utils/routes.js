let route = []
export default  route = [{
  "name": "系统管理",
  "path": "/system",
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "系统管理",
    "icon": "system"
  },
  "children": [{
    "name": "管理员列表",
    "path": "system/user",
    "component": "system/user/index",
    "meta": {
      "title": "管理员列表",
      "icon": "swagger"
    }
  },{
    "name": "角色列表",
    "path": "system/role",
    "component": "system/role/index",
    "meta": {
      "title": "角色列表",
      "icon": "swagger"
    }
  }]
}, 
// {
//   "name": "套餐管理",
//   "path": "/member_price",
//   "redirect": "noRedirect",
//   "component": "Layout",
//   "alwaysShow": true,
//   "meta": {
//     "title": "套餐管理",
//     "icon": "tab"
//   },
//   "children": [{
//     "name": "悬赏置顶套餐列表",
//     "path": "member_price/rewardTop",
//     "component": "member_price/rewardTop",
//     "meta": {
//       "title": "悬赏置顶套餐列表",
//       "icon": "swagger"
//     }
//   }, {
//     "name": "资源置顶套餐列表",
//     "path": "member_price/resourceTop",
//     "component": "member_price/resourceTop",
//     "meta": {
//       "title": "资源置顶套餐列表",
//       "icon": "swagger"
//     }
//   }]
// }, 
{
  "name": "考试管理\r",
  "path": "/examination",
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "考试管理\r",
    "icon": "tab"
  },
  "children": [{
    "name": "模考大赛",
    "path": "examination_list",
    "component": "examination/mockText",
    "meta": {
      "title": "模考大赛",
      "icon": "swagger"
    }
  }, {
    "name": "题目上传",
    "path": "examination_upSubject",
    "component": "examination/upSubject",
    "meta": {
      "title": "题目上传",
      "icon": "swagger"
    }
  }]
}, 
// {
//   "name": "elment文档",
//   "path": "https://element.eleme.cn",
//   "component": "Layout",
//   "meta": {
//     "title": "elment文档",
//     "icon": "guide"
//   }
// }, 
{
  "name": "消息通知",
  "path": "/notice",
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "消息通知",
    "icon": "tab"
  },
  "children": [{
    "name": "系统消息",
    "path": "notice/list",
    "component": "notice/noticeList",
    "meta": {
      "title": "系统消息",
      "icon": "swagger"
    }
  },{
    "name": "考试资讯",
    "path": "notice/examNotice",
    "component": "notice/examNotice",
    "meta": {
      "title": "考试资讯",
      "icon": "swagger"
    }
  }]
}, {
  "name": "会员管理",
  "path": "/member",
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "会员管理",
    "icon": "tab"
  },
  "children": [{
    "name": "会员配置",
    "path": "member_price/list",
    "component": "member_price/list/index",
    "meta": {
      "title": "会员配置",
      "icon": "swagger"
    }
  }, {
    "name": "会员列表",
    "path": "member_list",
    "component": "member/memberManagement",
    "meta": {
      "title": "会员列表",
      "icon": "swagger"
    }
  }]
}, {
  "name": "订单管理\r",
  "path": "/order",
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "订单管理\r",
    "icon": "tab"
  },
  "children": [{
    "name": "订单列表",
    "path": "order_list",
    "component": "order/orderList",
    "meta": {
      "title": "订单列表",
      "icon": "swagger"
    }
  }]
}, 
// {
//   "name": "异常提醒",
//   "path": "/abnormal",
//   "redirect": "noRedirect",
//   "component": "Layout",
//   "alwaysShow": true,
//   "meta": {
//     "title": "异常提醒",
//     "icon": "tab"
//   },
//   "children": [{
//     "name": "题目异常",
//     "path": "abnormal/subjectAbnormal",
//     "component": "abnormal/subjectAbnormal",
//     "meta": {
//       "title": "题目异常",
//       "icon": "swagger"
//     }
//   }, {
//     "name": "评论异常",
//     "path": "abnormal/commentAbnormal",
//     "component": "abnormal/commentAbnormal",
//     "meta": {
//       "title": "评论异常",
//       "icon": "swagger"
//     }
//   }, {
//     "name": "交易异常",
//     "path": "abnormal/orderAbnormal",
//     "component": "abnormal/orderAbnormal",
//     "meta": {
//       "title": "交易异常",
//       "icon": "swagger"
//     }
//   }, {
//     "name": "用户反馈",
//     "path": "abnormal/feedbackAbnormal",
//     "component": "abnormal/feedbackAbnormal",
//     "meta": {
//       "title": "用户反馈",
//       "icon": "swagger"
//     }
//   }]
// }, 
// {
//   "name": "banner管理",
//   "path": "/banner",
//   "redirect": "noRedirect",
//   "component": "Layout",
//   "alwaysShow": true,
//   "meta": {
//     "title": "banner管理",
//     "icon": "theme"
//   },
//   "children": [{
//     "name": "banner列表",
//     "path": "banner_list",
//     "component": "banner/banner_list/index",
//     "meta": {
//       "title": "banner列表",
//       "icon": "swagger"
//     }
//   }]
// }, 
{
  "name": "平台用户",
  "path": "/platformUsers",
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "平台用户",
    "icon": "user"
  },
  "children": [{
    "name": "用户列表",
    "path": "platformUsers_list",
    "component": "platformUsers/userManagement",
    "meta": {
      "title": "用户列表",
      "icon": "swagger"
    }
  }]
}, 
// {
//   "name": "提现管理",
//   "path": "/tixian",
//   "redirect": "noRedirect",
//   "component": "Layout",
//   "alwaysShow": true,
//   "meta": {
//     "title": "提现管理",
//     "icon": "money"
//   },
//   "children": [{
//     "name": "账户提现 ",
//     "path": "platformUsers_drawal",
//     "component": "platformUsers/withdrawal",
//     "meta": {
//       "title": "账户提现 ",
//       "icon": "swagger"
//     }
//   }]
// }
]
