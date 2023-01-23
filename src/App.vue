<template>
  <router-view />
  <Login v-if="$route.meta.auth" />
</template>

<script>
import { onBeforeUnmount, provide } from 'vue'
import { useStore } from 'vuex'
import Login from '@/components/Login'
import socket from '@/utils/socket/socket'
import verifyToken from '@/api/verifyToken'

export default {
  name: 'app',
  components: { Login },
  setup () {
    provide('socket', socket)
    const store = useStore()

    onBeforeUnmount(() => {
      socket.disconnect()
    })
    return { store }
  },

  async created () {
    // 一进来就立即与服务器建立socket.io连接
    const token = localStorage.getItem('meetu_jwt_token')
    const uid = localStorage.getItem('meetu_uid')
    if (token && uid) {
      // 去服务器验证token
      const { data: res } = await verifyToken(token)
      if (res.code === 200) {
        if (!socket.connected) socket.connect()
        socket.on('connect', () => {
          console.log('connect', socket.id)
          socket.emit('set-user-id', uid)
          socket.uid = uid

          // 更新当前用户的在线状态
          socket.emit('online-message', socket.uid)
          console.log('online-message')
          socket.on('online-message-reply-own', (isOnline) => {
            console.log('isOnline', isOnline)
            this.store.commit('changeOnlineStatus', isOnline)
          })

          socket.on('disconnect', () => {
            console.log('disconnect', socket.id) // undefined
          })
        })
      }
    }
  }
}
</script>

<style lang="less">
@font-face {
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("@/assets/fonts/NotoSans-Medium.ttf");
}
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("@/assets/fonts/OpenSans-Medium.ttf");
}
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("@/assets/fonts/NotoSansSC-Medium.otf");
}
body, html, #app {
  width: 100%;
  height: 100%;

  font-family: 'Noto Sans', 'Open Sans', 'Noto Sans SC', 'Roboto Light', sans-serif;
}
</style>
