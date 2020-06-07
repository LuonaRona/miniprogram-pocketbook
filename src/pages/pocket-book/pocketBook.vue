<template>
  <view class="container">
    <cu-custom bgColor="bg-primary-light" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">记一笔</block>
    </cu-custom>
    <pocketbook-type-tab
      :type="type"
      @onTypeChange="onTypeChange($event)">
    </pocketbook-type-tab>
    <view class="pocketbook-option">
      <date-picker
        class="divider"
        :date="date"
        @onSelected="onDateChange($event)">
      </date-picker>
      <account-picker
        class="divider"
        :accountId="accountId"
        @onSelected="onAccountChange($event)">
      </account-picker>
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
      <bookkeeping-icon
        class="grid-item"
        v-for="(icon, index) in currentIconList"
        :index="index"
        :path="icon.path"
        :name="icon.name"
        :color="icon.color"
        :isActived="isActivedIcon(icon)"
        :key="index"
        @click.native="onIconChange(icon)"></bookkeeping-icon>
      <bookkeeping-icon
        class="grid-item"
        path="/static/setting.png"
        name="设置"
        @click.native="toManageIcons">
      </bookkeeping-icon>
    </view>
    <view class="confirm">
      <view
        class="cu-btn bg-primary"
        :disabled="primaryBtnDisabled || currentAccountListIndex < 0"
        @click="submit">提交</view>
      <view
        class="cu-btn text-grey line-grey"
        :disabled="primaryBtnDisabled || currentAccountListIndex < 0"
        v-if="!currentPocketbook"
        @click="toTimedAutoBookkeeping()">开启定时自动记</view>
      <view
        class="cu-btn text-red line-red"
        :disabled="warnBtnDisabled"
        v-if="currentPocketbook"
        @click="deletePocketbook(currentPocketbook)">删除</view>
    </view>
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
  getStartDate,
  getEndDate,
  getYearMonthDayArray
} from '@/utils/index'
import BookkeepingIcon from '@/components/bookkeeping-icon/BookkeepingIcon'
import PocketbookTypeTab from '@/components/pocketbook-type-tab/PocketbookTypeTab'
import DatePicker from '@/components/date-picker/DatePicker'
import AccountPicker from '@/components/account-picker/AccountPicker'

export default {
  name: 'pocket-book',
  components: { PocketbookTypeTab, BookkeepingIcon, DatePicker, AccountPicker },
  data() {
    return {
      type: '支出',
      date: new Date(),
      accountId: '',
      accountName: '',
      description: '',
      amount: null,
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
      return !_.isNil(this.amount) ? this.amount.toString().length > 0 : false
    },
    ...mapGetters({
      accountList: 'getAccountList',
      iconList: 'getBookkeepingTypeByUser',
      currentPocketbook: 'getCurrentPocketbook',
    })
  },
  methods: {
    ...mapMutations([
      'setCurrentTimedAutoPocketbook',
      'addPocketbookToList',
      'updatePocketbookById',
      'removePocketbookById',
    ]),
    toManageIcons() {
      uni.navigateTo({
        url: `/pages/pocket-book/bookkeepingSettings?type=${this.type}`,
      })
    },
    toTimedAutoBookkeeping() {
      this.setCurrentTimedAutoPocketbook({
        account_name: this.accountName,
        ...this.currentIconItem,
        ...this.getSubmitData()
      })
      uni.navigateTo({
        url: '/pages/pocket-book/timedAutoBookkeeping',
      })
    },
    isActivedIcon(icon) {
      return this.currentIconItem.name === icon.name
    },
    onTypeChange(type) {
      this.type = type
      this.getCurrentIconList()
    },
    onDateChange(date) {
      this.date = date
    },
    onAccountChange({accountId, accountName}) {
      this.accountId = accountId
      this.accountName = accountName
    },
    onIconChange(value) {
      this.currentIconItem = value
    },
    submit() {
      if (!this.accountId) { return }
      this.primaryBtnDisabled = true
      this.$refs.loading.show({ title: '提交中' })
      
      const data = this.getSubmitData();
      const oldData = this.currentPocketbook
      const submitData = _.isUndefined(oldData) ? { type: 'add', data }
                                 : { type: 'update', data, oldData }
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'addPocketbook',
        data: submitData
      }).then(({ result }) => {
        if (_.isEqual(submitData.type, 'add')) {
          const _id = result
          this.addPocketbookToList({ _id, ...submitData.data })
        } else {
          const _id = oldData._id
          this.updatePocketbookById({ _id, ...submitData.data})
        }
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '提交成功！',
          type: 'success',
        })
        uni.navigateBack()
      }, () => {
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '提交失败！',
          type: 'error',
        })
      })
    },
    getCurrentIconList() {
      const iconGroupedByType = _.groupBy(this.iconList, 'type')
      const list = iconGroupedByType[this.type]
      if (!_.find(list, this.currentIconItem)) {
        this.currentIconItem = _.head(list)
      }
      this.currentIconList = list
    },
    setDefualtData() {
      const {
        type,
        current_year,
        current_month,
        current_day,
        account_id,
        description,
        amount,
        name, color, path
      } = this.currentPocketbook
      this.onTypeChange(type)
      this.date = new Date(current_year, current_month - 1, current_day, 0, 0, 0)
      this.accountId = account_id
      this.description = description
      this.amount = amount
      this.currentIconItem = { name, color, path }
    },
    deletePocketbook(pocketbook) {
      this.warnBtnDisabled = true
      this.$refs.loading.show({ title: '正在删除...' })

      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'deletePocketbook',
        data: pocketbook
      }).then(() => {
        this.removePocketbookById(pocketbook)
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '删除成功！',
          type: 'success',
        })
        uni.navigateBack()
      }, () => {
        this.$refs.msg.show({
          message: '删除失败！',
          type: 'error',
        })
      })
    },
    getSubmitData() {
      const { type, date, description, currentIconItem, accountId } = this
      const [current_year, current_month, current_day] = getYearMonthDayArray(formatDate(date))
      const amount = parseFloat(precision(this.amount))

      return {
        type,
        account_id: accountId,
        amount: _.isNumber(amount) ? amount : 0,
        current_year,
        current_month,
        current_day,
        description,
        timestamp: new Date().getTime(),
        type_name: currentIconItem.name,
      }
    }
  },
  created() {
    if (!_.isNil(this.currentPocketbook)) {
      this._pocketbook = this.currentPocketbook
      this.setDefualtData()
    }
    this.getCurrentIconList()
  },
  onShow() {
    this.getCurrentIconList()
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  padding-bottom: 50px;
  height: 100%;
  box-sizing: border-box;
}

.pocketbook-option {
  padding: 5px;
  font-size: 12px;
  display: flex;

  .icon {
    width: 22px;
    height: 22px;
  }

  .divider {
    position: relative;
    padding: 0 6px;

    &:after {
      position: absolute;
      top: 20%;
      right: 0;
      content: "";
      width: 1px;
      height: 60%;
      background-color: #606266;
      display: block;
    }
  }

  .desc {
    padding: 0 6px;
    display: flex;
    align-items: center;

    .uni-input {
      min-width: 130px;
    }
  }
}

.pocketbook-data {
  position: relative;
  padding: 0 1rem;
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $primary-color;
  box-sizing: border-box;

  .name {
    color: #fff;
    font-size: 18px;
    white-space: nowrap;
  }

  .uni-input {
    position: relative;
    z-index: 2;
    color: #fff;
    font-size: 26px;
    line-height: 26px;
    height: auto;
    text-align: right;
  }

  .placeholder {
    position: absolute;
    right: 1rem;
    bottom: 50%;
    font-size: 26px;
    color: #ccc;
    opacity: .5;
    transform: translateY(50%);
  }
}

.grid-icons {
  display: flex;
  flex-wrap: wrap;

  .grid-item {
    margin: 5px 0;
    width: 20%;
  }
}

.confirm {
  position: absolute;
  bottom: 0;
  padding: 10px;
  padding-bottom: 5px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  box-sizing: border-box;

  .cu-btn {
    width: 48%;
  }
}
</style>