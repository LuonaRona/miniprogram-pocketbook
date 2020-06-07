<template>
  <view class="date">
    <image class="icon" src="/static/date.png"></image> 
    <picker
      class="picker"
      mode="date"
      :value="date"
      :start="startDate"
      :end="endDate"
      @change="onChange($event)">
      <view class="uni-input">{{ date | formatDate }}</view>
    </picker>
  </view>
</template>
<script>
import { getStartDate, getEndDate, formatDate } from '@/utils/index'

export default {
  name: 'date-picker',
  filters: { formatDate },
  props: {
    date: {
      type: String | Date,
      default() {
        return new Date()
      },
    }
  },
  data() {
    return {
      startDate: getStartDate(),
      endDate: getEndDate(),
    }
  },
  methods: {
    onChange({ target: { value } }) {
      this.$emit('onSelected', value)
    }
  },
}
</script>

<style lang="scss" scoped>
.date {
  font-size: 14px;
  display: flex;
  align-items: center;

  .icon {
    width: 22px;
    height: 22px;
  }
}
</style>