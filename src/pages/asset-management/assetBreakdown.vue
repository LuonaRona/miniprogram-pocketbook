<template>
  <view class="container">
    <view class="card" :style="accountDetail.bgColor">
      <view class="card-line">
        <view class="card-item">
          <view class="amount large"
            v-if="!editing">{{ accountDetail.balance | amount }}</view>
          <input class="uni-input"
            type="digit"
            v-model="balance"
            focus
            v-else/>
          <view class="label">账户余额</view>
        </view>
      </view>
      <view class="card-line">
        <view class="card-item">
          <view class="amount">{{ inTotal | amount }}</view>
          <view class="label">累计流入</view>
        </view>
        <view class="card-item">
          <view class="amount">{{ outTotal | amount }}</view>
          <view class="label">累计流出</view>
        </view>
      </view>
    </view>
    <view class="button-group" v-if="editing">
      <button type="default" size="mini" @click="viewAmount">取消</button>
      <button type="primary" size="mini" @click="save" :style="accountDetail.bgColor" :loading="saving">保存</button>
    </view>
    <view class="list" v-if="pocketbookList.length">
      <view class="list-item" v-for="pocketbook in pocketbookList" :key="pocketbook.date">
        <view class="list-item-date">
          <view class="date">
            <text>{{ pocketbook.date | formatDate }}</text>
            <text>{{ pocketbook.date | formatWeek }}</text>
          </view>
          <view class="amount">
            <text class="operator" v-if="pocketbook.total > 0">+</text>
            <text class="number">{{ pocketbook.total | amount }}</text>
          </view>
        </view>
        <view
          class="list-item-pocketbook"
          v-for="pocket in pocketbook.list"
          :key="pocket._id">
          <view class="title">
            <image :src="pocket.path" class="icon-image" :style="'color:' + pocket.color"></image>
            <text>{{ pocket.name }}</text>
          </view>
          <view class="amount">
            <text class="operator">{{ pocket.type === '收入' ? '+': '-' }}</text>
            <text class="number">{{ pocket.amount | amount }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="button-group footer" v-if="!editing">
      <button
        type="primary"
        :style="accountDetail.bgColor"
        :disabled="removing"
        :loading="saving"
        @click="navigateToEditAccount()">编辑</button>
      <button
        type="delete"
        :disabled="saving"
        :loading="removing"
        @click="deleteCurrentAccount">删除</button>
    </view>
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

export default {
  name: 'asset-breakdown',
  data() {
    return {
      editing: false,
      saving: false,
      removing: false,
      inTotal: 0,
      outTotal: 0,
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
    navigateToEditAccount() {
      uni.navigateTo({
        url: '/pages/asset-management/addAccount',
      })
    },
    deleteCurrentAccount() {
      this.removing = true
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'deleteAccount',
        data: this.detail
      }).then(() => {
        this.removing = false
        uni.navigateBack()
      }, () => {
        this.removing = false
      })
    },
    editAmount() {
      this.balance = precision(this.detail.balance)
      this.editing = true
    },
    viewAmount() {
      this.saving = false
      this.editing = false
    },
    save() {
      this.saving = true
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'updateBalanceByAccount',
        data: {
          accountId: this.detail._id,
          balance: parseFloat(this.balance),
        }
      }).then((res) => {
        this.detail.balance = this.balance
        this.viewAmount()
      }, () => {
        this.viewAmount()
      })
    },
    getIconData(item) {
      const iconStyle = getIconStyleByTypename(this.iconList, item.type_name)
      return { ...item, ...iconStyle }
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
      const pocketbookGroupedByType = _.groupBy(pocketbookList, 'type')
      this.inTotal = _.sumBy(pocketbookGroupedByType['收入'], 'amount')
      this.outTotal = _.sumBy(pocketbookGroupedByType['支出'], 'amount')

      return this.formatPocketbookList(pocketbookList)
    },
    ...mapMutations(['setCurrentAccount'])
  },
  created() {
    const { _id, name } = this.accountDetail
    uni.setNavigationBarTitle({
      title: name,
    })
    this.pocketbookList = this.getPocketbookList(_id)
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  padding: 0 1rem;
  padding-bottom: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.card {
  margin: 10px 0;
  padding: .3rem 2rem;
  color: #fff;
  border-radius: 8px;

  &-line {
    border-bottom: 1px solid #fff;
    display: flex;

    .amount {
      font-size: 18px;

      &.large {
        font-size: 26px;
      }
    }

    .label {
      font-size: 12px;
    }

    &:last-of-type {
      border-bottom: 0;
    }
  }

  &-item {
    padding: 10px 5px;
    text-align: center;
    flex: 1;
  }
}

.uni-input {
  font-size: 26px;
  height: 1.42em;

  &::placeholder {
    color: #fff;
  }
}

.button-group {
  margin-top: 10px;
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;

  button {
    margin-left: 1px;
    flex: 1;

    & + button {
      margin-left: 10px;
    }
  }
}

.list {
  flex: 1 1 auto;
  overflow: auto;

  &-item {
    &-date {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #909390;

      .date {
        text + text {
          margin-left: .5em;
        }
      }
    }

    &-pocketbook {
      margin: 18px 0;
      font-size: 16px;
      display: flex;
      justify-content: space-between;

      .title {
        display: inline-flex;
        align-items: center;

        .icon-image {
          margin-right: 4px;
          width: 18px;
          height: 18px;
          border: 1px solid;
          border-radius: 100%;
        }
      }
    }
  }
}

.footer {
  position: absolute;
  bottom: 20px;
  width: calc(100% - 2rem);

  button {
    font-size: 16px;
    line-height: 2.2;
  }
}
</style>