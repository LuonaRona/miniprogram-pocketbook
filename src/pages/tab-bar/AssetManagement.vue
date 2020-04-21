<template>
  <view class="container">
    <view class="top-fixed">
      <view class="net-assets">
        <view class="amount">
          <text>{{ netAssets | amount }}</text>
        </view>
        <text class="label">净资产</text>
      </view>
      <view class="asset-situation">
        <view>
          <text class="label">负债</text>
          <text class="amount">{{ debt | amount }}</text>
        </view>
        <view>
          <text class="label">资产</text>
          <text class="amount">{{ assets | amount }}</text>
        </view>
      </view>
    </view>
    <view class="account-list">
      <text class="line-count">全部账户({{ accountList.length }})</text>
      <view class="account-items">
        <view class="account-item"
          v-for="account in accountList"
          :key="account.name"
          :style="account.bgColor"
          @click="navigateTo(account._id, account.name)">
          <view class="account-name">
            <image :src="account.iconPath" class="account-icon"></image>
            <text class="account-text">{{ account.name }}</text>
          </view>
          <view class="account-balance">{{ account.balance | amount }}</view>
        </view>
        <!-- <view class="account-item add">
          <image src="/static/add.png" class="account-icon">
          <text class="account-text">添加账户</text>
        </view> -->
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'asset-management',
  data() {
    return {
      netAssets: 0,
      debt: 0,
      assets: 0,
      accountList: [],
    }
  },
  methods: {
    navigateTo(id, name) {
      uni.navigateTo({
        url: `/pages/asset-management/assetBreakdown?id=${id}&name=${name}`,
      })
    },
    loadData() {
      uni.showLoading({ title: '正在获取数据' })
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'getAccountList',
      }).then(response => {
        const result = response.result

        this.netAssets = result.netAssets
        this.assets = result.assets
        this.debt = result.debt
        this.accountList = result.list
        uni.hideLoading()
      }, () => {
        uni.hideLoading()
      })
    }
  },
  onShow() {
    this.loadData()
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;

  .top-fixed {
    height: 170rpx;
  }

  .account-list {
    position: relative;
    padding: 1rem;
    padding-top: 0;
    height: calc(100% - 170rpx);
    overflow: hidden;
    box-sizing: border-box;
    background-color: #F2F6FC;

    .line-count {
      font-size: 28rpx;
      line-height: 80rpx;
      height: 80rpx;
      display: block;
    }
  }
}

.top-fixed {
  padding: 1rem 1.5rem;
  border-bottom: 1px dashed #f1f2f7;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  .net-assets {
    .amount, .label {
      margin-left: 1rem;
    }

    .amount {
      font-size: 40rpx;
    }

    .label {
      font-size: 28rpx;
      color: #909399;
    }
  }

  .asset-situation {
    .label {
      margin-right: .7rem;
      font-size: 24rpx;
      color: #909399;
      vertical-align: middle;
    }

    .amount {
      font-size: 34rpx;
      vertical-align: middle;
    }
  }
}

.account-items {
  height: calc(100% - 80rpx);
  overflow: auto;
}

.account-item {
  margin-bottom: 40rpx;
  padding: 1rem;
  color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  display: flex;
  justify-content: space-between;
  background: inherit;

  &.add {
    color: #C0C4CC;
    border: 1px dashed;
    justify-content: center;
  }

  .account-icon, .account-text {
    vertical-align: middle;
  }

  .account-icon {
    margin-right: 10rpx;
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
  }
}
</style>