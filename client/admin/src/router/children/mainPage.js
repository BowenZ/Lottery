import mainPage from '@/views/mainPage/'

export default {
  path: '/main',
  name: 'main',
  component: mainPage,
  children: [{
  	path: 'myOrder',
  	name: 'myOrder',
  	component: resolve => require(['@/views/myOrder/'], resolve)
  }]
}

