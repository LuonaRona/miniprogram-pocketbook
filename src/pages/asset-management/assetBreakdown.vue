<template>
  <view class="container">
    <view class="card" :style="detail.bgColor">
      <view class="card-line">
        <view class="card-item">
          <view class="amount large"
            @click="editAmount"
            v-if="!editing">{{ detail.balance | amount }}</view>
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
          <view class="amount">{{ detail.inTotal | amount }}</view>
          <view class="label">累计流入</view>
        </view>
        <view class="card-item">
          <view class="amount">{{ detail.outTotal | amount }}</view>
          <view class="label">累计流出</view>
        </view>
      </view>
    </view>
    <view class="button-group" v-if="editing">
      <button type="default" size="mini" @click="viewAmount">取消</button>
      <button type="primary" size="mini" @click="save" :style="detail.bgColor" :loading="saving">保存</button>
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
        :style="detail.bgColor"
        :disabled="removing"
        :loading="saving"
        @click="navigateToEditAccount(detail)">编辑</button>
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
import { precision, formatDate, formatWeek } from '@/utils/index'

export default {
  name: 'asset-breakdown',
  data() {
    return {
      editing: false,
      saving: false,
      removing: false,
      balance: 0.00,
      detail: {
        bgColor: 'background-color: #fff',
        balance: 0.00,
        inTotal: 0.00,
        outTotal: 0.00,
      },
      pocketbookList: [],
    }
  },
  computed: {
    ...mapGetters({
      iconList: 'getBookkeepingTypeList',
    })
  },
  filters: { formatDate, formatWeek },
  methods: {
    navigateToEditAccount(data) {
      this.setCurrentAccount(data)
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
    sumByType(list) {
      return _.sumBy(list, item =>{
        return item.amount * (item.type === '收入' ? 1 : -1)
      })
    },
    getIconData(item) {
      console.log(item)
      return _.find(this.iconList, {
        name: item.type_name
      })
    },
    formatPocketbookList(list) {
      const pocketbookGroup = _.groupBy(list,
        item => `${item.current_year}.${item.current_month}.${item.current_day}`)

      const pocketbookList = _.map(pocketbookGroup, (list, key) => {
        return {
          date: key,
          total: this.sumByType(list),
          list: _.map(list, item => Object.assign({ ...item, ...this.getIconData(item) }))
        }
      });
      console.log(pocketbookList)

      return _.sortBy(pocketbookList, item => - new Date(item.date).getTime())
    },
    ...mapMutations(['setCurrentAccount'])
  },
  onLoad(e) {
    uni.showLoading({ title: '正在获取数据' })
    const { id, name } = e;
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'getAccountDetail',
      data: { id }
    }).then(({ result }) => {
      this.detail = result
      this.pocketbookList = this.formatPocketbookList(result.pocketbookList)
      uni.hideLoading()
    })
    uni.setNavigationBarTitle({
      title: name,
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  padding: 0 1rem;
  padding-bottom: 100px;
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