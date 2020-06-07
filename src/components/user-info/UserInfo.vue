<template>
  <view class="user-info">
    <view class="user-pic">{{ chart }}</view>
    <text class="user-name">{{ userName }}</text>
  </view>
</template>

<script>
import cnchar from 'cnchar'
import { mapGetters } from 'vuex'

export default {
  name: 'user-info',
  computed: {
    chart() {
      return this.userName.spell()[0]
    },
    ...mapGetters(['userName'])
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-pic {
  margin-right: .4rem;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 16px;
  color: $white;
  border-radius: 100%;
  background-color: #409EFF;
}

.user-name {
  font-size: 12px;
  width: 6.5em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>