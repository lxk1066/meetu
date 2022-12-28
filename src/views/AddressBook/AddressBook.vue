<template>
  <van-nav-bar title="通讯录" />
  <div class="function-area">
    <div class="function-item notice">通知</div>
    <div class="function-item add-friends" @click="showSearchFriendPopup=true">添加好友</div>
    <SearchFriend v-if="showSearchFriendPopup" @closePopup="showSearchFriendPopup=false"></SearchFriend>
  </div>
  <div class="address-book">
    <van-index-bar :index-list="indexAlphabet">
      <div v-for="(item, index1) in indexAlphabet" :key="index1">
        <van-index-anchor :index="item" >{{item}}</van-index-anchor>
        <van-cell clickable v-for="(friend, index2) in indexedFriends[item]" :key="index2" :title="friend.name"
                  :to="{ name: 'detail', params: { uid: friend.id } }" />
      </div>
    </van-index-bar>
    <van-empty
      v-if="!allFriends.length"
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      image-size="80"
      description="这里空空如也，一个好友都没有~"
      style="margin-top: 20px;"
    />
  </div>
</template>

<script>
import { ref, onBeforeMount } from 'vue'
import { NavBar, IndexBar, IndexAnchor, Cell, Empty, showFailToast } from 'vant'
import SearchFriend from '@/components/AddressBook/SearchFriend'
import getAllFriends from '@/api/getAllFriends'
import getMuidUserInfo from '@/api/getMuidUserInfo'
import pinyin from 'js-pinyin'
export default {
  name: 'meetuAddressBook',
  components: {
    [NavBar.name]: NavBar,
    [IndexAnchor.name]: IndexAnchor,
    [IndexBar.name]: IndexBar,
    [Cell.name]: Cell,
    [Empty.name]: Empty,
    SearchFriend
  },
  setup () {
    const allFriends = ref([])
    const indexAlphabet = ref([])
    const indexedFriends = ref({})
    const showSearchFriendPopup = ref(false)
    onBeforeMount(async () => {
      const token = localStorage.getItem('meetu_jwt_token')
      const { data: res } = await getAllFriends(token)
      if (res.code === 200) {
        const { friends } = res.data
        for (const item of friends) {
          const { data: result } = await getMuidUserInfo(item)
          if (result.code === 200) {
            allFriends.value.push({ id: result.data.uid, username: result.data.username })
          }
        }
      } else {
        showFailToast('网络错误')
      }
      const { alphabet, resultData } = getIndexedData(allFriends.value)
      indexAlphabet.value = alphabet
      indexedFriends.value = resultData
    })
    const getIndexedData = (source) => {
      pinyin.setOptions({ checkPolyphone: false, charCase: 0 })
      const alphabet = [] // 索引字母数组
      source = source.map(item => ({ name: item.username, id: item.id }))
      source.forEach(item => {
        const name = item.name
        // 获取每一个name值第一个字的大写首字母（传入的 name 是中文时默认得到大写字母，name 是英文时按照原字符串输出，可能是小写）
        const initial = pinyin.getCamelChars(name).substring(0, 1).toUpperCase()
        item.initial = initial
        // 获取用于索引的字母
        if (alphabet.indexOf(initial) === -1) {
          alphabet.push(initial)
        }
      })
      // 按字母表顺序排序
      alphabet.sort()

      const resultData = {}
      // 将源数据按照首字母分类
      alphabet.forEach(item => {
        resultData[item] = source.filter((it) => {
          return it.initial === item
        })
      })
      return { alphabet, resultData }
    }

    return { allFriends, indexAlphabet, indexedFriends, showSearchFriendPopup }
  }
}
</script>

<style lang="less" scoped>
.function-area {
  margin-top: 10px;
  display: flex;
  justify-content: space-evenly;
  .function-item {
    font-size: 16px;
    color: white;
    width: 40%;
    height: 50px;
    display: inline-block;
    border-radius: 20px;
    text-align: center;
    line-height: 50px;
    background: linear-gradient(145deg,#c2ffd8,#465efb);
    &:active {
      background: linear-gradient(145deg, #aefac9, #2a44ec);
    }
  }
  .notice {
  }
  .add-friends {
  }
}
.address-book {
  margin-top: 10px;
}
</style>
