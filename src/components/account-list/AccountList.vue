<template>
  <view class="account-list">
    <text class="line-count">全部账户({{ totalAccounts }})</text>
    <view class="items">
      <account-list-item
        v-for="account in list"
        :balance="account.balance"
        :color="account.bgColor"
        :desc="account.description"
        :iconPath="account.iconPath"
        :name="account.name"
        :key="account._id"
        @click.native="navigateToDetail(account)">
      </account-list-item>
      <account-list-item type="add"     
        @click.native="navigateToAddAccount">
      </account-list-item>
    </view>
  </view>
</template>

<script>
import { mapMutations } from 'vuex'
import AccountListItem from '@/components/account-list-item/AccountListItem'

export default {
  name: 'account-list',
  components: { AccountListItem },
  props: {
    list: Array,
  },
  computed: {
    totalAccounts() {
      return this.list.length
    }
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
  },
}
</script>
<style lang="scss" scoped>
.account-list {
  width: 100%;
  height: 100%;
  overflow: auto;

  .line-count {
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    display: block;
  }

  .items {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
}
</style>
