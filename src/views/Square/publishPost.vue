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
          v-model.trim="title"
          name="标题"
          placeholder="标题"
          :rules="[{ required: true, message: '请填写标题' }]"
        />
      </van-cell-group>
      <van-cell-group inset :style="{ marginTop: '10px' }">
        <van-field
          v-model.trim="content"
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
        <van-button round block type="primary" native-type="submit" :disabled="submitFlag">
          发布
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import {
  Button,
  CellGroup,
  Field,
  Form,
  NavBar,
  Uploader,
  showConfirmDialog,
  showToast,
  showSuccessToast,
  showFailToast
} from 'vant'
import { useRouter } from 'vue-router'
import publishPost from '@/api/square/publishPost'

export default {
  name: 'meetuPublishPost',
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
    const content = ref('')
    const pictures = ref([])
    const formData = ref({})
    const submitFlag = ref(false)
    const onClickLeft = () => {
      if (title.value || content.value || pictures.value.length) {
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
    const onSubmit = async () => {
      console.log('发布图文')
      if (submitFlag.value === false) {
        submitFlag.value = true
        formData.value = new FormData()
        if (title.value.length < 5 || title.value.length > 30) {
          submitFlag.value = false
          showToast({ message: '标题必须在5~30字之间', position: 'bottom' })
        } else if (content.value.length < 5 || content.value.length > 500) {
          submitFlag.value = false
          showToast({ message: '帖子内容必须在5~500字之间', position: 'bottom' })
        } else {
          formData.value.append('title', title.value)
          formData.value.append('content', content.value)
          if (pictures.value.length) {
            pictures.value.forEach(item => {
              formData.value.append('pictures', item.file)
            })
          }
          console.log(formData.value)
          // 上传服务器
          const token = localStorage.getItem('meetu_jwt_token')
          const { data: res } = await publishPost(token, formData.value)
          if (res.code === 200) {
            showSuccessToast('发布成功')
            submitFlag.value = false
            router.push({ name: 'square' })
          } else {
            showFailToast({ message: '发布失败, ' + res.msg, duration: 2800 })
            submitFlag.value = false
          }
        }
        submitFlag.value = false
      }
    }
    // const dataUrlToFile = (dataUrl, filename) => {
    //   // 去掉url的头，并转换为byte
    //   const splits = dataUrl.split(',')
    //   const mime = splits[0].split(':')[1].split(';')[0]
    //   const bytes = window.atob(splits[1])
    //   const arrayBuffer = new ArrayBuffer(bytes.length)
    //   const uint8View = new Uint8Array(arrayBuffer)
    //   for (let i = 0; i < bytes.length; i++) {
    //     uint8View[i] = bytes.charCodeAt(i)
    //   }
    //   return new File([arrayBuffer], filename, { type: mime })
    // }
    return { title, content, pictures, formData, submitFlag, onClickLeft, onSubmit }
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
