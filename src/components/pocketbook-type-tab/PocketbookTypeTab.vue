<template>
  <view class="pocketbook-type">
    <view class="outlay"
      :class="{ 'actived': !isIncome }"
      @click="$emit('onTypeChange', '支出')">支出</view>
    <view class="income"
      :class="{ 'actived': isIncome }"
      @click="$emit('onTypeChange', '收入')">收入</view>
    <view class="h-line"
      :style="{ 'transform': isIncome ? 'translateX(100%)' : 'translateX(0)'}"></view>
  </view>
</template>
<script>
export default {
  name: 'pocketbook-type-tab',
  props: {
    type: String
  },
  computed: {
    isIncome() {
      return this.type === '收入'
    }
  }
}
</script>
<style lang="scss" scoped>
.pocketbook-type {
  position: relative;
  padding: 0 25px;
  box-sizing: border-box;
  display: flex;
  
  .income, .outlay {
    padding: 0 5px;
    font-size: 14px;
    font-weight: bold;
    line-height: 2;
    text-align: center;
    flex: 1;
    cursor: pointer;

    &.actived {
      color: $primary-color;
    }
  }

  .h-line {
    position: absolute;
    width: calc(50% - 25px);
    height: 2px;
    bottom: 0;
    border-radius: 2px;
    background-color: $primary-color;
    transform: translateX(0);
    transition: .3s all ease;
  }
}
</style>