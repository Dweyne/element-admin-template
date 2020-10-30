import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import staticRoutes from '@/utils/routes';

import Layout from '@/layout/index'
// import { delete } from 'vue/types/umd'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
let permissions = []
// store.dispatch('GenerateRoutes', staticRoutes).then(accessRoutes => {
//   // store.commit('SET_ROLES', ['admin'])
//   router.addRoutes(accessRoutes) // 动态添加可访问路由表
// })

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      /*
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
          // 测试 默认静态页面
          // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        // 可删 ↑
      }
      */
     
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          let roles = res.data.permissionWithChildren
          roles = filterMeta(roles, 0)
          store.dispatch('GenerateRoutes', roles).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            // router.options.routes = [...router.options.routes, ...accessRoutes]
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            store.commit('SET_PERMISSIONS', permissions)
            
            // console.log(store.getters.permissions)
            // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            setTimeout(() => {
              next({...to})
            }, 200)
          })
        })
      } else {
        next()
      }
     next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

// function redirectUrl(path, tree){
//   for (let i = 0; i < tree.length; i++) {
//     const item = tree[i];
//     if(item.path == path)
//   }
// }

function filterMeta(tree, level){
  level++
  let currentTree = []
  currentTree = tree.map(item => {
    // console.log(item.meta)
    item.meta = JSON.parse(item.meta)
    if(level == 2){
      delete item['redirect']
      delete item['alwaysShow']
    }
    if(item.children){
      item.children = filterMeta(item.children, level)
    }
    if(level >= 2 ){
      delete item['children']
    }
    if(!item.url.path){
      permissions.push(item)
    }
    return item
  }).filter(item => item.name != '首页');
  return currentTree
}

router.afterEach(() => {
  NProgress.done()
})
