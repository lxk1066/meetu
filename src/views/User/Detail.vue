<template>
  <div class="header-box" :style="{ backgroundImage: `url(${headerImage})` }">
    <van-icon name="arrow-left" size="30" @click="goBack" class="go-back-btn" />
    <div id="avatar-box">
      <div style="position: relative;display: inline-block;">
        <img id="avatar" :src="userProfile" alt="头像" />
        <span v-if="gender==='male'" class="gender">♂</span>
        <span v-else-if="gender==='female'" class="gender">♀</span>
        <span v-else></span>
      </div>
      <span id="username">{{ username }}</span>
    </div>
    <van-popover v-model:show="showCopyMUIDPopover" :offset="[15, 8]">
      <van-grid square clickable horizontal id="copyBtn" style="min-width: 50px;min-height: 30px;">
        <van-grid-item style="flex-basis: 100%;" text="复制" />
      </van-grid>
      <template #reference>
        <p class="muid" ref="muidRef"
           @touchstart.prevent="touchStart"
           @touchmove.prevent="touchMove"
           @touchend="touchEnd">MUID: <span>{{muid ? muid : '无'}}</span>
        </p>
      </template>
    </van-popover>
    <span id="sign">{{ sign }}</span>
  </div>
  <div class="content-box">
    <van-empty
      v-if="isEmpty"
      style="padding-top: 20%;"
      image-size="10rem"
      description="TA 还没有发布任何动态哦！"
    />
  </div>
  <div class="footer-fixed">
    <div class="add-friend" v-if="isFriendDisable" @click="goAddFriend">添加好友</div>
    <div class="chat" @click="goChatWindow">发消息</div>
  </div>
</template>

<script>
import { Icon, Empty, Popover, Grid, GridItem, showToast } from 'vant'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import getPersonInfo from '@/api/getPersonInfo'
import getProfile from '@/api/getProfile'
import { useClipboard } from '@/hooks/useClipboard'
import isOwnFriend from '@/api/isOwnFriend'

export default {
  name: 'meetuDetail',
  components: {
    [Icon.name]: Icon,
    [Empty.name]: Empty,
    [Popover.name]: Popover,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  props: ['uid'],
  setup (props) {
    const router = useRouter()
    const isEmpty = ref(true)
    const headerImage = ref(getProfile('header-background.jpeg'))
    const userProfile = ref('')
    const gender = ref('')
    const username = ref('')
    const sign = ref('')
    const muid = ref('')
    const isFriendDisable = ref(false)
    onBeforeMount(async () => {
      const { data: res1 } = await getPersonInfo(props.uid)
      if (res1.code === 200) {
        const data = res1.data
        userProfile.value = getProfile(data.profile)
        username.value = data.username
        gender.value = data.gender
        sign.value = data.sign
        muid.value = data.muid
      } else {
        showToast({ message: '未找到该用户', position: 'bottom' })
      }
      const token = localStorage.getItem('meetu_jwt_token')
      const uid = localStorage.getItem('meetu_uid')
      if (uid === props.uid) isFriendDisable.value = false
      else {
        const { data: res2 } = await isOwnFriend(token, muid.value)
        if (res2.code === 200) {
          isFriendDisable.value = false
        } else if (res2.code === 404) {
          isFriendDisable.value = true
        }
      }
    })

    // 点击返回按钮
    const goBack = async () => {
      await router.back()
    }
    // 点击添加好友按钮
    const goAddFriend = () => {
      router.push({ name: 'addFriend', params: { uid: props.uid } })
    }
    // 点击发消息按钮
    const goChatWindow = () => {
      router.push({ name: 'chatWindow', params: { uid: props.uid } })
    }

    // 屏幕长按MUID弹出复制气泡框
    const muidRef = ref(null)
    const showCopyMUIDPopover = ref(false)
    let timeoutEvent
    const touchStart = () => {
      muidRef.value.classList.add('muid-touch')
      clearTimeout(timeoutEvent)
      timeoutEvent = setTimeout(() => {
        showCopyMUIDPopover.value = true
      }, 350)
    }
    const touchMove = () => {
      muidRef.value.classList.remove('muid-touch')
      clearTimeout(timeoutEvent)
    }
    const touchEnd = () => {
      muidRef.value.classList.remove('muid-touch')
      clearTimeout(timeoutEvent)
    }

    // 使用Clipboard.js实现复制的功能
    useClipboard('#copyBtn', '.muid span', (status) => {
      showCopyMUIDPopover.value = false
      showToast({ message: status ? '复制成功' : '复制失败', position: 'bottom' })
    })

    return {
      isEmpty,
      headerImage,
      userProfile,
      gender,
      username,
      sign,
      muid,
      muidRef,
      showCopyMUIDPopover,
      isFriendDisable,
      touchStart,
      touchMove,
      touchEnd,
      goBack,
      goAddFriend,
      goChatWindow
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  height: 100%;
}
.header-box {
  z-index: 1;
  width: 100%;
  height: 40%;
  background-position: center center;
  background-repeat: no-repeat;
  //background-position: 10 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: relative;
  .go-back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  #avatar-box {
    width: 200px;
    margin-top: 5%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    #avatar {
      width: 70px;
      height: 70px;
      border-radius: 40px;
      border: 2px solid white;
    }
    .gender {
      position: absolute;
      top: 65%;
      right: 2px;
      color: black;
      width: 18px;
      height: 18px;
      font-size: 15px;
      border-radius: 20px;
      border: 1px solid white;
      background-color: aliceblue;
    }
    #username {
      display: block;
      color: white;
      margin-top: 10px;
      font-size: 25px;
      letter-spacing: 1px;
    }
  }
  .muid {
    margin: 0;
    padding: 0;
    max-width: 150px;
    font-size: 13px;
    color: #deecf9;
  }
  .muid-touch {
    background-color: rgba(211, 211, 211, 0.42);
    color: #70e2ff;
  }
  #sign {
    margin-top: 10px;
    background-image: linear-gradient(90deg, #7117ea, #ea6060);
    background-clip: text; // 该属性只兼容Chrome
    -webkit-background-clip: text;
    color: transparent;
  }
}
.content-box {
  z-index: 2;
  position: relative;
  top: -20px;
  width: 100%;
  min-height: calc(60% + 20px);
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 20px 20px 0 0;
}
.footer-fixed {
  z-index: 3;
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 20px;
  display: flex;
  justify-content: space-evenly;
  & > div {
    width: 120px;
    height: 50px;
    border-radius: 50px;
    background-color: #bf8ff3;
    text-align: center;
    line-height: 50px;
    font-weight: bold;
    color: white;
    box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
    &:active {
      background-color: #d4b0fa;
    }
  }
}
</style>
