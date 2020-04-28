<template>
  <view class="container">
    <view class="pocketbook-type">
      <view class="outlay"
        :class="{'actived': isActivedTab('支出')}"
        @click="onTypeChange('支出')">支出</view>
      <view class="income"
        :class="{'actived': isActivedTab('收入')}"
        @click="onTypeChange('收入')">收入</view>
      <view class="h-line"
        :style="{ 'transform': isActivedTab('支出') ? 'translateX(0)' : 'translateX(100%)'}"></view>
    </view>
    <view class="pocketbook-option">
      <view class="date v-line">
        <image class="icon" src="/static/date.png"></image> 
        <picker class="picker" mode="date" :value="date" :start="startDate" :end="endDate" @change="onDateChange">
          <view class="uni-input">{{ date | formatDate }}</view>
        </picker>
      </view>
      <view class="account v-line">
        <image class="icon" src="/static/asset-management.png"></image>
        <picker class="picker"
          :value="currentAccountListIndex"
          :range="accountList"
          range-key="name"
          @change="onAccountChange">
          <view class="uni-input"
                :class="{ 'error': currentAccountListIndex < 0}">
            {{ accountList[currentAccountListIndex].name || '账户不存在' }}
          </view>
        </picker>
      </view>
      <view class="desc">
        <image class="icon" src="/static/desc.png"></image>
        <input type="text" class="uni-input" v-model="description" placeholder="写点啥备注下">
      </view>
    </view>
    <view class="pocketbook-data" :style="'background-color: ' + currentIconItem.color">
      <text class="name">{{ currentIconItem.name }}</text>
      <input class="uni-input"
        type="digit"
        v-model="amount"
        confirm-type="done"
        @confirm="submit"
        autofocus>
      <text class="placeholder" v-if="!hasValue">0.00</text>
    </view>
    <view class="grid-icons" v-if="currentIconList.length">
      <view class="grid-item"
        v-for="(icon, index) in currentIconList"
        :index="index"
        :key="index"
        :class="{'actived': isActivedIcon(icon)}"
        :style="'color:' + icon.color"
        @click="onIconChange(icon)">
        <view class="image-icon">
          <image :src="icon.path"></image>
        </view>
        <text class="text" :class="{'default-color': !isActivedIcon(icon)}">{{ icon.name }}</text>
      </view>
      <view class="grid-item" @click="toManageIcons()">
        <view class="image-icon">
          <image src="/static/setting.png"></image>
        </view>
        <text class="text default-color">设置</text>
      </view>
    </view>
    <view class="confirm">
      <button type="primary"
        class="primary-btn"
        :disabled="primaryBtnDisabled || currentAccountListIndex < 0"
        @click="submit">提交</button>
      <button type="default"
        v-if="!currentPocketbook"
        class="primary-btn"
        :disabled="primaryBtnDisabled || currentAccountListIndex < 0"
        @click="submit">定时自动记</button>
      <button type="warn"
        v-if="currentPocketbook"
        class="delete-btn"
        :disabled="warnBtnDisabled"
        @click="deletePocketbook(currentPocketbook)">删除</button>
    </view>
  </view>
</template>

<script>
import * as _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { precision, formatDate, getStartDate, getEndDate, getYearMonthDayArray } from '@/utils/index'

export default {
  name: 'pocket-book',
  data() {
    return {
      type: '支出',
      currentAccountListIndex: 0,
      date: new Date(),
      startDate: getStartDate(),
      endDate: getEndDate(),
      description: '',
      amount: undefined,
      currentIconList: [],
      currentIconItem: {
        name: '水电煤',
        color: '#987a4a',
        path: '/static/icons/sdm.png',
      },
      warnBtnDisabled: false,
      primaryBtnDisabled: false,
    }
  },
  filters: { formatDate },
  computed: {
    hasValue() {
      return !_.isUndefined(this.amount) ? this.amount.toString().length > 0 : false
    },
    ...mapGetters({
      accountList: 'getAccountList',
      iconList: 'getBookkeepingTypeByUser',
      currentPocketbook: 'getCurrentPocketbook',
    })
  },
  methods: {
    ...mapActions(['updateMonths']),
    toManageIcons() {
      uni.navigateTo({
        url: '/pages/pocket-book/bookkeepingSettings',
      })
    },
    isActivedTab(type) {
      return this.type === type
    },
    isActivedIcon(icon) {
      return this.currentIconItem.name === icon.name
    },
    onTypeChange(type) {
      this.type = type
      this.getCurrentIconList()
    },
    onAccountChange({ target: { value } }) {
      this.currentAccountListIndex = value
    },
    onDateChange({ target: { value } }) {
      this.date = value
    },
    onIconChange(value) {
      this.currentIconItem = value
    },
    submit() {
      if (this.currentAccountListIndex < 0) { return }

      this.primaryBtnDisabled = true
      uni.showLoading({ title: '正在提交数据...' })
      const { type, date, description, currentIconItem, currentAccountListIndex } = this
      const account_id = this.accountList[currentAccountListIndex]._id
      const [current_year, current_month, current_day] = getYearMonthDayArray(formatDate(date))
      const amount = parseFloat(precision(this.amount))
      const data = {
        type,
        account_id,
        amount: _.isNumber(amount) ? amount : 0,
        current_year,
        current_month,
        current_day,
        description,
        timestamp: new Date(`${current_year}/${current_month}/${current_day}`).getTime(),
        type_name: currentIconItem.name,
      };
      const oldData = this.currentPocketbook
      const submitData = _.isUndefined(oldData) ? { type: 'add', data }
                                 : { type: 'update', data, oldData }
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'addPocketbook',
        data: submitData
      }).then(() => {
        this.updateMonths()
        uni.hideLoading()
        uni.navigateBack()
      }, () => {
        uni.hideLoading()
        uni.navigateBack()
      })
    },
    getCurrentIconList() {
      const iconGroupedByType = _.groupBy(this.iconList, 'type')
      const list = iconGroupedByType[this.type]

      if (!_.isEmpty(list)) {
        this.currentIconList = list
        this.currentIconItem = _.head(list)
      }
    },
    setDefualtData() {
      const {
        type,
        timestamp,
        account_id,
        description,
        amount,
        name, color, path
      } = this.currentPocketbook
      this.onTypeChange(type)
      this.date = new Date(timestamp)
      this.currentAccountListIndex = _.findIndex(this.accountList, account => _.isEqual(account._id, account_id))
      this.description = description
      this.amount = amount
      this.currentIconItem = { name, color, path }
    },
    deletePocketbook(pocketbook) {
      this.warnBtnDisabled = true
      uni.showLoading({ title: '正在删除...' })
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'deletePocketbook',
        data: pocketbook
      }).then(() => {
        uni.hideLoading()
        uni.navigateBack()
      }, () => {
        uni.navigateBack()
      })
    }
  },
  created() {
    if (!_.isUndefined(this.currentPocketbook)) {
      this._pocketbook = this.currentPocketbook
      this.setDefualtData()
    }
  },
  onShow() {
    this.getCurrentIconList()
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  padding-bottom: 100rpx;
  height: 100%;
  box-sizing: border-box;
}

.pocketbook-option {
  padding: 10rpx;
  font-size: 24rpx;
  display: flex;

  .icon, .picker, .uni-input {
    display: inline-block;
    vertical-align: middle;
  }

  .uni-input {
    font-size: 28rpx;

    &.error {
      color: #F56C6C;
    }
  }

  .icon {
    width: 46rpx;
    height: 46rpx;
  }

  .picker {
    padding: 0 .4rem 0 .2rem;
  }

  .v-line {
    position: relative;

    &:after {
      position: absolute;
      top: 20%;
      right: 0;
      content: "";
      width: 1px;
      height: 60%;
      background-color: #666;
      display: block;
    }
  }

  .date, .account {
    margin-right: 10rpx;
    white-space: nowrap;
  }

  .desc {
    white-space: nowrap;

    .uni-input {
      width: 260rpx;
    }
  }
}
.pocketbook-type {
  position: relative;
  padding: 0 50rpx;
  box-sizing: border-box;
  display: flex;
  
  .income, .outlay {
    padding: 0 10rpx;
    font-size: 28rpx;
    font-weight: bold;
    line-height: 2;
    text-align: center;
    flex: 1;
    cursor: pointer;

    &.actived {
      color: #FF6781;
    }
  }

  .h-line {
    position: absolute;
    width: calc(50% - 50rpx);
    height: 4rpx;
    bottom: 0;
    border-radius: 4rpx;
    background-color: #FF6781;
    transform: translateX(0);
    transition: .3s all ease;
  }
}

.pocketbook-data {
  position: relative;
  padding: 0 1rem;
  height: 130rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FF6781;
  box-sizing: border-box;

  .name {
    color: #fff;
    font-size: 36rpx;
    white-space: nowrap;
  }

  .uni-input {
    position: relative;
    z-index: 2;
    color: #fff;
    font-size: 52rpx;
    line-height: 52rpx;
    height: auto;
    text-align: right;
  }

  .placeholder {
    position: absolute;
    right: 1rem;
    bottom: 50%;
    font-size: 52rpx;
    color: #ccc;
    opacity: .5;
    transform: translateY(50%);
  }
}

.grid-icons {
  display: flex;
  flex-wrap: wrap;

  .grid-item {
    margin: 10rpx 0;
    width: 20%;
    font-size: 28rpx;
    text-align: center;
    cursor: pointer;

    &.actived {
      .image-icon {
        border: 1px solid;
      }
    }

    .image-icon {
      margin: 10rpx auto;
      width: 68rpx;
      height: 68rpx;
      color: inherit;
      border-radius: 100%;
      border: 1px solid transparent;

      & > image {
        margin-top: 4rpx;
        width: 60rpx;
        height: 60rpx;
      }
    }

    .text.default-color {
      color: #303133;
    }
  }

}
.confirm {
  position: absolute;
  bottom: 0;
  padding: 20rpx;
  padding-bottom: 10rpx;
  width: 100%;
  display: flex;
  justify-content: space-around;
  box-sizing: border-box;

  .primary-btn, .delete-btn {
    font-size: 16px;
    flex: 1;

    &:after {
      border: 1px solid;
      color: inherit;
    }

    & + .primary-btn {
      margin-left: 10rpx;
      color: #666;
      background: transparent;
    }
  }

  .delete-btn {
    margin-left: 10rpx;
    color: $uni-color-error;
    background: transparent;
  }
}
</style>