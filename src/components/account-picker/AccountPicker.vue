<template>
  <view class="account">
    <image class="icon" src="/static/asset-management.png"></image>
    <picker class="picker"
      :value="currentAccountListIndex"
      :range="accountList"
      range-key="name"
      @change="onChange($event)">
      <view class="uni-input"
            :class="{ 'text-red': currentAccountListIndex < 0}">
        {{ currentAccountListIndex >= 0 ? accountList[currentAccountListIndex].name : '账户不存在' }}
      </view>
    </picker>
  </view>
</template>
<script>
import * as _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'account-picker',
  props: {
    accountId: String,
  },
  data() {
    return {
      currentAccountListIndex: 0,
    }
  },
  computed: {
    ...mapGetters({
      accountList: 'getAccountList',
    })
  },
  methods: {
    getAccount() {
      const currentItem = this.accountList[this.currentAccountListIndex]
      
      return {
        accountId: currentItem._id,
        accountName: currentItem.name
      }
    },
    onChange({ target: { value } }) {
      this.currentAccountListIndex = value
      this.$emit('onSelected', this.getAccount())
    },
  },
  created() {
    const account_id = this.accountId
    if (account_id) {
      this.currentAccountListIndex = _.findIndex(this.accountList, account => _.isEqual(account._id, account_id))
      if (this.currentAccountListIndex < 0) {
        this.$emit('onSelected', {
          accountId: '',
          accountName: '',
        });
      }
    } else {
      this.$emit('onSelected', this.getAccount())
    }
  },
}
</script>
<style lang="scss" scoped>
.account {
  font-size: 14px;
  display: flex;
  align-items: center;

  .icon {
    width: 22px;
    height: 22px;
  }
}
</style>