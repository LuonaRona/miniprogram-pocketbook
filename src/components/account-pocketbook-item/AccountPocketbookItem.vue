<template>
  <view class="pocketbook-item">
    <view class="title">
      <image class="icon-image"
        :src="iconPath"
        :style="'color:' + color"></image>
      <view class="name">
        <text>{{ name }}</text>
        <text class="small-text"
          v-if="description">{{ description }}</text>
      </view>
    </view>
    <view class="amount">
      <text class="operator">{{ operator }}</text>
      <text class="number">{{ amount | amount }}</text>
    </view>
  </view>
</template>
<script>
export default {
  name: 'account-pocketbook-item',
  props: {
    iconPath: String,
    color: String,
    description: String,
    name: String,
    amount: Number,
    type: String,
  },
  computed: {
    operator() {
      return this.type === '收入' ? '+' : '-'
    }
  },
}
</script>
<style lang="scss" scoped>
.pocketbook-item {
  margin: 1rem 0;
  font-size: 16px;
  display: flex;
  justify-content: space-between;

  .title {
    display: inline-flex;
    align-items: flex-start;

    .icon-image {
      margin: 2px 4px 0 0;
      width: 18px;
      height: 18px;
      border: 1px solid;
      border-radius: 100%;
    }

    .name {
      max-width: 150px;

      & > text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
      }
    }

    .small-text {
      color: $regular-text;
    }
  }
}
</style>
