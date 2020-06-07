<template>
  <view class="container flex-between v-line">
    <view class="container-item">
      <view class="label-text">{{ currentMonth }}月收入</view>
      <view class="amount">{{ income | amount }}</view>
    </view>
    <view class="container-item">
      <view class="label-text">{{ currentMonth }}月支出</view>
      <view class="amount">{{ outlay | amount }}</view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'month-total',
  props: {
    currentMonth: Number,
    income: Number,
    outlay: Number
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  padding: 15px 0;

  &-item {
    padding: 15px 10px;
    text-align: center;
    flex: 1;
  }

  .amount {
    font-size: 24px;
    line-height: 30px;
  }
}

</style>