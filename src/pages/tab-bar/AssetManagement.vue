<template>
  <view class="page">
    <cu-custom bgColor="bg-primary-light" :isBack="false">
      <block slot="backText">
        <user-info></user-info>
      </block>
      <block slot="content">我的资产</block>
    </cu-custom>
    <view class="section">
      <view class="asset-details">
        <asset-details
          :netAssets="myAssets.netAssets"
          :debtAssets="myAssets.debtAssets"
          :totalAssets="myAssets.totalAssets">
        </asset-details>
      </view>
      <view class="list">
        <account-list :list="accounts"></account-list>
      </view>
    </view>
  </view>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import AssetDetails from '@/components/asset-details/AssetDetails'
import AccountList from '@/components/account-list/AccountList'

export default {
  name: 'asset-management',
  components: { AssetDetails, AccountList },
  computed: {
    ...mapGetters({
      myAssets: 'getMyAssets',
      accounts: 'getAccountList',
    })
  }
}
</script>
<style lang="scss" scoped>
.asset-details {
  height: 85px;
  background-color: $white;
}

.list {
  padding: 0 1rem 1rem 1rem;
  position: relative;
  height: calc(100% - 85px);
  overflow: hidden;
  background-color: #F2F6FC;
}
</style>