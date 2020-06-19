<template>
  <view style="height: 100%">
    <cu-custom bgColor="bg-primary-light" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{ accountDetail.name }}账户</block>
    </cu-custom>
    <view class="container">
      <swiper
        class="card-swiper round-dot"
        indicator-color="#8799a3"
        indicator-active-color="#0081ff"
        :indicator-dots="false"
        :circular="false"
        :autoplay="false"
        @change="cardSwiper">
        <swiper-item
          v-for="(item, index) in pocketbookList"
          :key="index"
          :class="currentCardIndex === index ? 'cur' : ''">
          <account-detail-card
            class="swiper-item"
            :balance="accountDetail.balance"
            :inTotal="item.inTotal"
            :outTotal="item.outTotal"
            :year="item.year"
            :bgColor="accountDetail.bgColor">
          </account-detail-card>
        </swiper-item>
      </swiper>
      <view class="list" v-if="pocketbookList[currentCardIndex].list.length">
        <account-pocketbook-groups
          :year="pocketbook.year"
          :month="pocketbook.month"
          :inTotal="pocketbook.inTotal"
          :outTotal="pocketbook.outTotal"
          :defaultShow="!index"
          :list="pocketbook.list"
          v-for="(pocketbook, index) in pocketbookList[currentCardIndex].list"
          :key="'pocketbook_' + index">
        </account-pocketbook-groups>
      </view>
      <view class="list" v-else>
        <view class="empty-text">当前账户没有数据</view>
      </view>
    </view>
    <view class="button-group footer">
      <view
        class="cu-btn bg-primary"
        :style="accountDetail.bgColor"
        :disabled="removing"
        :loading="saving"
        @click="navigateToEditAccount">编辑</view>
      <view
        class="cu-btn text-primary line-primary"
        :disabled="saving"
        :loading="removing"
        @click="confirmModalVisible = true">删除</view>
    </view>

    <cu-modal
      confirm
      modalTitle="删除操作"
      :visible.sync="confirmModalVisible"
      v-if="confirmModalVisible"
      @onCancel="confirmModalVisible = false"
      @onConfirm="deleteCurrentAccount">
      <view class="padding-xl">
        <text class="text-red">确定要删除 [ {{ accountDetail.name }} ] 账户吗？</text>
      </view>
    </cu-modal>
    <loading ref="loading"></loading>
    <message ref="msg"></message>
  </view>
</template>
<script>
import * as _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import {
  precision,
  formatDate,
  formatWeek,
  getIconStyleByTypename,
  getDateString,
  getTotalByType,
  sortBy,
} from '@/utils/index'
import AccountDetailCard from '@/components/account-detail-card/AccountDetailCard'
import AccountPocketbookGroups from '@/components/account-pocketbook-groups/AccountPocketbookGroups'

export default {
  name: 'asset-breakdown',
  components: { AccountDetailCard, AccountPocketbookGroups },
  data() {
    return {
      currentCardIndex: 0,
      editing: false,
      saving: false,
      removing: false,
      confirmModalVisible: false,
      pocketbookList: [],
    }
  },
  computed: {
    ...mapGetters({
      iconList: 'getBookkeepingTypeList',
      accountDetail: 'getCurrentAccount',
      allPocketbookList: 'getPocketbookList',
    })
  },
  filters: { formatDate, formatWeek },
  methods: {
    cardSwiper(e) {
      this.currentCardIndex = e.detail.current
    },
    navigateToEditAccount() {
      uni.navigateTo({
        url: '/pages/asset-management/addAccount',
      })
    },
    onConfirm() {
      this.$refs.message()
    },
    deleteCurrentAccount() {
      this.removing = true
      this.$refs.loading.show({ title: '正在删除...' })
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'deleteAccount',
        data: this.accountDetail
      }).then(() => {
        this.removing = false
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '删除成功！',
          type: 'success'
        })
        this.deleteAccountById(this.accountDetail._id)
        uni.navigateBack()
      }, () => {
        this.removing = false
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '删除失败！',
          type: 'error'
        })
      })
    },
    getIconData(item) {
      const iconStyle = getIconStyleByTypename(this.iconList, item.type_name)
      return { ...item, ...iconStyle }
    },
    getGroupedByYearPocketbookList(list) {
      const group = _.groupBy(list, 'current_year')
      
      return _.map(group, (pocketbooklist, key) => {
        const year = parseInt(key)
        const pocketbookGroupedByType = _.groupBy(pocketbooklist, 'type')
        const inTotal = _.sumBy(pocketbookGroupedByType['收入'], 'amount')
        const outTotal = _.sumBy(pocketbookGroupedByType['支出'], 'amount')
        const list = this.getGroupedByMonthPocketbookList(pocketbooklist, year)

        return { year, inTotal, outTotal, list: sortBy(list, 'month', true) }
      })
    },
    getGroupedByMonthPocketbookList(list, year) {
      const group = _.groupBy(list, 'current_month')

      return _.map(group, (pocketbooklist, key) => {
        const month = parseInt(key)
        const pocketbookGroupedByType = _.groupBy(pocketbooklist, 'type')
        const inTotal = _.sumBy(pocketbookGroupedByType['收入'], 'amount')
        const outTotal = _.sumBy(pocketbookGroupedByType['支出'], 'amount')
        const list = this.formatPocketbookList(pocketbooklist)

        return { year, month, inTotal, outTotal, list }
      })
    },
    formatPocketbookList(list) {
      const pocketbookList = []
      const pocketbookGroup = _.groupBy(list, (item) => {
        return getDateString(item.current_year, item.current_month, item.current_day)
      })

      _.forEach(pocketbookGroup, (value, key) => {
          const currentList = _.map(value, item => this.getIconData(item))

          pocketbookList.push({
            date: key,
            total: getTotalByType(value),
            list: sortBy(currentList, 'timestamp', true),
          })
        })

      return sortBy(pocketbookList, 'date', true)
    },
    getPocketbookList(id) {
      const pocketbookList = _.filter(this.allPocketbookList, (pocketbook) => {
        return _.isEqual(id, pocketbook.account_id)
      })
      if (pocketbookList.length) {
        return sortBy(this.getGroupedByYearPocketbookList(pocketbookList), 'year', true)
      } else {
        return [{
          year: new Date().getFullYear(),
          inTotal: 0,
          outTotal: 0,
          list: [],
        }]
      }
    },
    ...mapMutations(['setCurrentAccount', 'deleteAccountById'])
  },
  created() {
    const { _id, name } = this.accountDetail
    this.pocketbookList = this.getPocketbookList(_id)
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: calc(100% - 148px);
  overflow: auto;
  background-color: $light-grey;
}

.card-swiper {
  height: 225px !important;
  border-bottom: 1px dashed $light-grey;
  background-color: $white;
}

.footer {
  width: 100%;
  height: 60px;
}

.button-group {
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;

  .cu-btn {
    width: 48%;
  }
}

.list {
  flex: 1 1 auto;
  overflow: auto;
}
</style>