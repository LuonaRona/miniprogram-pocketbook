<template>
  <view
    class="bookkeeping-icon"
    :style="'color:' + color"
    :class="{'actived': isActived}">
    <view class="image-icon">
      <image :src="path" :alt="name"></image>
      <image class="badge-icon" 
        :src="badgeIconPath"
        v-if="badgeIconPath"></image>
    </view>
    <text class="text"
      :class="{'default-color': !isActived}">
      {{ name }}</text>
  </view>
</template>
<script>
export default {
  name: 'bookkeeping-icon',
  props: {
    path: String,
    name: String,
    color: String,
    isActived: Boolean,
    badgeIconPath: String,
  }
}
</script>
<style lang="scss" scoped>
.bookkeeping-icon {
  font-size: 14px;
  text-align: center;
  cursor: pointer;

  &.actived {
    .image-icon {
      border: 1px solid;
    }
  }

  .image-icon {
    position: relative;
    margin: 5px auto;
    width: 34px;
    height: 34px;
    color: inherit;
    border-radius: 100%;
    border: 1px solid transparent;

    & > image {
      margin-top: 2px;
      width: 30px;
      height: 30px;
    }

    .badge-icon {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 20px;
      height: 20px;
    }
  }

  .text.default-color {
    color: $primary-text;
  }
}
</style>