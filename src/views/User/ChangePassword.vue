<template>
  <div class="container">
    <h2>修改密码</h2>
    <van-form @submit="onChangePassword">
      <van-cell-group inset>
        <van-field title="密码" v-model="password" label="密码" type="password" placeholder="请输入新密码"
                   :rules="[{ validator: passwordPattern }]" />
        <van-field title="确认密码" v-model="confirmPassword" label="确认密码" type="password" placeholder="请重新输入新密码"
                   :rules="[{ required: true, message: '请输入确认密码' }]" />
      </van-cell-group>
      <van-button type="primary" round block style="width: 90%;margin: 20px auto" native-type="submit">修改密码</van-button>
    </van-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form, CellGroup, Field, Button, showToast, showSuccessToast } from 'vant'
import changePassword from '@/api/changePassword'

export default {
  name: 'meetuChangePassword',
  props: ['token'],
  components: { [Form.name]: Form, [CellGroup.name]: CellGroup, [Field.name]: Field, [Button.name]: Button },
  setup (props) {
    const router = useRouter()
    const password = ref('')
    const confirmPassword = ref('')

    const passwordPattern = (val) => {
      if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9,._!@#$^&*]{8,20}$/.test(val)) {
        return '密码8~20位，必须包含大小写字母和数字，特殊字符可选(,._!@#$^&*)'
      }
    }

    const onChangePassword = async () => {
      if (password.value === confirmPassword.value) {
        const { data: res } = await changePassword(props.token, password.value)
        if (res.code === 200) {
          showSuccessToast('密码修改成功！')
          setTimeout(() => { router.push('/') }, 2000)
        } else if (res.code === 4031 || res.code === 4032) {
          showToast({ message: '该链接已过期', position: 'bottom' })
        } else {
          showToast({ message: res.msg, position: 'bottom' })
        }
      } else {
        showToast({ message: '密码不一致', position: 'bottom' })
      }
    }

    return { password, confirmPassword, passwordPattern, onChangePassword }
  }
}
</script>

<style scoped>
.container {
  background-color: #ebebec;
  height: 100%;
}
h2 {
  margin: 0;
  padding: 20px 0;
  text-align: center;
}
</style>
