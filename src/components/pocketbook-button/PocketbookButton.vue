<template>
  <view class="pocket-book-btn cu-btn round line-primary">
    <image src="/static/pocket-book-pencil.png" class="btn-icon"></image>
    <text class="btn-text"><slot></slot></text>
  </view>
</template>
<style lang="scss" scoped>
  .pocket-book-btn {
    width: 80px;
    height: 80px;
    text-align: center;
    color: $primary-color;
    border-radius: 100%;
    background-color: $white;
    cursor: pointer;
    display: inline-block;

    .btn-icon {
      margin-top: 13px;
      width: 35px;
      height: 32.5px;
      display: inline-block;
    }

    .btn-text {
      font-size: 14px;
      display: block;
    }
  }
</style>