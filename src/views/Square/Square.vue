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
          <Article />
          <Article />
<!--          <Article />-->
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon, Button, Popover, Image, PullRefresh } from 'vant'
import Article from '@/components/Square/Article.vue'

export default {
  name: 'meetuSquare',
  components: { [Icon.name]: Icon, [Button.name]: Button, [Popover.name]: Popover, [Image.name]: Image, Article, [PullRefresh.name]: PullRefresh },
  setup () {
    const router = useRouter()
    const loading = ref(false)
    const showPopover = ref(false)
    const actions = [
      { text: '图文', icon: 'photo' }
    ]
    const onSelect = () => {
      router.push({ name: 'pubPost' })
    }
    const onRefresh = () => {
      // 下拉刷新
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }
    return { loading, actions, showPopover, onSelect, onRefresh }
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
