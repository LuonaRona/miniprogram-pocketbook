<template>
  <view class="cu-load load-modal" v-if="isShow">
    <image src="@/static/pocket-book-pencil.png" mode="aspectFit"></image>
    <view class="text-primary">{{ title }}</view>
  </view>
</template>
<script>
export default {
  name: 'loading',
  data() {
    return {
      isShow: false,
      title: 'loading...',
    }
  },
  methods: {
    show(options = {}) {
      if (options.title) {
        this.title = options.title
      }
      this.isShow = true
    },
    hide() {
      this.title = 'loading...'
      this.isShow = false
    }
  },
}
</script>
<style lang="scss" scoped>
.cu-load {
  background: rgba(255, 255, 255, .9);
}
</style>