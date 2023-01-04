<template>
  <van-nav-bar
    title="发布图文"
    left-arrow
    @click-left="onClickLeft"
  />
  <div class="content-box">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="title"
          name="标题"
          placeholder="标题"
          :rules="[{ required: true, message: '请填写标题' }]"
        />
      </van-cell-group>
      <van-cell-group inset :style="{ marginTop: '10px' }">
        <van-field
          v-model="message"
          rows="5"
          autosize
          type="textarea"
          maxlength="500"
          placeholder="请输入帖子内容"
          show-word-limit
          :style="{ fontSize: '16px' }"
        />
      </van-cell-group>
      <van-cell-group inset :style="{ marginTop: '10px' }">
        <van-field name="uploader">
          <template #input>
            <van-uploader v-model="pictures"  multiple :max-count="6" />
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          发布
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { NavBar, Field, CellGroup, Form, Button, Uploader, showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'

export default {
  name: 'meetuPublishArticle',
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Form.name]: Form,
    [Button.name]: Button,
    [Uploader.name]: Uploader
  },
  setup () {
    const router = useRouter()
    const title = ref('')
    const message = ref('')
    const pictures = ref([])
    const onClickLeft = () => {
      if (title.value || message.value || pictures.value.length) {
        showConfirmDialog({
          title: '提示',
          message: '当前编辑内容未保存，确认退出？'
        }).then(() => {
          router.back()
        }).catch(() => {})
      } else {
        router.back()
      }
    }
    const onSubmit = () => {
      console.log('发布图文')
    }
    return { title, message, pictures, onClickLeft, onSubmit }
  }
}
</script>

<style lang="less" scoped>
.content-box {
  width: 100%;
  min-height: calc(100% - 46px);
  background-color: #efefef;
  padding-top: 10px;
}
</style>
