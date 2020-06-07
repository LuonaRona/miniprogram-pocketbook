<template>
  <view class="account-list-item"
    :style="color"
    v-if="isDefault">
    <view class="account">
      <image :src="iconPath" class="account-icon"></image>
      <view class="account-content">
        <text class="account-name">{{ name }}</text>
        <text class="account-description" v-if="desc">{{ desc }}</text>
      </view>
    </view>
    <view class="account-balance">{{ balance | amount }}</view>
  </view>
  <view class="account-list-item add" v-else>
    <image src="/static/add.png" class="account-icon">
    <text class="account-text">添加账户</text>
  </view>
</template>
<script>
const DEFAULT = 'default'

export default {
  name: 'account-list-item',
  props: {
    type: String,
    name: String,
    iconPath: String,
    desc: String,
    balance: Number,
    color: String,
  },
  computed: {
    isDefault() {
      return this.type !== 'add'
    }
  }
}
</script>
<style lang="scss" scoped>
.account-list-item {
  width: 100%;
  margin-bottom: 20px;
  padding: .7rem 1rem;
  color: #fff;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: inherit;

  &.add {
    text-align: center;
    color: $uni-border-color;
    border: 1px dashed;
    justify-content: center;
  }

  .account {
    display: flex;
    align-items: center;

    &-content {
      width: 160px;
      height: 38px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    &-icon {
      margin-right: 5px;
      min-width: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      display: inline-block;
    }

    &-name {
      width: 100%;
      font-size: 14px;
      display: block;
    }

    &-description {
      width: 100%;
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: block;
    }
  }
}
</style>