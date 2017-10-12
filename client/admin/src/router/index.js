import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'
// import mainPage from './children/mainPage.js'
import login from './children/login.js'
import adminPage from './children/adminPage.js'
import startLottery from '@/views/lotteryPage/'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    redirect: 'admin'
  }, {
    path: '/startLottery',
    name: 'startLottery',
    meta: {
      requireLogin: true
    },
    component: startLottery
  }, login, adminPage]
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin) {
    // 判断是否需要登录权限
    if (store.state.user || sessionStorage.getItem('user')) {
      next()
    } else {
      // 没登录则跳转到登录界面
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
