<template>
  <view class="container">
    <view class="top-fixed">
      <view class="net-assets">
        <view class="amount">
          <text>{{ myAssets.netAssets | amount }}</text>
        </view>
        <text class="label">净资产</text>
      </view>
      <view class="asset-situation">
        <view>
          <text class="label">负债</text>
          <text class="amount">{{ myAssets.debtAssets | amount }}</text>
        </view>
        <view>
          <text class="label">资产</text>
          <text class="amount">{{ myAssets.totalAssets | amount }}</text>
        </view>
      </view>
    </view>
    <view class="account-list" v-if="myAssets.accounts">
      <text class="line-count">全部账户({{ myAssets.accounts.length }})</text>
      <view class="account-items">
        <view class="account-item"
          v-for="account in myAssets.accounts"
          :key="account._id"
          :style="account.bgColor"
          @click="navigateToDetail(account)">
          <view class="account-name">
            <image :src="account.iconPath" class="account-icon"></image>
            <view class="account-title">
              <text class="title">{{ account.name }}</text><br>
              <text class="description">{{ account.description }}</text>
            </view>
          </view>
          <view class="account-balance">{{ account.balance | amount }}</view>
        </view>
        <view class="account-item add" @click="navigateToAddAccount" v-if="accountList.length < 20">
          <image src="/static/add.png" class="account-icon">
          <text class="account-text">添加账户</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters({
      myAssets: 'getMyAssets',
    })
  },
  methods: {
    navigateToDetail(data) {
      this.setCurrentAccount(data)
      uni.navigateTo({
        url: '/pages/asset-management/assetBreakdown',
      })
    },
    navigateToAddAccount() {
      this.setCurrentAccount(undefined)
      uni.navigateTo({
        url: '/pages/asset-management/addAccount',
      })
    },
    ...mapMutations(['setCurrentAccount'])
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;

  .top-fixed {
    height: 85px;
  }

  .account-list {
    position: relative;
    padding: 1rem;
    padding-top: 0;
    height: calc(100% - 85px);
    overflow: hidden;
    box-sizing: border-box;
    background-color: #F2F6FC;

    .line-count {
      font-size: 14px;
      line-height: 40px;
      height: 40px;
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
      font-size: 20px;
    }

    .label {
      font-size: 14px;
      color: #909399;
    }
  }

  .asset-situation {
    .label {
      margin-right: .7rem;
      font-size: 12px;
      color: #909399;
      vertical-align: middle;
    }

    .amount {
      font-size: 17px;
      vertical-align: middle;
    }
  }
}

.account-items {
  height: calc(100% - 40px);
  overflow: auto;
}

.account-item {
  margin-bottom: 20px;
  padding: 1rem;
  color: #fff;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: inherit;

  &.add {
    color: #C0C4CC;
    border: 1px dashed;
    justify-content: center;
  }

  .account-name {
    display: flex;
    align-items: center;
  }

  .account-title {
    display: inline-block;

    .description {
      width: 160px;
      display: block;
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .account-icon {
    margin-right: 5px;
    min-width: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
  }
}
</style>