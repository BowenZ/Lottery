import Vue from 'vue'
import Router from 'vue-router'

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
    component: startLottery
  }, login, adminPage]
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireLogin)) {
    // 判断是否需要登录权限
    if (window.localStorage.getItem('loginUserBaseInfo')) {
      // 判断是否登录
      let lifeTime =
        JSON.parse(window.localStorage.getItem('loginUserBaseInfo'))
        .lifeTime *
        1000
      let nowTime = (new Date())
        .getTime() // 当前时间的时间戳
      if (nowTime < lifeTime) {
        next()
      } else {
        // Message({
        //   showClose: true,
        //   message: '登录状态信息过期,请重新登录',
        //   type: 'error'
        // })
        next({
          path: '/login'
        })
      }
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
