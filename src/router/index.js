import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/chatList'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register')
  },
  { // 打开聊天列表页
    path: '/chatList',
    component: () => import('@/views/Home'),
    children: [
      { path: '', name: 'chatList', component: () => import('@/views/Chat/Chat') }
    ],
    meta: { to: 'chatList' }
  },
  { // 打开对应聊天窗口
    path: '/chat/:uid',
    name: 'chatWindow',
    component: () => import('@/views/Chat/ChatWindow')
  },
  { // 个人详情页
    path: '/detail/:uid',
    name: 'detail',
    props: true,
    component: () => import('@/views/User/Detail')
  },
  { // 通讯录
    path: '/addressBook',
    name: 'addressBook',
    component: () => import('@/views/Home'),
    children: [
      { path: '', name: 'addressBook', component: () => import('@/views/AddressBook/AddressBook') }
    ],
    meta: { to: 'addressBook' }
  },
  { // 匹配
    path: '/search',
    name: 'search',
    component: () => import('@/views/Home'),
    children: [
      { path: '', name: 'search', component: () => import('@/views/Search') }
    ]
  },
  { // 打开当前登录用户的个人展示页
    path: '/person',
    name: 'person',
    component: () => import('@/views/Home'),
    children: [
      { path: '', name: 'person', component: () => import('@/views/Person') }
    ]
  },
  { // 打开当前登录用户的修改个人信息页
    path: '/person/edit',
    name: 'editUserInfo',
    component: () => import('@/views/EditUserInfo')
  },
  { // 打开当前登录用户的设置页
    path: '/person/settings',
    name: 'settings',
    component: () => import('@/views/Settings')
  },
  { // 打开修改密码页
    path: '/changePassword/:token',
    name: 'changePassword',
    props: true,
    meta: { connected: false }, // 表示不需要与服务器建立socket连接
    component: () => import('@/views/User/changePassword')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  // if (to.path.startsWith('/changePassword/')) {}
  next()
})

export default router
