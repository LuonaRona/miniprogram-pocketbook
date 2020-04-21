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
            <view class="icon" :style="'color:' + pocket.color" @click="navigateToEdit(pocket)">
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
import { formatDate, formatMonth, getYearMonthArray } from '@/utils/index'
const now = new Date()

export default {
  name: 'pocket-book',
  data() {
    return {
      income: 0,
      outlay: 0,
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      pocketbookList: [],
      currentMonthIndex: 0,
    }
  },
  computed: {
    ...mapGetters({
      monthList: 'getMonths',
      isLogined: 'isLogined',
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
        this.loadData(year, _month)
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
    loadData(year = this.currentYear, month = this.currentMonth) {
      uni.showLoading({ title: '正在获取数据' })
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'getPocketbookListByMonth',
        data: { year, month },
      }).then(res => {
        uni.hideLoading()
        const pocketbookList = []
        const list = res.result
        this.getCurrentMonthTotal(_.concat([], ..._.values(list)))
        _.forEach(list, (value, key) => {
          pocketbookList.push({
            date: key,
            total: _.sumBy(value, item => {
              return item.amount * (item.type === '收入' ? 1 : -1)
            }),
            list: value
          })
        })
        this.pocketbookList = _.sortBy(pocketbookList, item => - new Date(item.date).getTime())
        this.currentYear = year
        this.currentMonth = month
      }, () => {
        uni.hideLoading()
      })
    },
    getCurrentMonthTotal(list) {
      const group = _.groupBy(list, 'type')
      this.income = _.sumBy(group['收入'], 'amount')
      this.outlay = _.sumBy(group['支出'], 'amount')
    },
    ...mapMutations({
      setCurrentPocketbook: 'setCurrentPocketbook',
    }),
    pageInit() {
      if (this.isLogined) {
        this.loadData()
      } else {
        setTimeout(() => {
          this.pageInit()
        }, 100);
      }
    }
  },
  onShow() {
    this.pageInit()
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
    margin-top: 20rpx;
    padding: 0 1rem;
    border-radius: 1rem;
    border: 1px solid #f1f2f7;
    font-size: 24rpx;
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
  padding: 30rpx 0;
  display: flex;

  &-item {
    padding: 30rpx 20rpx;
    text-align: center;
    flex: 1;

    .label {
      color: #909399;
      font-size: 28rpx;
    }

    .amount {
      font-size: 48rpx;
    }
  }
  
  .pocket-book-btn {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
    width: 160rpx;
    height: 160rpx;
    text-align: center;
    color: #FF6781;
    border: 1px solid;
    border-radius: 100%;
    background-color: #fff;
    z-index: 1;
    cursor: pointer;

    .btn-icon {
      margin-top: 26rpx;
      width: 70rpx;
      height: 65rpx;
      display: inline-block;
    }

    .btn-text {
      font-size: 28rpx;
      display: block;
    }
  }
}
.content {
  height: calc(100% - 298rpx);
  overflow: auto;
}

.list {
  padding-top: 100rpx;
  margin-bottom: 70rpx;
  box-sizing: border-box;

  &-item {
    padding-top: 30rpx;

    &-line {
      margin-top: 40rpx;
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
          width: 16rpx;
          height: 16rpx;
          border-radius: 100%;
          background-color: #ccc;
          display: block;
        }

        & > text {
          padding: 0 1em;
          color: #909399;
          font-size: 28rpx;
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
        width: 70rpx;
        height: 70rpx;
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

      .pocket-book-item {
        width: calc(50% - 35rpx);

        .sub-text {
          font-size: 24rpx;
          color: #909399;
          display: block;
          text-overflow: ellipsis;
        }

        & > text {
          font-size: 32rpx;
          line-height: 32rpx;
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
  font-size: 32rpx;
  font-weight: 300;
  text-align: center;
  display: block;
}
</style>