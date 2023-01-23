<template>
  <div class="square-container">
    <div class="square-header">
      <div class="header-left">
        <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="bottom-start" :offset="[-2,5]" style="width: 90px;">
          <template #reference>
            <van-icon name="add" size="25" />
          </template>
        </van-popover>
      </div>
      <div class="header-title">
        <h3>广场</h3>
      </div>
      <div class="header-right">
        <van-icon name="photograph" size="25" />
      </div>
    </div>
    <div class="square-main">
      <div class="placeholder"></div>
      <div class="content-box">
        <van-pull-refresh v-model="loading" success-text="刷新成功" @refresh="onRefresh" :style="{ minHeight: '800px' }">
          <van-list v-model:loading="listLoading" :finished="listFinished" :immediate-check="false"
                    loading-text="拼命加载中" finished-text="o(︶︿︶)o再怎么找都没有啦！" @load="onLoad">
            <Post v-for="item in postList" :key="item.art_id"
                  :post-id="item.art_id"
                  :uid="item.uid"
                  :username="item.username"
                  :profile="item.profile"
                  :title="item.title"
                  :content="item.content"
                  :pictures="item.pictures"
                  :updated-time="item.updated_time"
            />
          </van-list>
        </van-pull-refresh>
        <van-back-top bottom="10vh" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon, Button, Popover, Image, PullRefresh, List, BackTop, showFailToast } from 'vant'
import Post from '@/components/Square/Post.vue'
import getPostList from '@/api/square/getPostList'
import getMuidUserInfo from '@/api/getMuidUserInfo'

export default {
  name: 'meetuSquare',
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [Image.name]: Image,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [BackTop.name]: BackTop,
    Post
  },
  setup () {
    const router = useRouter()
    const loading = ref(false)
    const listLoading = ref(false)
    const listFinished = ref(false)
    const showPopover = ref(false)
    const postList = ref([])
    const actions = [
      { text: '图文', icon: 'photo' }
    ]
    onMounted(async () => {
      loading.value = true
      postList.value = []
      const { data: res } = await getPostList('time', 0, 10)
      if (res.code === 200) {
        postList.value = res.data.result
        loading.value = false
        loadUserInfo().catch(() => {
          showFailToast({ message: '部分用户信息获取失败', position: 'bottom' })
        })
      }
    })
    const loadUserInfo = async () => {
      for (const item of postList.value) {
        const { data: res } = await getMuidUserInfo(item.muid)
        if (res.code === 200) {
          item.uid = res.data.uid
          item.username = res.data.username
          item.profile = res.data.profile
        } else {
          item.uid = 0
          item.username = 'unknown'
          item.profile = 'default.png'
        }
      }
    }
    const onSelect = () => {
      router.push({ name: 'pubPost' })
    }
    const onRefresh = async () => {
      // 下拉刷新
      listFinished.value = false
      const { data: res } = await getPostList('time', 0, 10)
      if (res.code === 200) {
        postList.value = []
        postList.value = res.data.result
        loading.value = false
        loadUserInfo().catch(() => {
          showFailToast({ message: '部分用户信息获取失败', position: 'bottom' })
        })
      }
    }
    const onLoad = async () => {
      if (!postList.value.length) {
        listLoading.value = false
        return false
      }
      const { data: res } = await getPostList('time', postList.value.length, 10)
      if (res.code === 200) {
        if (res.data.result.length === 0) {
          listFinished.value = true
        } else {
          postList.value.push(...res.data.result)
        }
        listLoading.value = false
      } else {
        showFailToast({ message: '获取失败', position: 'bottom' })
      }
    }
    return { loading, listLoading, listFinished, actions, showPopover, postList, onSelect, onRefresh, onLoad }
  }
}
</script>

<style lang="less" scoped>
.square-container {
  width: 100%;
  min-height: calc(100% - 60px);
  background-color: #efefef;
  .square-header {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left, .header-right {
      margin: 0 10px;
    }
  }
  .square-main {
    width: 100%;
    min-height: 800px;
    .placeholder {
      width: 100%;
      height: 60px;
    }
    .content-box {
      width: 100%;
      min-height: calc(800px - 60px);
      background-color: #efefef;
    }
  }
}
</style>
