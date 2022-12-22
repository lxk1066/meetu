<template>
  <van-nav-bar title="编辑个人信息" left-text="返回" left-arrow placeholder @click-left="onClickLeft" />
  <div class="form-box">
    <van-form>
      <van-cell-group inset>
        <van-field name="uploader" label="上传头像" >
          <template #input>
            <van-uploader v-model="profile"  multiple :max-count="1" />
          </template>
          <template #button>
            <van-button size="small" type="primary" @click="profileUpload" :disabled="uploadDisable">上传</van-button>
          </template>
        </van-field>

        <van-field v-model="username" name="用户名" label="用户名" placeholder="用户名"
                   :rules="[{ required: true, message: '请填写用户名' }]" >
          <template #button>
            <van-button size="small" type="primary" @click="editUsername" :disabled="username === ''">修改</van-button>
          </template>
        </van-field>

        <van-field name="radio" label="性别">
          <template #input>
            <van-radio-group v-model="genderChecked" direction="horizontal" >
              <van-radio name="1">保密</van-radio>
              <van-radio name="2">男</van-radio>
              <van-radio name="3">女</van-radio>
            </van-radio-group>
          </template>
          <template #button>
            <van-button size="small" type="primary" @click="editGender">修改</van-button>
          </template>
        </van-field>

        <van-field v-model="sign" rows="2" autosize label="个性签名" type="textarea" maxlength="80"
                   placeholder="请输入个性签名" show-word-limit >
          <template #button>
            <van-button size="small" type="primary" @click="editSign">修改</van-button>
          </template>
        </van-field>

        <van-field v-model="areaResult" is-link readonly name="area" label="地区" placeholder="点击选择省市区"
                   @click="showArea = true" >
        </van-field>
        <van-popup v-model:show="showArea" position="bottom">
          <van-area
            :area-list="areaList"
            value="000000"
            @confirm="onAreaConfirm"
            @cancel="showArea = false"
          />
        </van-popup>
      </van-cell-group>
    </van-form>
  </div>
</template>

<script>
import { ref, onBeforeMount, watch, nextTick } from 'vue'
import { Icon, NavBar, Form, Button, Field, CellGroup, RadioGroup, Radio, Uploader, Popup, Area, showToast } from 'vant'
import { areaList } from '@vant/area-data' // vant官方提供的默认的中国省市区数据，用于选中地区
import getPersonInfo from '@/api/getPersonInfo'
import uploadProfile from '@/api/uploadProfile'
import getProfile from '@/api/getProfile'
import updateUsername from '@/api/updateUsername'
import updateGender from '@/api/updateGender'
import updateSign from '@/api/updateSign'
import updateArea from '@/api/updateArea'

export default {
  name: 'meetuEditUserInfo',
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Button.name]: Button,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Uploader.name]: Uploader,
    [Popup.name]: Popup,
    [Area.name]: Area,
    [Icon.name]: Icon
  },
  setup () {
    const onClickLeft = () => history.back()
    const profile = ref([])
    const uploadDisable = ref(true)

    const username = ref('') // 用户名
    const genderChecked = ref('1') // 性别
    const sign = ref('') // 个性签名

    areaList.province_list['000000'] = '保密'
    // objArraySort(areaList.province_list)
    // console.log('areaList: ', areaList.province_list)

    const areaResult = ref('保密') // 选择地区
    const showArea = ref(false) // 控制选择地区弹窗的变量
    const onAreaConfirm = async ({ selectedOptions }) => { // 选择地区确认按钮
      if (selectedOptions[0].value === '000000') {
        areaResult.value = '保密'
      } else {
        areaResult.value = selectedOptions.map((item) => item.text).join('/')
      }
      // 将地区信息保存到服务器
      const token = localStorage.getItem('meetu_jwt_token')
      await editArea(areaResult, token)
    }

    onBeforeMount(async () => {
      // 请求服务器拿到当前用户的数据
      const uid = localStorage.getItem('meetu_uid')
      const { data: res } = await getPersonInfo(uid)
      if (res.code === 200) {
        const data = res.data
        profile.value.push({ url: getProfile(data.profile), isImage: true })
        username.value = data.username
        if (data.gender === 'secrecy') genderChecked.value = '1'
        else if (data.gender === 'male') genderChecked.value = '2'
        else if (data.gender === 'female') genderChecked.value = '3'
        sign.value = data.sign
        if (data.area === 'secrecy') areaResult.value = '保密'
        else areaResult.value = data.area
      } else {
        showToast({ message: '网络错误', position: 'bottom' })
      }
    })

    watch(profile, () => {
    //  如果存储头像的变量发生变化
      uploadDisable.value = profile.value.length === 0
    }, { deep: true })

    const profileUpload = async () => {
      if (profile.value.length) {
        profile.value[0].status = 'uploading'
        profile.value[0].message = '上传中...'
        // 上传到服务器
        // base64转Blob
        function convertBase64UrlToBlob (urlData) {
          // 去掉url的头，并转换为byte
          const split = urlData.split(',')
          const bytes = window.atob(split[1])
          // 处理异常,将ascii码小于0的转换为大于0
          const ab = new ArrayBuffer(bytes.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i)
          }
          return new Blob([ab], { type: split[0] })
        }
        const f = convertBase64UrlToBlob(profile.value[0].content) // data为裁剪后的base64位图片
        const fd = new FormData()
        fd.append('file', f, profile.value[0].file.name)
        // 上传图片数据
        const token = localStorage.getItem('meetu_jwt_token')
        const { data: res } = await uploadProfile(fd, token)
        if (res.code === 200) {
          profile.value[0].status = 'done'
          profile.value[0].message = '上传成功'
          showToast('头像上传成功！')
        } else {
          showToast('头像上传失败！')
        }
      }
    }

    const editUsername = async () => {
      // 请求服务器修改用户名
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await updateUsername(username.value, token)
      if (res.code === 200) {
        showToast({ message: '修改成功', position: 'bottom' })
      } else {
        showToast({ message: res.msg, position: 'bottom' })
      }
    }

    const editGender = async () => {
      // 请求服务器修改性别
      const token = localStorage.getItem('meetu_jwt_token')
      let gender
      if (genderChecked.value === '2') gender = 'male'
      else if (genderChecked.value === '3') gender = 'female'

      const { data: res } = await updateGender(gender, token)
      if (res.code === 200) {
        showToast({ message: '修改成功', position: 'bottom' })
      } else {
        showToast({ message: res.msg, position: 'bottom' })
      }
    }

    const editSign = async () => {
      // 请求服务器修改个性签名
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await updateSign(sign.value, token)
      if (res.code === 200) {
        showToast({ message: '修改成功', position: 'bottom' })
      } else {
        showToast({ message: res.msg, position: 'bottom' })
      }
    }
    const editArea = async () => {
      // 请求服务器修改用户的地区信息
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await updateArea(areaResult.value, token)
      if (res.code === 200) {
        showToast({ message: '修改成功', position: 'bottom' })
        nextTick(() => {
          document.querySelector('div.van-overlay').click()
        })
      } else {
        showToast({ message: res.msg, position: 'bottom' })
      }
    }

    return {
      profile,
      uploadDisable,
      username,
      genderChecked,
      sign,
      areaResult,
      showArea,
      onClickLeft,
      areaList,
      onAreaConfirm,
      profileUpload,
      editUsername,
      editGender,
      editSign,
      editArea
    }
  }
}
</script>

<style lang="less">
.form-box {
  width: 100%;
  height: calc(100% - 50px);
  background-color: #eeeded;
  padding-top: 5px;
  .muid-prompt {
    color: #cd93ff;
    text-decoration: underline;
  }
}

</style>
