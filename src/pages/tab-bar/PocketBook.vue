<template>
  <view class="page">
    <cu-custom bgColor="bg-primary-light" :isBack="false">
      <block slot="backText">
        <user-info></user-info>
      </block>
      <block slot="content">记一笔</block>
    </cu-custom>
    <view class="section">
      <view class="month-selector">
        <picker class="month-picker"
          :value="currentMonthIndex"
          :range="monthList"
          @change="onMonthChange">
          <text class="cu-btn line-primary round">{{ monthList[currentMonthIndex] }}</text>
        </picker>
      </view>
      <view class="month-total">
        <month-total
          :currentMonth="currentMonth"
          :income="income"
          :outlay="outlay">
        </month-total>
      </view>
      <view class="pocketbook-button">
        <pocketbook-button @click.native="navigateToCreate">记一笔</pocketbook-button>
      </view>
      <view class="content">
        <pocketbook-list
          :list="pocketbookList">
        </pocketbook-list>
      </view>
    </view>
    <loading ref="loading"></loading>
    <message ref="msg"></message>
  </view>
</template>
<script>
import * as _ from 'lodash'
import { mapMutations, mapGetters } from 'vuex'
import {
  formatDate,
  formatMonth,
  getYearMonthArray,
  getTotalByType,
  getDateString,
  sortBy,
} from '@/utils/index'
import PocketbookButton from '@/components/pocketbook-button/PocketbookButton'
import PocketbookList from '@/components/pocketbook-list/PocketbookList'
import MonthTotal from '@/components/month-total/MonthTotal'
import CreateUser from '@/components/create-user/CreateUser'
const now = new Date()

export default {
  name: 'pocket-book',
  components: { MonthTotal, PocketbookButton, PocketbookList, CreateUser },
  filters: { formatDate },
  data() {
    return {
      income: 0,
      outlay: 0,
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      currentMonthIndex: 0,
      pocketbookList: [],
    }
  },
  computed: {
    ...mapGetters({
      monthList: 'getMonths',
      isLogined: 'isLogined',
      allPocketbookList: 'getPocketbookList',
    })
  },
  methods: {
    onMonthChange({ target: { value } }) {
      const [year, month] = getYearMonthArray(this.monthList[value])
      const _month = _.isNaN(month) ? now.getMonth() + 1 : month

      if (!_.isEqual(this.currentMonth, _month) ||
          !_.isEqual(this.currentYear, year)) {
        this.currentMonthIndex = value
        this.getPocketBookListByMonth(year, _month)
      }
    },
    navigateTo() {
      uni.navigateTo({
        url: '/pages/pocket-book/pocketBook',
      })
    },
    navigateToCreate() {
      this.setCurrentPocketbook(undefined)
      this.navigateTo()
    },
    getCurrentMonthTotal(list) {
      const group = _.groupBy(list, 'type')
      this.income = _.sumBy(group['收入'], 'amount')
      this.outlay = _.sumBy(group['支出'], 'amount')
    },
    getPocketBookListByMonth(year, month) {
      const pocketbookList = []
      const list = _.filter(this.allPocketbookList, pocketbook => {
        return _.isEqual(year, pocketbook.current_year) &&
               _.isEqual(month, pocketbook.current_month)
      })
      this.getCurrentMonthTotal(list)

      const groupedByDay = _.groupBy(list, (item) => {
        return getDateString(item.current_year, item.current_month, item.current_day)
      })
      _.forEach(groupedByDay, (value, key) => {
          pocketbookList.push({
            date: key,
            list: sortBy(value, 'timestamp', true),
            total: getTotalByType(value),
          })
        })

      this.pocketbookList = sortBy(pocketbookList, 'date', true)
      this.currentYear = year
      this.currentMonth = month
    },
    ...mapMutations({
      setCurrentPocketbook: 'setCurrentPocketbook',
    }),
    onPageInit() {
      if (this.isLogined && this.allPocketbookList.length) {
        this.getPocketBookListByMonth(this.currentYear, this.currentMonth)
        this.$refs.loading.hide()
      } else {
        setTimeout(() => {
          this.onPageInit()
        }, 200);
      }
    }
  },
  onShow() {
    this.$refs.loading.show()
    this.onPageInit()
  }
}
</script>
<style lang="scss" scoped>
.month-selector {
  padding: 7px 0 5px 0;
  text-align: center;

  .month-picker {
    padding: 0 1rem;
    border-radius: 1rem;
    font-size: 12px;
    line-height: 2;
    display: inline-block;
  }

  .cu-btn {
    height: 28px;
  }
}

.month-total {
  margin-bottom: -40px;
}

.pocketbook-button {
  padding: 5px 0;
  width: 100%;
  z-index: 1;
  background-color: $white;
  text-align: center;
}

.content {
  height: calc(100% - 200px);
  overflow: auto;
}

</style>