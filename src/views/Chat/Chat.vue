<template>
  <van-nav-bar title="聊天" fixed placeholder z-index="2">
    <template #left>
      <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="bottom-start" :offset="[0, -3]" style="width: 90px;">
        <template #reference>
          <div class="online-icon-box">
            <van-icon :class="{'online-icon': isOnline, 'offline-icon': !isOnline}" :name="isOnline ? 'checked' : 'clear'" size="25" style="padding-right: 5px" />
            {{isOnline ? '在线' : '离线'}}
          </div>
        </template>
      </van-popover>
    </template>
    <template #right>
      <van-icon name="replay" size="25" @click="reload" />
    </template>
  </van-nav-bar>
  <ChatList />
</template>

<script>
import { ref, inject, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { NavBar, Icon, Popover } from 'vant'
import ChatList from '@/components/Chat/ChatList'
export default {
  name: 'meetuChat',
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Popover.name]: Popover,
    ChatList
  },
  setup () {
    const store = useStore()
    const socket = inject('socket')
    const isOnline = ref(false)
    const showPopover = ref(false)
    const actions = [
      { text: '在线', icon: 'checked' },
      { text: '离线', icon: 'clear' }
    ]

    const onSelect = (action) => {
      if (action.text === '在线') {
        socket.connect()
        socket.emit('online-message', socket.uid)
      } else if (action.text === '离线') {
        socket.disconnect()
        store.commit('changeOnlineStatus', false)
      }
    }

    const reload = () => {
      location.reload()
    }

    onMounted(() => {
      socket.on('online-message-reply-own', isOnline => {
        store.commit('changeOnlineStatus', true)
      })
    })

    watchEffect(() => {
      isOnline.value = store.state.onlineStatus
    })

    return { isOnline, showPopover, actions, onSelect, reload }
  }
}
</script>

<style>
.online-icon-box {
  width: 80px;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
}
.online-icon {
  color: lightgreen!important;
}
.offline-icon {
  color: #c08989!important;
}
</style>
