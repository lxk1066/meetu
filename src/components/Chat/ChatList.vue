<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh" success-text="刷新成功">
    <div class="chatlist-container">
<!--      置顶列表-->
      <van-swipe-cell class="swipe-cell-list van-ellipsis" v-for="(item, index) in topList" :key="item.id" >
        <van-cell class="top-item" :data-uid="item.id" center size="large" clickable border @click="openCell(item.id)" >
          <template #title>
            <van-image
              class="user-profile"
              round
              width="3rem"
              height="3rem"
              :src="item.profile"
              error-icon="user-circle-o"
              loading-icon="user-circle-o"
              fit="cover"
            />
            <h4 class="username">{{item.name}}</h4>
          </template>
          <template #label>
            <div class="van-ellipsis cell-item-description" :class="{'unread-msg': !item.hasRead}">
              <span v-if="!item.hasRead">[未读]</span>
              {{ item.description }}
            </div>
          </template>
          <template #value>
            <div style="height: 50px;">
              <div class="msg-time" style="">{{ formatTimeStamp(item.time, 'auto') }}</div>
              <van-badge class="new-msg" :class="{'new-msg-badge': !item.hasRead}" dot position="top-right"  />
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button @click="unSetTop(item.id, index)" square type="primary" text="取消置顶" />
          <van-button @click="beforeClose(topList, index)" square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
<!--      非置顶列表-->
      <van-swipe-cell class="swipe-cell-list van-ellipsis" v-for="(item, index) in chatList" :key="item.id" >
        <van-cell :data-uid="item.id" center size="large" clickable border @click="openCell(item.id)" >
          <template #title>
            <van-image
              class="user-profile"
              round
              width="3rem"
              height="3rem"
              :src="item.profile"
              error-icon="user-circle-o"
              loading-icon="user-circle-o"
              fit="cover"
            />
            <h4 class="username">{{item.name}}</h4>
          </template>
          <template #label>
            <div class="van-ellipsis cell-item-description" :class="{'unread-msg': !item.hasRead}">
              <span v-if="!item.hasRead">[未读]</span>
              {{ item.description }}
            </div>
          </template>
          <template #value>
            <div style="height: 50px;">
              <div class="msg-time" style="">{{ formatTimeStamp(item.time, 'auto') }}</div>
              <van-badge class="new-msg" :class="{'new-msg-badge': !item.hasRead}" dot position="top-right"  />
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button @click="setTop(item.id, index)" square type="primary" text="置顶" />
          <van-button @click="beforeClose(chatList, index)" square type="danger" text="删除" />
        </template>
      </van-swipe-cell>

    </div>
  </van-pull-refresh>
</template>

<script>
import { ref, watch, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showConfirmDialog, Button, Image, Cell, PullRefresh, SwipeCell, Badge, showToast } from 'vant'
import getPersonInfo from '@/api/getPersonInfo'
import getProfile from '@/api/getProfile'
import getAllUserId from '@/api/getAllUserId'
import formatTimeStamp from '@/utils/formatTimeStamp'
import { addMessage } from '@/utils/IndexedDB/addMessage'
import { getLastMessage } from '@/utils/IndexedDB/getLastMessage'

export default {
  name: 'meetuChatList',
  components: {
    [PullRefresh.name]: PullRefresh,
    [Cell.name]: Cell,
    [Image.name]: Image,
    [SwipeCell.name]: SwipeCell,
    [Button.name]: Button,
    [Badge.name]: Badge
  },
  setup () {
    const loading = ref(false)
    const count = ref(0)

    const store = useStore()
    const router = useRouter()

    const socket = inject('socket')

    const chatList = ref([
      // { id: 61, name: '会飞的小企鹅', description: '吃午饭了没？一起去搓一顿？', time: 1668182400000, profile: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
      // { id: 15, name: '簡單の緈鍢', description: '你猜我刚刚看到了什么？', time: 1668009600000, profile: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
      // { id: 55, name: '若小曦', description: '什么时候可以去go shopping呢[恼]', time: 1667232000000, profile: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
      // { id: 8, name: '#凯莎大帝#', description: '点个关注，追番不迷路~', time: 1668096000000, profile: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' }
    ])
    // topList用于存储置顶列表中的数据
    const topList = ref([])

    // 去服务器获取用户数据
    const getUserInfo = async (ownUid, otherUid) => {
      const { data: res } = await getPersonInfo(otherUid)
      if (res.code === 200) {
        const lastMsg = await getLastMessage(otherUid.toString(), ownUid.toString())
        chatList.value.push({
          id: otherUid,
          name: res.data.username,
          description: lastMsg[0] ? lastMsg[0].message : '',
          time: lastMsg[0] ? lastMsg[0].time : +new Date(),
          hasRead: lastMsg[0] ? lastMsg[0].hasRead : true,
          profile: getProfile(res.data.profile)
        })
        chatList.value = objArraySort(chatList.value, 'time')
      }
    }
    // 来新消息时消息列表更新
    const newMsg = async (id, msg) => {
      const index = topList.value.findIndex(item => parseInt(item.id) === parseInt(id))
      if (index !== -1) {
        const msgItem = topList.value[index]
        msgItem.description = msg
        msgItem.time = +new Date()
        topList.value.splice(index, 1)
        topList.value.unshift(msgItem)
        msgItem.hasRead = false
      } else {
        const index = chatList.value.findIndex(item => parseInt(item.id) === parseInt(id))
        if (index !== -1) {
          const msgItem = chatList.value[index]
          msgItem.description = msg
          msgItem.time = +new Date()
          chatList.value.splice(index, 1)
          chatList.value.unshift(msgItem)
          msgItem.hasRead = false
        } else {
          const { data: res } = await getPersonInfo(id)
          chatList.value.unshift({
            id: id,
            name: res.data.username,
            description: msg,
            time: +new Date(),
            hasRead: false,
            profile: getProfile(res.data.profile)
          })
        }
      }
    }

    // 聊天列表页下拉刷新的回调函数
    const onRefresh = () => {
      socket.connect()
      socket.emit('online-message', socket.uid)
      setTimeout(() => {
        if (loading.value === true) {
          showToast('刷新失败')
          loading.value = false
        }
      }, 1000 * 10)
    }

    // 点击关闭按钮的回调
    const beforeClose = (arrList, index) => {
      showConfirmDialog({ title: '提示', message: '确认删除么？' }).then(() => {
        arrList.splice(index, 1)
      })
    }
    // 点击置顶按钮时的回调
    const setTop = (uid, index) => {
      // 将用户id对应的消息栏置顶，并将置顶的用户id保存到本地存储
      const topItem = chatList.value.find((item) => item.id === uid)
      topItem.isTop = true
      topList.value.push(topItem)
      chatList.value.splice(index, 1)
      topList.value = objArraySort(topList.value, 'time')
    }
    // 点击取消置顶按钮的回调
    const unSetTop = (uid, index) => {
      const item = topList.value.find((item) => item.id === uid)
      item.isTop = false
      chatList.value.push(item)
      topList.value.splice(index, 1)
      chatList.value = objArraySort(chatList.value, 'time')
    }

    // 将对象根据对应的key值从大到小排序
    const objArraySort = (objArr, key) => {
      const result = objArr.slice(0)
      return result.sort((a, b) => b[key] - a[key])
    }

    // 修改store.state中的未读信息的数量
    const changeUnreadMsgCount = (value) => {
      store.commit('changeUnreadCount', value)
    }

    // 监听chatList的长度变化,发生变化就去改变state中的数据
    watch(chatList, () => {
      // console.log('1@', chatList)
      // chatList.value = objArraySort(chatList.value, 'time')
      // console.log('2@', chatList)
      // changeUnreadMsgCount(chatList.value.length)
      // chatList.value = objArraySort(chatList.value, 'time')
    }, { deep: true })

    onMounted(async () => {
      // 拿到所有用户的id然后循环调用 getUserInfo
      const token = localStorage.getItem('meetu_jwt_token')
      const uid = localStorage.getItem('meetu_uid')
      if (token && uid) {
        const { data: res } = await getAllUserId(token)
        if (res.code === 200) {
          res.data.forEach(async item => {
            await getUserInfo(uid, item.uid)
          })
        }
      }

      chatList.value = objArraySort(chatList.value, 'time') // 将chatList按照time值从大到小排列
      changeUnreadMsgCount(chatList.value.length)

      // 监听在线状态
      socket.on('online-message-reply-own', isOnline => {
        // 刷新成功
        loading.value = false
      })

      // 监听消息
      socket.on('private-message', async (fromId, toId, msg, time) => {
        await newMsg(fromId, msg)

        // 将接收到的消息保存到本地
        addMessage({ from_uid: fromId, to_uid: toId, message: msg, time: time, hasRead: false })
        addMessage({ from_uid: fromId, to_uid: toId, message: msg, time: time, hasRead: false })
      })
    })
    // 点击聊天列表中的某一个，跳转到对应的聊天窗口
    const openCell = (uid) => {
      router.push({ name: 'chatWindow', params: { uid: uid } })
    }

    return { loading, count, chatList, topList, onRefresh, beforeClose, setTop, unSetTop, formatTimeStamp, openCell }
  }
}
</script>

<style lang="less" scoped>
.chatlist-container {
  width: 100%;
  min-height: 90vh;
  .swipe-cell-list {
    max-height: 70px;
    .top-item {
      background-color: #eae9e9;
    }
    .username {
      width: 90%;
      margin: 0;
      padding-left: 55px;
    }
    .user-profile {
      float: left;
    }
    .cell-item-description {
      width: 80%;
    }
    .new-msg {
      display: none;
    }
    .unread-msg {
      color: #cd93ff;
    }
    .new-msg-badge {
      display: inline-block;
      margin-top: 10px;
      margin-right: 5px;
    }
    &:deep(.van-cell__title) {
      width: 60%;
    }
    &:deep(.van-swipe-cell__right .van-button) {
      height: 100%;
    }
    &:deep(.van-cell__label) {
      width: 100%;
      padding-left: 55px;
    }
  }
  &:deep(.van-cell__value) {
    font-size: 12px;
  }
}

</style>
