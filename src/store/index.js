import { createStore } from 'vuex'

export default createStore({
  state: {
    unreadCount: 0, // 未读消息数量
    onlineStatus: false // 当前登录用户的在线状态
  },
  getters: {
  },
  mutations: {
    changeUnreadCount (state, value) {
      state.unreadCount = value
    },
    changeOnlineStatus (state, value) {
      state.onlineStatus = value
    }
  },
  actions: {
  },
  modules: {
  }
})
