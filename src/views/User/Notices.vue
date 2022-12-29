<template>
  <van-nav-bar
    title="通知"
    left-arrow
    @click-left="goBack" />
  <van-cell v-for="item in allInfo" :key="item.time">
    <template #title>
      <div class="notice-item-title">
        <van-image
          class="user-profile"
          round
          width="2.5rem"
          height="2.5rem"
          :src="getProfile(item.profile)"
          error-icon="user-circle-o"
          loading-icon="user-circle-o"
          fit="cover"
        />
        <p class="notice">
          <span class="username" @click="$router.push({ name: 'detail', params: { uid: item.uid } })">
            {{item.username}}
          </span>
          申请加你为好友
        </p>
      </div>
    </template>
  </van-cell>
</template>

<script>
import { ref, onBeforeMount } from 'vue'
import { NavBar, Cell, Image, showFailToast } from 'vant'
import { useRouter } from 'vue-router'
import getAllNotices from '@/api/notice/getAllNotices'
import getMuidUserInfo from '@/api/getMuidUserInfo'
import getProfile from '@/api/getProfile'

export default {
  name: 'meetuNotices',
  components: { [NavBar.name]: NavBar, [Cell.name]: Cell, [Image.name]: Image },
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
          allInfo.value.push({ uid: info.uid, username: info.username, profile: info.profile, type: item.type, time: item.time })
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

    return { allInfo, allNotices, getProfile, goBack }
  }
}
</script>

<style lang="less" scoped>
.notice-item-title {
  display: flex;
  align-items: center;
  .notice {
    margin: 0;
    padding: 0 10px;
    .username {
      color: #cd93ff;
    }
  }
  .user-profile {
    float: left;
    line-height: 90%;
  }
}
</style>
