<template>
  <van-popup v-model:show="isShow" round closeable close-icon="close" position="bottom" :style="{ backgroundColor: '#efefef', height: '60%' }"
             duration="0.25" transition-appear >
    <h4 style="text-align: center">修改邮箱地址</h4>
    <p class="tips">我们会向您的邮箱地址<span class="old-email">{{oldEmail}}</span>发送一封包含验证码的邮件，以验证您的身份。</p>
    <van-cell-group inset>
      <van-field v-model="verifyCode" label="验证码" placeholder="请输入验证码" >
        <template #button>
          <van-button size="small" type="primary" @click="sendVerifyCode" ref="sendVerifyCodeBtn" :disabled="emailVerifyCodeBtnDisable">
            {{ emailVerifyCodeBtnText }}
          </van-button>
        </template>
      </van-field>
      <van-field v-model="newEmail" type="email" label="邮箱地址" placeholder="请输入新的邮箱地址" />
    </van-cell-group>
    <div style="width: 100%;display: flex;justify-content: center;">
      <van-button class="modify-email-btn" type="danger" block @click="modifyEmail" >修改邮箱地址</van-button>
    </div>
  </van-popup>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { Button, Popup, Field, CellGroup, showToast, showFailToast, showSuccessToast } from 'vant'
import verifyCodeCountdown from '@/utils/verifyCodeCountdown'
import sendModifyMailboxLetter from '@/api/modifyMailboxLetter'
import modifyMailbox from '@/api/modifyMailbox'

export default {
  name: 'meetuModifyMailbox',
  props: ['email'],
  components: { [Button.name]: Button, [Popup.name]: Popup, [Field.name]: Field, [CellGroup.name]: CellGroup },
  setup (props, context) {
    const isShow = ref(true)
    const newEmail = ref('')
    const verifyCode = ref('')
    const emailVerifyCodeBtnDisable = ref(false)
    const sendVerifyCodeBtn = reactive({})
    const emailVerifyCodeBtnText = ref('发送验证码')

    watch(isShow, (newVal) => {
      if (newVal === false) {
        context.emit('closePopup')
      }
    })
    const emailPattern = (val) => {
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
        return '邮箱不合法，请重新输入'
      }
    }
    const sendVerifyCode = async () => {
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await sendModifyMailboxLetter(token)
      if (res.code === 200) {
        // 邮箱发送成功
        emailVerifyCodeBtnDisable.value = true
        verifyCodeCountdown('发送验证码', 60 * 5, emailVerifyCodeBtnText, () => {
          emailVerifyCodeBtnDisable.value = false
        })
      } else {
        // 邮箱发送失败
        showToast({ message: res.msg, position: 'bottom' })
      }
    }
    // 点击修改邮箱地址按钮的事件回调
    const modifyEmail = async () => {
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(newEmail.value)) {
        const token = localStorage.getItem('meetu_jwt_token')
        const { data: res } = await modifyMailbox(token, verifyCode.value, newEmail.value)
        if (res.code === 200) {
          // 修改成功
          showSuccessToast({ message: '修改成功！', position: 'middle' })
          isShow.value = false
        } else {
          showFailToast({ message: res.msg, position: 'middle' })
        }
      } else {
        showToast({ message: '请输入合法邮箱地址', position: 'bottom' })
      }
    }

    return { isShow, oldEmail: props.email, newEmail, verifyCode, emailVerifyCodeBtnDisable, sendVerifyCodeBtn, emailVerifyCodeBtnText, emailPattern, sendVerifyCode, modifyEmail }
  }
}
</script>

<style lang="less" scoped>
.tips {
  width: 95%;
  margin-left: 10px;
  text-indent: 2rem;
  .old-email {
    text-indent: 0;
    display: inline-block;
    padding: 5px;
    background-color: #fcd8d8;
    border-radius: 5px;
  }
}
.modify-email-btn {
  width: 90%;
  margin-top: 10px;
}
</style>
