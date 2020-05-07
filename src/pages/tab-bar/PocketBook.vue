<template>
  <view class="container">
    <view class="month-selector">
      <picker class="month-picker"
        :value="currentMonthIndex"
        :range="monthList"
        @change="onMonthChange">
        <text>{{ monthList[currentMonthIndex] }}</text>
      </picker>
    </view>
    <view class="header v-line">
      <view class="header-item">
        <view class="label">{{ currentMonth }}月收入</view>
        <view class="amount">{{ income | amount }}</view>
      </view>
      <view class="header-item">
        <view class="label">{{ currentMonth }}月支出</view>
        <view class="amount">{{ outlay | amount }}</view>
      </view>
      <view class="pocket-book-btn" @click="navigateToCreate">
        <image src="/static/pocket-book-pencil.png" class="btn-icon"></image>
        <text class="btn-text">记一笔</text>
      </view>
    </view>
    <view class="content">
      <view class="list v-line" v-if="pocketbookList.length">
        <view class="list-item" v-for="pocketbook in pocketbookList" :key="pocketbook.date">
          <view class="list-item-line total">
            <text>{{ pocketbook.date | formatDate }}</text>
            <text>{{ pocketbook.total | amount }}</text>
          </view>
          <view class="list-item-line" v-for="pocket in pocketbook.list" :key="pocket._id" :class="pocket.type === '收入' ? 'lt' : 'rt'">
            <view class="icon" :class="{'automatic': pocket.automatic }" :style="'color:' + pocket.color" @click="navigateToEdit(pocket)">
              <image :src="pocket.path"></image>
            </view>
            <view class="pocket-book-item">
              <text class="type">{{ pocket.type_name }}</text>
              <text class="amount">{{ pocket.amount | amount }}</text>
              <text class="sub-text">{{ pocket.description }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="empty-text" v-else>你本月还没有开始记录哦</view>
    </view>
  </view>
</template>
<script>
import * as _ from 'lodash'
import { mapMutations, mapGetters } from 'vuex'
import { formatDate, formatMonth, getYearMonthArray, getTotalByType, getDateString, sortBy } from '@/utils/index'
const now = new Date()

export default {
  name: 'pocket-book',
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
  filters: { formatDate },
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
    navigateToEdit(pocketbook) {
      this.setCurrentPocketbook(pocketbook)
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
      } else {
        setTimeout(() => {
          this.onPageInit()
        }, 200);
      }
    }
  },
  onShow() {
    this.onPageInit()
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
.month-selector {
  text-align: center;

  .month-picker {
    margin-top: 10px;
    padding: 0 1rem;
    border-radius: 1rem;
    border: 1px solid #f1f2f7;
    font-size: 12px;
    line-height: 1.8;
    display: inline-block;
  }
}
.v-line {
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    display: block;
    background-color: #f1f2f7;
    z-index: -1;
  }
}
.header {
  position: relative;
  padding: 15px 0;
  display: flex;

  &-item {
    padding: 15px 10px;
    text-align: center;
    flex: 1;

    .label {
      color: #909399;
      font-size: 14px;
    }

    .amount {
      font-size: 24px;
    }
  }
  
  .pocket-book-btn {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
    width: 80px;
    height: 80px;
    text-align: center;
    color: #FF6781;
    border: 1px solid;
    border-radius: 100%;
    background-color: #fff;
    z-index: 1;
    cursor: pointer;

    .btn-icon {
      margin-top: 13px;
      width: 35px;
      height: 32.5px;
      display: inline-block;
    }

    .btn-text {
      font-size: 14px;
      display: block;
    }
  }
}
.content {
  height: calc(100% - 149px);
  overflow: auto;
}

.list {
  padding-top: 50px;
  margin-bottom: 35px;
  box-sizing: border-box;

  &-item {
    padding-top: 15px;

    &-line {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.lt {
        justify-content: flex-end;
        flex-direction: row-reverse;

        .pocket-book-item {
          text-align: right;

          & > text {
            margin: 0;
            margin-right: .5rem;
          }
        }
      }

      &.rt {
        justify-content: flex-end;
        flex-direction: row;

        .pocket-book-item {
          text-align: left;

          & > text {
            margin: 0;
            margin-left: .5rem;
          }
        }
      }

      &.total {
        position: relative;

        &:after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-45%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background-color: #ccc;
          display: block;
        }

        & > text {
          padding: 0 1em;
          color: #909399;
          font-size: 14px;
          flex: 1;

          &:first-of-type {
            text-align: right;
          }

          &:last-of-type {
            text-align: left;
          }
        }
      }

      .icon {
        position: relative;
        width: 35px;
        height: 35px;
        border-radius: 100%;
        border: 1px solid;
        background-color: #fff;
        display: inline-block;
        box-sizing: border-box;

        & > image {
          width: 80%;
          height: 80%;
          transform: translate(11%, 10%);
        }
      }

      .automatic {
        &:after {
          content: "Auto";
          position: absolute;
          top: -7px;
          left: 50%;
          font-size: 12px;
          line-height: 1;
          transform: translate(-50%, -100%);
        }
      }

      .pocket-book-item {
        width: calc(50% - 17.5px);

        .sub-text {
          font-size: 12px;
          color: #909399;
          display: block;
          text-overflow: ellipsis;
        }

        & > text {
          font-size: 16px;
          line-height: 16px;
        }
      }
    }
  }
}
.empty-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  color: #666;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  display: block;
}
</style>