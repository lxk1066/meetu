<template>
  <div class="article">
    <div class="article-header">
      <div class="header-left">
        <van-image
          round
          width="2.8rem"
          height="2.8rem"
          fit="cover"
          @click="$router.push({ name: 'detail', params: { uid: props.uid } })"
          :src="getProfile(props.profile)"
          :style="{ display: 'inline-block' }" />
        <div class="header-left-right">
          <span class="username">{{ props.username }}</span>
          <span class="updated-time">{{ formatTimeStamp(props.updatedTime, 'auto') }}</span>
        </div>
      </div>
      <div class="header-right">
        <van-icon name="ellipsis" class="ellipsis" />
      </div>
    </div>
    <div class="article-content" @click="openDetail">
      <div class="title van-ellipsis">{{props.title}}</div>
      <div class="message van-multi-ellipsis--l2">{{props.content}}</div>
      <div class="picture" ref="picturesRef">
        <van-image
          width="6rem"
          height="6rem"
          fit="cover"
          @load="pictureLoad"
          v-for="picture in props.pictures" :key="picture.pic_id"
          :src="getPicture(picture.pic_name)"
          class="picture-item"
          :style="{ marginTop: '10px', marginRight: '5px' }"
        />
      </div>
    </div>
    <div class="article-function">
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
</template>

<script>
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon, Image, showImagePreview } from 'vant'
import getProfile from '@/api/getProfile'
import getPicture from '@/api/square/getPicture'
import formatTimeStamp from '@/utils/formatTimeStamp'
export default {
  name: 'meetuSquarePost',
  components: { [Icon.name]: Icon, [Image.name]: Image },
  props: {
    postId: {
      required: true
    },
    uid: {
      required: true
    },
    username: {
      required: true
    },
    profile: {
      required: true
    },
    title: {
      required: true
    },
    content: {
      required: true
    },
    pictures: {
      default: () => []
    },
    updatedTime: {
      type: [String, Number]
    }
  },
  setup (props) {
    const router = useRouter()
    const picturesRef = ref(null)
    let pictureItems = []
    const openDetail = () => {
      router.push({ name: 'postDetail', params: { postId: props.postId } })
    }

    // 如果图片全部加载完毕，就获取所有的图片DOM，添加点击事件
    let loadedNumber = 0
    const pictureLoad = () => {
      loadedNumber = loadedNumber + 1
      if (loadedNumber === props.pictures.length) {
        picturePreview()
      }
    }
    const pictureItemFn = (e) => {
      e.stopPropagation()
      showImagePreview({
        images: props.pictures.map(item => getPicture(item.pic_name)),
        startPosition: pictureItems.indexOf(e.target.parentNode)
      })
    }
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
    return { props, picturesRef, pictureItems, pictureLoad, getProfile, getPicture, formatTimeStamp, openDetail }
  }
}
</script>

<style lang="less" scoped>
.article {
  min-height: 100px;
  max-height: 350px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  .article-header {
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
  .article-content {
    margin: 0 5px 0 3rem;
    img {
      max-height: 200px;
    }
    .title {
      font-size: 18px;
    }
    .message {
      font-size: 15px;
      background-color: #efefef;
    }
  }
  .article-function {
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
