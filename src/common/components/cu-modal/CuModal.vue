<template>
  <view class="cu-modal" :class="{ 'show': visible }">
    <view class="cu-dialog">
      <view class="cu-bar bg-white justify-end">
        <view class="content">{{ modalTitle }}</view>
        <view class="action" @tap="hideModal" v-if="showCloseButton">
          <text class="cuIcon-close text-red"></text>
        </view>
      </view>
      <view>
        <slot></slot>
      </view>
      <view class="cu-bar bg-white justify-center" v-if="confirm">
        <view class="action">
          <button class="cu-btn line-grey text-grey" @tap="$emit('onCancel')">取消</button>
          <button class="cu-btn bg-primary margin-left" @tap="$emit('onConfirm')">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'cu-modal',
  props: {
    modalTitle: {
      type: String,
      default() {
        return '提示'
      }
    },
    showCloseButton: {
      type: Boolean,
      default() {
        return true
      }
    },
    confirm: Boolean,
    visible: Boolean,
  },
  methods: {
    hideModal() {
      this.$emit('update:visible', false)
    }
  },
  mounted() {
    console.log(this.visible)
  },
}
</script>