<template>
  <van-overlay :show="show" class="mark-overlay">
    <div class="login-box">
      <h2>登录</h2>
      <van-form @submit="onLogin" class="login-form">
        <van-cell-group inset>
          <van-field v-model="username" name="用户名" label="账号" placeholder="用户名 &#47; 邮箱"
                     :rules="[{ required: true, message: '请输入用户名' }]" />

          <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码"
                     :rules="[{ required: true, message: '请输入密码' }]" />

        </van-cell-group>
        <p style="padding-left: 10px;">还没有账号？去<router-link to="/register" @click="show=false">&#160;注册</router-link></p>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loginLoading" loading-text="正在登录" >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </van-overlay>

</template>

<script>
import { ref, onBeforeMount } from 'vue'
import { Button, Icon, Form, Field, CellGroup, Overlay, showToast } from 'vant'
import login from '@/api/login'
import verifyToken from '@/api/verifyToken'
export default {
  name: 'meetuLogin',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Overlay.name]: Overlay
  },
  setup () {
    const show = ref(false)
    const username = ref('')
    const password = ref('')
    const loginLoading = ref(false)

    const onLogin = async () => {
      loginLoading.value = true
      const { data: res } = await login(username.value, password.value)
      if (res.code === 200) {
        loginLoading.value = false
        localStorage.setItem('meetu_jwt_token', res.token)
        localStorage.setItem('meetu_uid', res.uid)
        show.value = false
        location.reload()
      } else {
        loginLoading.value = false
        showToast({
          message: res.msg,
          position: 'bottom'
        })
      }
    }
    onBeforeMount(async () => {
      const token = localStorage.getItem('meetu_jwt_token')
      const uid = localStorage.getItem('meetu_uid')
      if (token && uid) {
        //  去服务器验证token
        const { data: res } = await verifyToken(token)
        show.value = res.code !== 200
      } else {
        show.value = true
      }
    })

    return { show, loginLoading, username, password, onLogin }
  }
}
</script>

<style lang="less" scoped>
.mark-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  --van-overlay-z-index: 10;
}
.login-box {
  width: 90%;
  min-height: 280px;
  background-color: #efefef;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}
</style>
