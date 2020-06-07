<template>
  <view class="line-list">
    <view class="line-list-item hd">
      <text>时间</text>
      <text>支出</text>
      <text>收入</text>
      <text>结余</text>
    </view>
    <view class="line-list-content">
      <view class="line-list-item" v-for="row in list" :key="row.date">
        <text>{{ row.date }}</text>
        <text>{{ row.outTotal | amount }}</text>
        <text>{{ row.inTotal | amount }}</text>
        <text>{{ row.cashSurplusTotal | amount }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'canvas-line-data-list',
  props: {
    list: Array
  },
}
</script>
<style lang="scss" scoped>
.line-list {
  height: 180px;

  &-content {
    height: calc(100% - 25px);
    overflow: auto;
  }

  &-item {
    padding: 8px 8px;
    font-size: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

    &.hd {
      padding-top: 0;
      padding-bottom: 0;
      height: 25px;
      line-height: 25px;
      color: $secondary-text;
      background-color: $light-grey;
    }

    & > text {
      padding: .2rem;
      flex: 1;

      &:first-of-type {
        color: $secondary-text;
      }
    }
  }
}
</style>