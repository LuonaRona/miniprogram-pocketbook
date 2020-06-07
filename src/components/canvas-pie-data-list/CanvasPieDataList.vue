<template>
  <view class="list">
    <view class="list-item" v-for="pocket in list" :key="pocket.name">
      <view class="title">
        <image class="title-icon"
          :src="pocket.path"
          :style="'color:' + pocket.color"></image>
        <text>{{ pocket.name }}</text>
      </view>
      <text class="percentage">{{ pocket.percentage }}</text>
      <text class="sub-total">{{ pocket.data | amount }}</text>
    </view>
  </view>
</template>
<script>
export default {
  name: 'canvas-pie-data-list',
  props: {
    list: Array
  }
}
</script>
<style lang="scss" scoped>
.list {
  height: 180px;
  background-color: $light-grey;
  overflow: auto;

  &-item {
    padding: .5rem 1rem .5rem .7rem;
    border-bottom: 1px dashed $light-grey;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    background-color: $white;

    .title, .percentage, .sub-total {
      flex: 1;
    }

    .title {
      text-align: left;
      display: flex;

      &-icon {
        margin-right: .3rem;
        width: 20px;
        height: 20px;
        border: 1px solid;
        border-radius: 100%;
      }
    }

    .percentage {
      text-align: center;
    }

    .sub-total {
      text-align: right;
    }
  }
}
</style>