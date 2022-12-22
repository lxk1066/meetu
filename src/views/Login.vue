<template>
  <div class="login-box">
    <h2>登录</h2>
    <van-icon id="close-login-box" name="cross" size="25" @click="goBack" />
    <van-form @submit="onLogin" class="login-form">
      <van-cell-group inset>
        <van-field v-model="username" name="用户名" label="账号" placeholder="用户名 &#47; 邮箱" />

        <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码" />

      </van-cell-group>
      <p style="padding-left: 10px;">还没有账号？去<router-link to="/register">&#160;注册</router-link></p>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" :loading="loginLoading" loading-text="正在登录" >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Icon, Form, Field, CellGroup, showToast } from 'vant'
import login from '@/api/login'
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
    const loginLoading = ref(false)

    const onLogin = async () => {
      loginLoading.value = true
      const { data: res } = await login(username.value, password.value)
      if (res.code === 200) {
        loginLoading.value = false
        localStorage.setItem('meetu_jwt_token', res.token)
        localStorage.setItem('meetu_uid', res.uid)
        await router.push('/')
      } else {
        loginLoading.value = false
        showToast({
          message: res.msg,
          position: 'bottom'
        })
      }
    }
    const goBack = async () => {
      await router.push('/')
      location.reload()
    }

    return { loginLoading, username, password, onLogin, goBack }
  }
}
</script>

<style lang="less" scoped>

.login-box {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #efeded;
  display: flex;
  flex-direction: column;
  h2 {
    text-align: center;
  }
  #close-login-box {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>
