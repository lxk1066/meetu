<template>
  <van-nav-bar title="设置" left-arrow placeholder @click-left="router.back()" />
  <div class="settings-box">
    <van-cell-group title="账号管理" inset>
      <van-cell title="邮箱地址" :value="ownEmail" is-link @click="modifyMailboxIsShow = true" />
      <ModifyMailbox :email="ownEmail" v-if="modifyMailboxIsShow" @closePopup="modifyMailboxIsShow=false" />

      <van-cell label="一个自然年(365天)只能修改1次" :value="muid" is-link @click="modifyMUIDIsShow = true"
                value-class="muid-cell-value" label-class="muid-cell-label">
        <template #title>
          <span class="muid-cell-title" @click.stop="showMuidPrompt">MUID</span>
          <van-icon color="#206864" name="question" />
        </template>
      </van-cell>
      <ModifyMUID :muid="muid" v-if="modifyMUIDIsShow" @closePopup="modifyMUIDIsShow=false" />

      <van-cell title="修改密码" label="一个自然月只能修改3次" is-link @click="modifyPasswordIsShow = true" />
      <ModifyPassword :email="ownEmail" v-if="modifyPasswordIsShow" @closePopup="modifyPasswordIsShow=false" />
    </van-cell-group>
    <van-cell-group title="用户须知" inset>
      <van-cell title="用户协议" is-link />
      <van-cell title="隐私政策" is-link />
      <van-cell title="特别声明" is-link />
    </van-cell-group>
    <van-cell-group title="其他" inset>
      <van-cell title="关于我们" is-link />
      <van-cell title="贡献者名单" is-link />
      <van-cell title="帮助与反馈" is-link />
    </van-cell-group>
    <div style="width: 100%;display: flex;justify-content: center;">
      <van-button id="logoutBtn" type="danger" size="large" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon, Button, Cell, CellGroup, NavBar, showConfirmDialog, showDialog } from 'vant'
import ModifyMailbox from '@/components/Settings/ModifyMailbox'
import ModifyPassword from '@/components/Settings/ModifyPassword'
import ModifyMUID from '@/components/Settings/ModifyMUID'
import verifyToken from '@/api/verifyToken'
import getUserMailbox from '@/api/getUserMailbox'
import getUserMUID from '@/api/getUserMUID'

export default {
  name: 'meetuSettings',
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    ModifyMailbox,
    ModifyPassword,
    ModifyMUID
  },
  setup () {
    const router = useRouter()
    const ownEmail = ref('')
    const muid = ref('')

    const logout = () => {
      showConfirmDialog({
        title: '提示',
        message: '确认要退出登录么？'
      }).then(() => {
        localStorage.removeItem('meetu_jwt_token')
        localStorage.removeItem('meetu_uid')
        location.reload()
      }).catch(() => {})
    }
    const showMuidPrompt = () => {
      showDialog({
        title: 'MUID是什么？',
        width: '300',
        message: 'MUID作为每个用户在平台内对外开放的唯一标识，是用户之间互相检索及添加联系方式的唯一途径。请手动设置您的个性MUID，否则你将无法与任何用户进行聊天！\n\nMUID支持6~10位的纯数字 或 小写英文字母+数字。'
      })
    }

    onBeforeMount(async () => {
      // 验证jwt_token
      const token = localStorage.getItem('meetu_jwt_token')
      const uid = localStorage.getItem('meetu_uid')
      if (token && uid) {
        const { data: res } = await verifyToken(token)
        if (res.code !== 200) await router.push('/')
      } else {
        await router.push('/')
      }
      // 获取自己的邮箱地址
      const { data: res } = await getUserMailbox(token)
      if (res.code === 200) {
        ownEmail.value = res.data.email
      }
      // 获取自己的MUID
      const { data: result } = await getUserMUID(uid)
      if (result.code === 200) {
        muid.value = result.data.muid
      }
    })

    const modifyMailboxIsShow = ref(false)
    const modifyPasswordIsShow = ref(false)
    const modifyMUIDIsShow = ref(false)
    return { router, ownEmail, muid, modifyMailboxIsShow, modifyPasswordIsShow, modifyMUIDIsShow, logout, showMuidPrompt }
  }
}
</script>

<style lang="less" scoped>
.settings-box {
  background-color: #ebebec;
  padding-top: 5px;
  height: calc(100% - 50px);
  .muid-cell-title {
    color: #cd93ff;
    text-decoration: underline;
  }
  &:deep(.muid-cell-value) {
    height: 20px;
    width: 100px;
  }
  &:deep(.muid-cell-label) {
    width: 175px;
  }
  #logoutBtn {
    width: 95%;
    margin-top: 20px;
  }
}
</style>
