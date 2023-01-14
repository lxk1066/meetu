<template>
  <div class="post-detail-container">
    <van-nav-bar
      title="图文详情"
      left-arrow
      placeholder
      fixed
      @click-left="onClickLeft"
    />
    <div class="post-box">
      <div class="post-header">
        <div class="header-left">
          <van-image
            round
            width="3rem"
            height="3rem"
            fit="cover"
            @click="$router.push({ name: 'detail', params: { uid: postData.uid } })"
            :src="getProfile(postData.profile)"
            :style="{ display: 'inline-block' }" />
          <div class="header-left-right">
            <span class="username">{{ postData.username }}</span>
            <span class="updated-time">{{ postData.updated_time ? formatTimeStamp(postData.updated_time, 'auto') : '' }}</span>
          </div>
        </div>
        <div class="header-right">
          <van-icon name="ellipsis" class="ellipsis" />
        </div>
      </div>
      <div class="post-content">
        <h3>{{ postData.title }}</h3>
        <p>{{ postData.content }}</p>
        <div class="picture" ref="picturesRef">
          <van-image
            width="95%"
            fit="cover"
            @load="pictureLoad"
            v-for="picture in postData.pictures" :key="picture.pic_id"
            :src="getPicture(picture.pic_name)"
            class="picture-item"
            :style="{ marginTop: '10px', marginRight: '5px' }"
          />
        </div>
      </div>
      <div class="post-function">
        <div class="dianzan">
          <img src="@/assets/dianzan.svg" alt="" />
        </div>
        <div class="pinglun">
          <img src="@/assets/pinglun.svg" alt="" />
        </div>
        <div class="zhuanfa">
          <img src="@/assets/zhuanfa.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NavBar, Image, Icon, showFailToast, showImagePreview } from 'vant'
import getPost from '@/api/square/getPost'
import getProfile from '@/api/getProfile'
import formatTimeStamp from '@/utils/formatTimeStamp'
import getMuidUserInfo from '@/api/getMuidUserInfo'
import getPicture from '@/api/square/getPicture'

export default {
  name: 'meetuSquarePostDetail',
  components: { [NavBar.name]: NavBar, [Image.name]: Image, [Icon.name]: Icon },
  props: { postId: { required: true } },
  setup (props) {
    const router = useRouter()
    const postData = ref({})
    const picturesRef = ref(null)
    let pictureItems = []
    const onClickLeft = () => {
      router.back()
    }
    const loadUserInfo = async () => {
      const { data: res } = await getMuidUserInfo(postData.value.muid)
      if (res.code === 200) {
        postData.value.uid = res.data.uid
        postData.value.username = res.data.username
        postData.value.profile = res.data.profile
      } else {
        postData.value.uid = 0
        postData.value.username = 'unknown'
        postData.value.profile = 'default.png'
      }
    }

    // 如果图片全部加载完毕，就获取所有的图片DOM，添加点击事件
    let loadedNumber = 0
    const pictureLoad = () => {
      loadedNumber = loadedNumber + 1
      if (loadedNumber === postData.value.pictures.length) {
        picturePreview()
      }
    }

    const pictureItemFn = (e) => {
      showImagePreview({
        images: postData.value.pictures.map(item => getPicture(item.pic_name)),
        startPosition: pictureItems.indexOf(e.target.parentNode)
      })
    }

    onBeforeMount(async () => {
      const { data: res } = await getPost(props.postId)
      if (res.code === 200) {
        postData.value = res.data.result
        loadUserInfo().catch(() => {
          showFailToast({ message: '部分用户信息获取失败', position: 'bottom' })
        })
      }
    })

    // 点击图片进入图片预览
    const picturePreview = () => {
      pictureItems = [...picturesRef.value.querySelectorAll('.picture-item')]
      pictureItems.forEach(item => {
        item.addEventListener('click', pictureItemFn)
      })
    }

    onBeforeUnmount(() => {
      if (pictureItems.length) {
        pictureItems.forEach(item => {
          item.removeEventListener('click', pictureItemFn)
        })
      }
    })
    return { postData, picturesRef, pictureItems, pictureLoad, onClickLeft, getProfile, formatTimeStamp, getPicture }
  }
}
</script>

<style lang="less" scoped>
.post-detail-container {
  min-height: 100%;
  padding-bottom: 50px;
  background-color: #efefef;
}
.post-box {
  width: 95%;
  margin: 10px auto 20px auto;
  border-radius: 5px;
  background-color: white;
  .post-header {
    height: 50px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left {
      height: 50px;
      display: flex;
      align-items: center;
      .username {
        font-size: 16px;
        letter-spacing: 0.5px;
        display: block;
        margin-left: 5px;
      }
      .updated-time {
        margin-left: 5px;
        font-size: 13px;
      }
    }
    .header-right {
      height: 50px;
      width: 50px;
      line-height: 50px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .ellipsis {
        transform: rotate(90deg);
        font-size: 20px;
        font-weight: bolder;
      }
    }
  }
  .post-content {
    width: 95%;
    margin: 5px auto;
    .picture {
      text-align: center;
    }
  }
  .post-function {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      width: 25px;
      height: 25px;
    }
    .dianzan, .pinglun, .zhuanfa {
      width: 25px;
      height: 25px;
      display: flex;
      margin: 10px;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
