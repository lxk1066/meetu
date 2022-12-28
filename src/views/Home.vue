<template>
  <router-view />
  <van-tabbar class="tab-bar" v-model="active" route placeholder>
    <van-tabbar-item class="tabbar-item" to="/search" name="search" icon="search">匹配</van-tabbar-item>
    <van-tabbar-item class="tabbar-item" to="/addressBook" name="addressBook" icon="friends-o">通讯录</van-tabbar-item>
    <van-tabbar-item class="tabbar-item" to="/chatList" name="chat" icon="chat-o" :badge="unread" :badge-props="{ content: unread, max: 99 }">聊天</van-tabbar-item>
    <van-tabbar-item class="tabbar-item" to="/person" name="person" icon="user-o">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'meetuHome',
  components: { [Tabbar.name]: Tabbar, [TabbarItem.name]: TabbarItem },
  setup () {
    const active = ref('chat')
    const store = useStore()

    return { name, active, unread: computed(() => store.state.unreadCount) }
  }
}
</script>

<style scoped>
:root {
  --van-nav-bar-height: 54px;
}
.tab-bar {
  --van-tabbar-height: 60px;
}
:deep(.van-tabbar-item) {
  margin-bottom: 0;
  transition: margin-bottom .2s ease-in-out;
}
:deep(.van-tabbar-item--active) {
  margin-bottom: 10px;
}

</style>
