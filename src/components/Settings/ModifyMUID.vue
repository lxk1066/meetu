<template>
  <van-popup v-model:show="isShow" round closeable close-icon="close" position="bottom" :style="{ backgroundColor: '#efefef', height: '50%' }"
             duration="0.25" transition-appear >
    <h4 style="text-align: center">修改MUID</h4>
    <van-cell-group inset>
      <van-field v-model="ownMuid" type="text" label="MUID" placeholder="请输入新的MUID" />
    </van-cell-group>
    <div style="width: 100%;display: flex;justify-content: center;">
      <van-button class="modify-muid-btn" type="danger" block @click="modifyMUID" :disabled="btnIsDisable">修改MUID</van-button>
    </div>
  </van-popup>
</template>

<script>
import { Popup, CellGroup, Field, Button, showToast, showSuccessToast } from 'vant'
import { ref, watch } from 'vue'
import modifyUserMUID from '@/api/modifyUserMUID'
export default {
  name: 'meetuModifyMUID',
  props: ['muid'],
  components: { [Popup.name]: Popup, [CellGroup.name]: CellGroup, [Field.name]: Field, [Button.name]: Button },
  setup (props, context) {
    const isShow = ref(true)
    const btnIsDisable = ref(false) // 点击修改按钮后禁用按钮，实现防抖
    const ownMuid = ref(props.muid.toString())
    const muidPattern = /\d{6,10}|[a-z0-9]{6,10}/

    watch(isShow, (newVal) => {
      if (newVal === false) {
        context.emit('closePopup')
      }
    })
    const modifyMUID = async () => {
      btnIsDisable.value = true
      if (muidPattern.test(ownMuid.value)) {
        // 向服务器请求修改MUID
        const token = localStorage.getItem('meetu_jwt_token')
        const { data: res } = await modifyUserMUID(token, ownMuid.value)
        if (res.code === 200) {
          showSuccessToast('修改成功')
          isShow.value = false
        } else {
          showToast({ message: res.msg, wordBreak: 'break-all', duration: 3000, position: 'bottom' })
          btnIsDisable.value = false
        }
      } else {
        showToast({ message: 'MUID仅支持6~10位的纯数字 或 小写英文字母+数字。', position: 'bottom', duration: 4000 })
        btnIsDisable.value = false
      }
    }

    return { isShow, btnIsDisable, ownMuid, modifyMUID }
  }
}
</script>

<style>

.modify-muid-btn {
  width: 90%;
  margin-top: 10px;
}
</style>
