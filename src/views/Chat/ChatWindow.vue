<template>
  <van-nav-bar @click-left="onClickLeft" fixed placeholder>
    <template #left>
      <van-icon name="arrow-left" size="25" />
    </template>
    <template #title>
      <h4 class="nav-bar-username" @click="openDetail('own')">{{ otherInfo.username }}</h4>
      <p v-if="anotherIsOnline" class="nav-bar-online-status"><van-icon name="checked" />在线</p>
      <p v-else class="nav-bar-online-status"><van-icon name="clear" color="#c6bfc7" />离线</p>
    </template>
    <template #right>
      <van-icon name="ellipsis" size="25" />
    </template>
  </van-nav-bar>

  <div class="msg-list">
    <!--  消息显示区域-->
    <div class="msg-row" :class="'msg-row-to-'+item.to" v-for="item in msgList" :key="item.id" >
      <van-image class="profile" round fit="cover" width="3rem" height="3rem"
                 :src="item.profile" @click="openDetail(item.to)" />
      <div class="msg-box">
        <div class="box-square"></div>
        <!--      普通文字消息-->
        <div v-if="item.type === 'string'" class="message">{{item.msg}}</div>
        <!--      图片消息-->
        <div v-else-if="item.type === 'photo'" class="message">
          <img :src="item.msg" alt="" />
        </div>
        <!--      视频消息-->
        <div v-else-if="item.type === 'video'" class="message">
          <video controls >
            <source :src="item.msg" type="video/mp4">
          </video>
        </div>
      </div>
    </div>
  </div>

  <a id="bottom" href="javascript:void(0)"></a>
<!--  底部区域-->
  <div style="min-height: 100px">
    <div class="bottom-area">
      <div class="function-area">
        <van-icon class="icon" name="photo" size="25" />
        <van-icon class="icon" name="video" size="25" />
        <van-icon class="icon" name="map-marked" size="25" />
      </div>
      <van-cell-group inset class="input-group">
        <van-field v-model="message" placeholder="请输入消息" type="textarea" rows="1" autosize ref="msgInput" >
          <template #button>
            <van-button round size="small" type="primary" style="width: 60px" @click="pushMsg" >发送</van-button>
          </template>
        </van-field>
<!--        <van-button size="small" type="primary" style="width: 50px">发送</van-button>-->
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { nextTick, onBeforeMount, onMounted, reactive, ref, inject, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, showImagePreview, Image, NavBar, Icon, Field, CellGroup, Divider } from 'vant'
import getPersonInfo from '@/api/getPersonInfo'
import getProfile from '@/api/getProfile'
import verifyToken from '@/api/verifyToken'
import { addMessage } from '@/utils/IndexedDB/addMessage'
import { getAllMessages } from '@/utils/IndexedDB/getAllMessages'
import { putMessageReaded } from '@/utils/IndexedDB/putMessageReaded'

export default {
  name: 'meetuChatWindow',
  components: {
    [Button.name]: Button,
    [Image.name]: Image,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Divider.name]: Divider
  },
  setup () {
    const ownInfo = reactive({})
    const otherInfo = reactive({})
    const message = ref('')
    const anotherIsOnline = ref(false)
    const socket = inject('socket')
    const route = useRoute()
    const router = useRouter()
    let updateOnlineInterval // 每个一分钟更新一次在线状态
    const onClickLeft = () => {
      router.push({ name: 'chatList' })
    }// 点击左上角返回按钮的回调函数
    const imgArr = reactive([]) // 消息中的图片列表
    const msgInput = ref(null) // 输入消息的input框
    const antiShakeFlag = ref(true) // 点击发送消息按钮的防抖flag变量
    const msgList = reactive([]) // 消息列表
    onBeforeMount(async () => {
      // 验证jwt_token
      const token = localStorage.getItem('meetu_jwt_token')
      const myid = localStorage.getItem('meetu_uid')
      if (token && myid) {
        const { data: res } = await verifyToken(token)
        if (res.code !== 200) await router.push('/')
      } else {
        await router.push('/')
      }
      // 获取自己的个人信息
      const { data: myRes } = await getPersonInfo(myid)
      if (myRes.code === 200) {
        const data = myRes.data
        ownInfo.id = myid
        ownInfo.username = data.username
        ownInfo.profile = data.profile
      }
      // 获取对方的个人信息
      const { data: otherRes } = await getPersonInfo(route.params.uid)
      if (otherRes.code === 200) {
        const data = otherRes.data
        otherInfo.id = route.params.uid
        otherInfo.username = data.username
        otherInfo.profile = data.profile
      }
      // 将双方的信息更新到 msgList
      msgList.forEach((item) => {
        if (item.to === 'me') {
          item.profile = getProfile(otherInfo.profile)
        } else if (item.to === 'other') {
          item.profile = getProfile(ownInfo.profile)
        }
      })
      // 获取对方的在线状态
      socket.emit('online-message', otherInfo.id)
      socket.on('online-message-reply-own', isOnline => {
        anotherIsOnline.value = isOnline
      })
      socket.on(`online-message-reply-${myid}`, (isOnline) => {
        anotherIsOnline.value = isOnline
      })
      // 每隔一分钟就更新一次对方的在线状态
      updateOnlineInterval = setInterval(() => {
        socket.emit('online-message', otherInfo.id)
      }, 1000 * 15)

      // 从本地数据库取出所有的聊天记录并渲染到页面上
      const localMsgList = await getAllMessages(ownInfo.id, ownInfo.id, otherInfo.id)
      for (const item of localMsgList) {
        if (!item.hasRead) { await putMessageReaded(ownInfo.id, item.msg_id, item.from_uid, item.to_uid, item.message, item.time) }
        if (item.from_uid.toString() === ownInfo.id) {
          createMsg('string', 'other', item.message)
        } else if (item.from_uid.toString() === otherInfo.id) {
          createMsg('string', 'own', item.message)
        }
      }
      scrollToBottom()
    })

    onMounted(() => {
      scrollToBottom() // 一进入聊天窗口就跳转到最底下
      // 为所有的图片添加一个图片预览的功能
      const imgs = document.querySelectorAll('.msg-row .message img')
      imgs.forEach((item, index) => {
        imgArr.push(item.src)
        item.addEventListener('click', () => {
          showImagePreview({
            images: imgArr,
            startPosition: index
          })
        })
      })
      // const videos = document.querySelector('.msg-row .message video')
      // console.log(videos.querySelector('source').src)
      // 监听新消息
      socket.on('private-message', (fromId, toId, msg, time) => {
        console.log('chatWindow', fromId, msg)
        createMsg('string', 'own', msg)
        scrollToBottom()
        addMessage(ownInfo.id, fromId, toId, { from_uid: fromId, to_uid: toId, message: msg, time: time, hasRead: false })
      })
    })

    // 跳转到聊天窗口的最底下
    const scrollToBottom = () => {
      nextTick(() => { document.querySelector('#bottom').scrollIntoView({ behavior: 'auto', block: 'center' }) })
    }
    // 点击发送按钮的回调
    const pushMsg = () => {
      if (antiShakeFlag.value) { // 实现防抖处理，避免出现一个消息发送多次的情况
        antiShakeFlag.value = false
        if (message.value) {
          const time = +new Date()
          createMsg('string', 'other', message.value)
          socket.emit('private-message', otherInfo.id, message.value, time)
          // 让input框重新获取焦点，同时跳转到聊天窗口的最底下
          msgInput.value.focus()
          scrollToBottom()

          // 如果对方此时在线，那么发出去的消息都需要缓存到本地
          if (anotherIsOnline.value) {
            addMessage(ownInfo.id, ownInfo.id, otherInfo.id, {
              from_uid: ownInfo.id,
              to_uid: otherInfo.id,
              message: message.value,
              time: time,
              hasRead: true
            })
          }
          message.value = ''
        }
        antiShakeFlag.value = true
      }

      // 让input框重新获取焦点，同时跳转到聊天窗口的最底下
      msgInput.value.focus()
      scrollToBottom()
    }
    // 创建一个消息的结构
    const createMsg = (type, to, msg) => {
      msg.replace(/\n/g, '\\n')
      // 如果 to 等于 own，就设置头像profile链接为对方的，如果 to 等于 other，就设置头像profile链接为自己的
      const profile = to === 'own' ? getProfile(otherInfo.profile) : getProfile(ownInfo.profile)

      msgList.push({
        id: msgList.length + 1, // 每一条消息在服务器以及本地存储中都有自己的msg_id，这里只是模拟一下
        profile,
        to,
        type,
        msg
      })
    }
    // 点击聊天窗口的头像打开对应的个人详情页
    const openDetail = (to) => {
      if (to === 'own') {
        router.push({ name: 'detail', params: { uid: otherInfo.id } })
      } else if (to === 'other') {
        router.push({ name: 'detail', params: { uid: ownInfo.id } })
      }
    }
    onBeforeUnmount(() => {
      clearInterval(updateOnlineInterval)
    })

    return { ownInfo, otherInfo, message, msgList, anotherIsOnline, onClickLeft, pushMsg, openDetail, msgInput }
  }
}
</script>

<style lang="less">
:root {
  --van-nav-bar-height: 60px;
}
.nav-bar-username {
  margin: 0 20px;
  font-size: 1rem;
}
.nav-bar-online-status {
  margin: 5px 20px;
  font-size: 0.8rem;
}
.msg-row {
  margin: 10px 8px;
  display: flex;
  .profile {
    margin: 5px;
  }
  .msg-box {
    position: relative;
    min-height: 15px;
    min-width: 15px;
    //width: 40%;
    max-width: 60%;
    background-color: #ebebec;
    padding: 10px;
    line-height: 1rem;
    margin: 5px 10px 0 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    .box-square {
      width: 15px;
      height: 15px;
      background-color: #ebebec;
      transform: rotate(45deg);
      position: absolute;
      top: 15px;
      z-index: -1;
    }
    img, video {
      width: 100%;
      border-radius: 5px;
    }
    .message {
      font-size: 15px;
      line-height: 1.2rem;
      word-break: break-all;
    }
  }
}
.msg-row-to-own {
  flex-direction: row;
  .box-square {
    left: -5px;
  }
}
.msg-row-to-other {
  flex-direction: row-reverse;
  .box-square {
    position: absolute;
    right: -5px;
  }
}

.bottom-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #ebebdc;
  z-index: 999;
  .function-area {
    height: 30px;
    display: flex;
    align-items: center;
    .icon {
      margin: 5px;
    }
  }
  .input-group {
    margin: 5px;
    .van-field .van-field__body {
      align-items: flex-end;
      textarea {
        max-height: 120px;
        padding-bottom: 5px;
        color: black;
        font-size: 15px;
      }
    }
  }
}
</style>
