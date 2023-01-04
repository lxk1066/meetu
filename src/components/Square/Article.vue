<template>
  <div class="article">
    <div class="article-header">
      <div class="header-left">
        <van-image
          round
          width="3rem"
          height="3rem"
          fit="cover"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          :style="{ display: 'inline-block' }" />
        <span class="username">会飞的小企鹅</span>
      </div>
      <div class="header-right">
        <van-icon name="ellipsis" class="ellipsis" />
      </div>
    </div>
    <div class="article-content">
      <div class="message van-multi-ellipsis--l2">审核通过了，卷起来！😂😂😂</div>
      <div class="picture">
        <van-image
          width="10rem"
          fit="contain"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          :style="{ marginTop: '10px' }"
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
import { Icon, Image } from 'vant'
export default {
  name: 'meetuArticle',
  components: { [Icon.name]: Icon, [Image.name]: Image }
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
        display: inline-block;
        margin-left: 5px;
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
