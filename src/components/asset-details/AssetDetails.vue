<template>
  <view class="asset-details">
    <view class="net-assets">
      <view class="amount">
        <text>{{ netAssets | amount }}</text>
      </view>
      <text class="label">净资产</text>
    </view>
    <view class="asset-situation">
      <view>
        <text class="label">负债</text>
        <text class="amount">{{ debtAssets | amount }}</text>
      </view>
      <view>
        <text class="label">资产</text>
        <text class="amount">{{ totalAssets | amount }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'asset-details',
  props: {
    netAssets: Number,
    debtAssets: Number,
    totalAssets: Number,
  }
}
</script>

<style lang="scss" scoped>
.asset-details {
  padding: 1rem 1.5rem;
  height: 100%;
  border-bottom: 1px dashed $light-grey;
  background-color: $white;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  .net-assets {
    .amount, .label {
      margin-left: 1rem;
    }

    .amount {
      font-size: 20px;
    }

    .label {
      font-size: 14px;
      color: $secondary-text;
    }
  }

  .asset-situation {
    .label {
      margin-right: .7rem;
      font-size: 12px;
      color: $secondary-text;
      vertical-align: middle;
    }

    .amount {
      font-size: 17px;
      vertical-align: middle;
    }
  }
}
</style>