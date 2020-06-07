<template>
  <view
    class="message animation-slide-top"
    :style="colorStyle"
    ref="msg"
    v-if="isShow"
    @click="hide">
    <text
      class="icon"
      :class="iconClass"></text>
    <text class="text">{{ message }}</text>
  </view>
</template>
<script>
export default {
  name: 'message',
  data() {
    return {
      message: '消息提示',
      type: 'info',
      isShow: false,
    }
  },
  computed: {
    iconClass() {
      const iconNames = {
        success: 'roundcheckfill',
        error: 'roundclosefill',
        warn: 'warnfill',
        info: 'infofill',
      }
      return 'cuIcon-' + iconNames[this.type]
    },
    colorStyle() {
      const t = this.type
      const colors = {
        success: '#67C23A',
        error: '#F56C6C',
        warn: '#E6A23C',
        info: '#909399',
      }
      const bgColor = {
        success: '#f0f9eb',
        error: '#fef0f0',
        warn: '#fdf6ec',
        info: '#edf2fc',
      }
      const borderColor = {
        success: '#c2e7b0',
        error: '#fbc4c4',
        warn: '#f5dab1',
        info: '#d3d4d6',
      }

      return `color: ${colors[t]};background-color: ${bgColor[t]};border-color: ${borderColor[t]}`
    }
  },
  methods: {
    show(options) {
      if (!options.message) return

      const { message, type = 'default' } = options
      this.message = message
      this.type = type
      this.isShow = true

      setTimeout(() => this.hide(), 1500);
    },
    hide() {
      this.isShow = false
    }
  },
}
</script>
<style lang="scss" scoped>
.message {
  position: absolute;
  top: 80px;
  left: calc(50% - 60px);
  padding: 7px 15px;
  font-size: 14px;
  border: 1upx solid;
  border-radius: 5px;
  color: $primary-text;
  z-index: 9999;
  opacity: 0;

  .icon {
    margin-right: 10px;
    color: inherit;
  }

  .text {
    color: inherit;
  }
}
</style>