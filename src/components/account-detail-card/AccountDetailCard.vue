<template>
  <view class="card" :style="bgColor">
      <view class="card-row underline">
        <view class="card-item">
          <view class="amount large">{{ _balance | amount }}</view>
          <view class="label" v-if="isCurrentYear">当前余额</view>
          <view class="label" v-else>{{ year }}年总结余</view>
        </view>
      </view>
      <view class="card-row">
        <view class="card-item">
          <view class="amount">{{ inTotal | amount }}</view>
          <view class="label">
            <text v-if="!isCurrentYear">{{ year }}年</text>
            <text>累计流入</text>
          </view>
        </view>
        <view class="card-item">
          <view class="amount">{{ outTotal | amount }}</view>
          <view class="label">
            <text v-if="!isCurrentYear">{{ year }}年</text>
            <text>累计流出</text>
          </view>
        </view>
      </view>
    </view>
</template>
<script>
export default {
  name: 'account-detail-card',
  props: {
    balance: Number,
    inTotal: Number,
    outTotal: Number,
    bgColor: String,
    year: Number,
  },
  computed: {
    isCurrentYear() {
      return this.year === new Date().getFullYear()
    },
    _balance() {
      return this.isCurrentYear ? this.balance : this.inTotal - this.outTotal
    }
  },
}
</script>
<style lang="scss" scoped>
.card {
  padding: .8rem 2rem;
  color: $white;
  border-radius: 8px;

  &-row {
    display: flex;

    .amount {
      font-size: 18px;

      &.large {
        font-size: 26px;
      }
    }

    .label {
      font-size: 12px;
      line-height: 2;
    }
  }

  .underline {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, .5);
    }
  }

  &-item {
    padding: 10px 5px;
    text-align: center;
    flex: 1;
  }
}
</style>