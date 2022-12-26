<template>
  <van-popup
    v-model:show="isShow"
    round
    closeable
    close-icon="close"
    position="bottom"
    @closed="closePopup"
    :style="{ height: '80%', backgroundColor: '#efefef' }">
    <template #default>
      <h2 style="text-align: center;">查找用户</h2>
      <van-cell-group inset>
        <van-field clearable v-model="searchStr" label-align="left" placeholder="请输入要搜索的用户MUID" >
          <template #button>
            <van-button size="small" type="primary" :disabled="searchBtnDisable" @click="search">查找</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <van-empty v-if="searchResult.length === 0 && resultIsEmpty"
                 image="search" description="未找到该MUID的用户" />
      <van-cell-group class="user-card-group" inset>
        <van-cell class="user-card" v-for="item in searchResult" :key="item.uid"
                  center size="large" clickable border :to="{ name: 'detail', params: { uid: item.uid } }" >
          <template #title>
            <van-image
              class="user-profile"
              round
              width="4rem"
              height="4rem"
              :src="getProfile(item.profile)"
              error-icon="user-circle-o"
              loading-icon="user-circle-o"
              fit="cover"
            />
            <h4 class="username">{{item.username}}</h4>
            <span class="user-muid">(MUID: {{item.muid}})</span>
            <p class="user-area">地区：{{item.area === 'secrecy' ? '无' : item.area}}</p>
            <p>个性签名：{{item.sign}}</p>
          </template>
        </van-cell>
      </van-cell-group>
    </template>
  </van-popup>
</template>

<script>
import { reactive, ref } from 'vue'
import { Loading, Popup, Field, CellGroup, Cell, Button, Image, Empty, showFailToast } from 'vant'
import searchMUID from '@/api/searchMUID'
import getPersonInfo from '@/api/getPersonInfo'
import getProfile from '@/api/getProfile'

export default {
  name: 'meetuSearchFriend',
  props: ['show'],
  components: {
    [Loading.name]: Loading,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Image.name]: Image,
    [Empty.name]: Empty
  },
  setup (props, context) {
    const searchStr = ref('')
    const isShow = ref(true)
    const searchBtnDisable = ref(false)
    const searchResult = reactive([])
    const resultIsEmpty = ref(false)

    const closePopup = () => {
      context.emit('closePopup')
    }
    const search = async () => {
      if (resultIsEmpty.value) resultIsEmpty.value = false
      if (searchResult.length) searchResult.splice(0, searchResult.length) // 清空数组
      if (searchStr.value) {
        searchBtnDisable.value = true
        const token = localStorage.getItem('meetu_jwt_token')
        const { data: res } = await searchMUID(searchStr.value, token)
        if (res.code === 200) {
          const users = res.data.users
          if (!users.length) resultIsEmpty.value = true
          for (const item of users) {
            const { data: info } = await getPersonInfo(item)
            searchResult.push({
              uid: item,
              profile: info.data.profile,
              username: info.data.username,
              gender: info.data.gender,
              sign: info.data.sign,
              area: info.data.area,
              muid: info.data.muid
            })
          }
        } else {
          showFailToast('搜索失败')
        }
        searchBtnDisable.value = false
      }
    }
    return { searchStr, isShow, searchBtnDisable, searchResult, resultIsEmpty, closePopup, search, getProfile }
  }
}
</script>

<style scoped>
.user-card-group {
  margin-top: 5px;
  background-color: #efefef;
}
.user-card {
  margin: 10px 0;
}
.user-profile {
  float: left;
  margin: 5px;
}
.username {
  font-size: 20px;
  margin: 5px 0 0 0;
  padding-left: 10px;
  display: inline-block;
}
.user-muid {
  margin: 0;
  padding-left: 5px;
  font-size: 12px;
}
.user-area {
  /*display: inline-block;*/
}
</style>
