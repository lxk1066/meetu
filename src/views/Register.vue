<template>
  <div class="register-box">
    <h2>注册用户</h2>
    <van-icon id="close-register-box" name="arrow-left" size="25" @click="goBack" />
    <van-form @submit="onRegister" class="register-form">
      <van-cell-group inset>
        <van-field v-model="username" type="text" name="用户名" label="用户名" placeholder="用户名"
                   :rules="[{ required: true, message: '请输入用户名' }]"/>

        <van-field v-model="email" type="email" label="邮箱" placeholder="邮箱" name="emailPattern"
                   :rules="[{ validator: emailPattern }]" />

        <van-field v-model="emailVerifyCode" center clearable label="验证码" placeholder="请输入邮箱验证码"
                   :rules="[{ required: true, message: '请输入邮箱验证码' }]" >
          <template #button>
            <van-button size="small" type="primary" @click="sendVerifyCode" id="emailCodeBtn" :disabled="emailVerifyCodeBtnDisable" >
              {{ emailVerifyCodeBtnText }}
            </van-button>
          </template>
        </van-field>

        <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码"
                   :rules="[{ validator: passwordPattern }]" />
        <van-field v-model="confirmPassword" type="password" name="确认密码" label="确认密码" placeholder="确认密码"
                   :rules="[{ required: true, message: '请输入确认密码' }]" />

      </van-cell-group>
      <p style="padding-left: 20px;">已经有账号？去<router-link to="/login">&#160;登录</router-link></p>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" >
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Icon, Form, Field, CellGroup, showToast, showSuccessToast, showFailToast } from 'vant'
import sendEmailVerifyCode from '@/api/emailVerifyCode'
import register from '@/api/register'
import verifyCodeCountdown from '@/utils/verifyCodeCountdown'
export default {
  name: 'meetuLoginView',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup
  },
  setup () {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const email = ref('')
    const emailVerifyCode = ref('')
    const emailVerifyCodeBtnText = ref('发送验证码')
    const emailVerifyCodeBtnDisable = ref(false) // 发送验证码按钮禁用的变量

    const emailPattern = (val) => {
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
        return '邮箱不合法，请重新输入'
      }
    }

    const passwordPattern = (val) => {
      if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9,._!@#$^&*]{8,20}$/.test(val)) {
        return '密码8~20位，必须包含大小写字母和数字，特殊字符可选(,._!@#$^&*)'
      }
    }

    const sendVerifyCode = async () => {
    //  向后端请求发送邮箱验证码
      if (email.value !== '') {
        const { data: res } = await sendEmailVerifyCode(email.value)
        if (res.code === 200) {
          //  邮箱发送成功
          emailVerifyCodeBtnDisable.value = true
          verifyCodeCountdown('发送验证码', 60 * 5, emailVerifyCodeBtnText, () => {
            emailVerifyCodeBtnDisable.value = false
          })
        } else {
          //  邮箱发送失败
          showToast({ message: res.msg, position: 'bottom' })
        }
      }
    }

    // 点击注册按钮
    const onRegister = async () => {
      if (!username.value) {
        showToast({ message: '用户名不得为空', position: 'bottom' })
      } else if (!password.value) {
        showToast({ message: '密码不得为空', position: 'bottom' })
      } else if (!confirmPassword.value) {
        showToast({ message: '确认密码不得为空', position: 'bottom' })
      } else if (!email.value) {
        showToast({ message: '邮箱不得为空', position: 'bottom' })
      } else if (!emailVerifyCode.value) {
        showToast({ message: '邮箱验证码不得为空', position: 'bottom' })
      } else if (password.value !== confirmPassword.value) {
        showToast({ message: '确认密码与密码不一致！', position: 'bottom' })
      } else {
        // 向后端服务器请求注册
        const { data: res } = await register(username.value, password.value, email.value, emailVerifyCode.value)
        if (res.code === 200) {
          showSuccessToast({ message: '注册成功！', position: 'middle' })
          await router.push('/login')
        } else {
          // 注册失败
          showFailToast({ message: res.msg, position: 'bottom', duration: 2000 })
        }
      }
    }

    const goBack = async () => {
      await router.push('/')
      location.reload()
    }

    return {
      username,
      password,
      confirmPassword,
      email,
      emailVerifyCode,
      emailVerifyCodeBtnText,
      emailVerifyCodeBtnDisable,
      sendVerifyCode,
      emailPattern,
      passwordPattern,
      onRegister,
      goBack
    }
  }
}
</script>

<style lang="less" scoped>

.register-box {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #efeded;
  display: flex;
  flex-direction: column;
  h2 {
    text-align: center;
  }
  #close-register-box {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>
