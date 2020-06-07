<template>
  <view class="cu-modal" :class="{ 'show': isShow }">
    <view class="cu-dialog">
      <view class="cu-bar bg-white justify-center">
        <view class="content">创建用户</view>
      </view>
      <view class="padding-xl">
        <input
          v-model="name"
          placeholder="请设置用户名！(2-16个字符)"
          name="input"
          maxlength="16"
          autofocus>
      </view>
      <view class="cu-bar bg-white justify-center">
        <view class="action">
          <button
            class="cu-btn bg-primary margin-left"
            :disabled="nameInvalid"
            @tap="submit">立即创建</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'create-user',
  data() {
    return {
      name: '',
      isShow: true,
    }
  },
  computed: {
    nameInvalid() {
      const length = this.name.length
      return length < 2 || length > 16
    }
  },
  methods: {
    showModal() {
      this.isShow = true
    },
    hideModal() {
      this.isShow = false
    },
    submit() {
      this.$emit('submit', this.name)
    }
  }
}
</script>