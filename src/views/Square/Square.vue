<template>
  <div class="square-container">
    <div class="square-header">
      <div class="header-left">
        <van-icon name="add" size="25" />
      </div>
      <div class="header-title">
        <h3>广场</h3>
      </div>
      <div class="header-right">
        <van-icon name="photograph" size="25" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant'

export default {
  name: 'meetuSquare',
  components: { [Icon.name]: Icon }
}
</script>

<style lang="less" scoped>
.square-container {
  width: 100%;
  min-height: calc(100% - 60px);
  background-color: #efefef;
  .square-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left, .header-right {
      margin: 0 10px;
    }
  }
}
</style>
