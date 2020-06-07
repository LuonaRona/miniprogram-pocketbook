<template>
  <view class="pocketbook-group">
    <view class="hd-line">
      <view class="date">
        <text>{{ date | getDateCnMonthAndDate }}</text>
        <text>{{ date | formatWeek }}</text>
      </view>
      <view class="total">
        <text class="operator" v-if="isPositiveInteger">+</text>
        <text class="number">{{ total | amount }}</text>
      </view>
    </view>
    <account-pocketbook-item
      :iconPath="pocket.path"
      :color="pocket.color"
      :name="pocket.name"
      :amount="pocket.amount"
      :type="pocket.type"
      :description="pocket.description"
      v-for="pocket in list"
      :key="pocket._id">
    </account-pocketbook-item>
  </view>
</template>
<script>
import AccountPocketbookItem from '@/components/account-pocketbook-item/AccountPocketbookItem'
import { getDateCnMonthAndDate, formatWeek } from '@/utils/index'

export default {
  name: 'account-pocketbook-group',
  components: { AccountPocketbookItem },
  filters: { getDateCnMonthAndDate, formatWeek },
  props: {
    total: Number,
    date: String,
    list: Array,
  },
  computed: {
    isPositiveInteger() {
      return this.total > 0
    }
  },
}
</script>
<style lang="scss" scoped>
.pocketbook-group {
  padding: 0 1rem;
  border-top: 1px solid #e9e9e9;
  overflow: hidden;
  background-color: $light-grey;
}

.hd-line {
  padding-top: 15px;
  font-size: 14px;
  color: $regular-text;
  display: flex;
  justify-content: space-between;

  .date {
    text + text {
      margin-left: .5em;
    }
  }
}
</style>