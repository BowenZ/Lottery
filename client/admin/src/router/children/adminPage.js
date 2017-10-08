import adminPage from '@/views/adminPage/'
import lotteryAdmin from '@/views/adminPage/children/lotteryAdmin'

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
  	component: lotteryAdmin
  }]
}

