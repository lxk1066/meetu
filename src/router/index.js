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
  { // 添加好友
    path: '/addFriend/:uid',
    name: 'addFriend',
    props: true,
    component: () => import('@/views/User/AddFriendRequest')
  },
  { // 通知
    path: '/notices',
    name: 'notices',
    component: () => import('@/views/User/Notices')
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
  { // 广场
    path: '/square',
    component: () => import('@/views/Home'),
    children: [
      { path: '', name: 'square', component: () => import('@/views/Square/Square') }
    ]
  },
  { // 发布文章
    path: '/square/pubPost',
    name: 'pubPost',
    component: () => import('@/views/Square/publishPost')
  },
  { // 帖子详情页
    path: '/square/postDetail/:postId',
    name: 'postDetail',
    props: true,
    component: () => import('@/views/Square/PostDetail')
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
    component: () => import('@/views/User/ChangePassword')
  }
]

const router = createRouter({
  history: createWebHashHistory('/#'),
  routes
})
router.beforeEach((to, from, next) => {
  const noAuthArr = ['/register', '/login', '/changePassword/', '/square'] // 不需要登录授权的路由数组
  const authArr = ['/square/pubPost'] // 需要登录授权的路由数组(不含全部)
  if (authArr.some(item => to.path.startsWith(item))) {
    to.meta.auth = true
  } else if (noAuthArr.some(item => to.path.startsWith(item))) {
    to.meta.auth = false
  } else {
    to.meta.auth = true
  }

  next()
})

export default router
