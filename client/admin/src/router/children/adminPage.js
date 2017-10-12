import adminPage from '@/views/adminPage/'
import startLottery from '@/views/lotteryPage/'
import lotteryAdmin from '@/views/adminPage/children/lotteryAdmin'
import userAdmin from '@/views/adminPage/children/userAdmin'

export default {
  path: '/admin',
  name: 'admin',
  component: adminPage,
  redirect: {
  	name: 'lotteryAdmin'
  },
  children: [{
  	path: 'lotteryAdmin',
  	name: 'lotteryAdmin',
    meta: {
      requireLogin: true
    },
  	component: lotteryAdmin
  }, {
  	path: 'userAdmin',
  	name: 'userAdmin',
    meta: {
      requireLogin: true
    },
  	component: userAdmin
  }]
}

