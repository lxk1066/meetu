<template>
  <van-nav-bar
    title="通知"
    left-arrow
    @click-left="goBack" />
  <van-swipe-cell v-for="(item, index) in allInfo" :key="item.id">
    <template #left>
      <van-button square type="primary" text="同意" @click="agree(index)" v-if="item.type==='addFriend'" />
    </template>
    <van-cell>
      <template #title>
        <div class="notice-item-title">
          <van-image
            class="user-profile"
            round
            width="3rem"
            height="3rem"
            :src="getProfile(item.profile)"
            error-icon="user-circle-o"
            loading-icon="user-circle-o"
            fit="cover"
          />
          <p class="notice">
            <span>
              <span class="username" @click="$router.push({ name: 'detail', params: { uid: item.uid } })">
              {{item.username}}
              </span>
              <span v-if="item.type==='addFriend'">申请加你为好友</span>
              <span v-else-if="item.type==='disagreeFriend'">拒绝了你的好友请求</span>
            </span>
            <span class="message van-ellipsis">{{item.message}}</span>
          </p>
        </div>
      </template>
      <template #value>
        <div style="font-size: 10px">{{formatTimeStamp(item.time, 'auto')}}</div>
      </template>
    </van-cell>
    <template #right>
      <van-button square type="danger" text="拒绝" @click="disagree(index)" v-if="item.type==='addFriend'" />
      <van-button square type="primary" text="删除" @click="delNotice(index)" />
    </template>
  </van-swipe-cell>
</template>

<script>
import { ref, onBeforeMount } from 'vue'
import { SwipeCell, NavBar, Cell, Image, Button, showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import getAllNotices from '@/api/notice/getAllNotices'
import getMuidUserInfo from '@/api/getMuidUserInfo'
import getProfile from '@/api/getProfile'
import agreeFriendRequest from '@/api/notice/agreeFriendRequest'
import disagreeFriendRequest from '@/api/notice/disagreeFriendRequest'
import deleteNotice from '@/api/notice/deleteNotice'
import formatTimeStamp from '@/utils/formatTimeStamp'

export default {
  name: 'meetuNotices',
  components: { [SwipeCell.name]: SwipeCell, [Button.name]: Button, [NavBar.name]: NavBar, [Cell.name]: Cell, [Image.name]: Image },
  setup () {
    const allNotices = ref([])
    const allInfo = ref([])
    const router = useRouter()
    const goBack = async () => await router.back()
    onBeforeMount(async () => {
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await getAllNotices(token)
      if (res.code === 200) {
        allNotices.value = res.data.notices
        for (const item of allNotices.value) {
          const info = await getUserInfo(item.from)
          allInfo.value.push({
            id: item.id,
            uid: info.uid,
            username: info.username,
            profile: info.profile,
            message: item.message,
            type: item.type,
            time: item.time
          })
        }
      } else {
        showFailToast('数据获取失败')
      }
    })
    const getUserInfo = async (muid) => {
      const { data: res } = await getMuidUserInfo(muid)
      if (res.code === 200) {
        return res.data
      } else {
        return {}
      }
    }

    const agree = async (index) => {
      // 同意好友申请
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await agreeFriendRequest(token, allNotices.value[index].id)
      if (res.code === 200) {
        showSuccessToast('好友添加成功')
        router.push({ name: 'chatWindow', params: { uid: allInfo[index].uid } })
      } else {
        showFailToast(res.msg)
        location.reload()
      }
    }
    const disagree = async (index) => {
      // 拒绝好友申请
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await disagreeFriendRequest(token, allNotices.value[index].id)
      if (res.code === 200) {
        allNotices.value.splice(index, 1)
        allInfo.value.splice(index, 1)
      } else {
        allNotices.value.splice(index, 1)
        allInfo.value.splice(index, 1)
        showFailToast(res.msg)
      }
    }
    const delNotice = async (index) => {
      // 删除
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await deleteNotice(token, allNotices.value[index].id)
      if (res.code === 200) {
        allNotices.value.splice(index, 1)
        allInfo.value.splice(index, 1)
      } else {
        showFailToast(res.msg)
      }
    }

    return { allInfo, allNotices, getProfile, goBack, formatTimeStamp, agree, disagree, delNotice }
  }
}
</script>

<style lang="less" scoped>
:deep(.van-swipe-cell__left > .van-button), :deep(.van-swipe-cell__right > .van-button) {
  height: 100%;
}
:deep(.van-cell__title) {
  flex-grow: 2.5;
}
.notice-item-title {
  display: flex;
  align-items: center;
  .notice {
    margin: 0;
    padding: 5px 10px;
    font-size: 15px;
    .username {
      color: #cd93ff;
    }
    .message {
      display: block;
      color: #afafaf;
    }
  }
  .user-profile {
    float: left;
    line-height: 90%;
  }
}
</style>
