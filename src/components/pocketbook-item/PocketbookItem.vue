<template>
  <view class="pocketbook-item" :class="showDirection">
    <view
      class="icon"
      :class="{'automatic': automatic }"
      :style="'color:' + color">
      <image :src="iconPath"></image>
    </view>
    <view class="content">
      <text class="type">{{ typeName }}</text>
      <text class="amount">{{ amount | amount }}</text>
      <text class="small-text">{{ description }}</text>
    </view>
  </view>
</template>
<script>
export default {
  name: 'pocketbook-item',
  props: {
    iconPath: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    typeName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    automatic: {
      type: Boolean,
      required: true,
    },
    showDirection: {
      type: String,
      required: true,
    },
    routeLink: String,
  }
}
</script>

<style lang="scss" scoped>
.automatic {
  &:after {
    content: "Auto";
    position: absolute;
    top: -1px;
    left: 50%;
    font-size: 12px;
    line-height: 1;
    transform: translate(-50%, -100%);
    background-color: $white;
  }
}

.pocketbook-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &.rtl {
    flex-direction: row-reverse;

    .content {
      text-align: right;
    }
  }

  .icon {
    position: relative;
    min-width: 35px;
    width: 35px;
    height: 35px;
    border-radius: 100%;
    border: 1px solid;
    background-color: #fff;
    display: inline-block;
    box-sizing: border-box;

    & > image {
      width: 80%;
      height: 80%;
      transform: translate(11%, 10%);
    }
  }

  .content {
    margin: 0 6px;
    width: calc(100% - 47px);

    .type {
      margin-right: 5px;
    }
  }

  .small-text {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>