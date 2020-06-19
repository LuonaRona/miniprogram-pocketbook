<template>
  <view class="container">
    <cu-custom bgColor="bg-primary-light" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">定时自动记账</block>
    </cu-custom>
    <view class="preview">
      <view class="pocket-book">
        <view class="pocket-book-icon"
          :style="'color:' + currentPocketbook.color">
          <image :src="currentPocketbook.path"></image>
        </view>
        <view class="pocket-book-info">
          <text class="type">{{ currentPocketbook.type_name }}</text>
          <text class="amount">{{ currentPocketbook.amount | amount }}</text>
          <text class="sub-text">
            <text>{{ currentPocketbook.account_name }}</text>
            <text>{{ currentPocketbook.type }}</text>
            <text>{{ currentPocketbook.description }}</text>
          </text>
        </view>
      </view>
      <view class="text-primary" @click="goBack">返回修改</view>
    </view>
    <view class="list">
      <view class="list-item">
        <text class="label">重复</text>
        <view class="content">
          <switch style="transform: scale(.7)"
            :checked="isRepeat"
            @change="onCheckedChange"></switch>
        </view>
      </view>
      <template v-if="!isRepeat">
        <view class="list-item">
          <text class="label">记账日期</text>
          <view class="content">
            <picker class="picker"
              mode="date"
              :value="date"
              @change="onDateChange">
              <view class="uni-input">{{ date | formatDateAsText }}</view>
            </picker>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="list-item">
          <text class="label">重复方式</text>
          <view class="content">
            <picker class="picker"
              mode="multiSelector"
              range-key="label"
              :range="duplicateModeMultiOption"
              :value="duplicateModeValue"
              @columnchange="onColumnChange"
              @change="onDuplicateModeChange">
              <view class="uni-input">{{ duplicateModeValue | getDuplicateModeText }}</view>
            </picker>
          </view>
        </view>
        <view class="list-item">
          <text class="label">开始时间</text>
          <view class="content">
            <picker class="picker"
              mode="date"
              :value="startDate"
              @change="onStartDateChange">
              <view class="uni-input">{{ startDate | formatDateAsText }}</view>
            </picker>
          </view>
        </view>
        <view class="list-item">
          <text class="label">结束时间</text>
          <view class="content">
            <picker class="picker"
              mode="date"
              :value="endDate"
              @change="onEndDateChange">
              <view class="uni-input" v-if="endDate">{{ endDate | formatDateAsText }}</view>
              <view class="placeholder" v-else>一直开启(可手动结束)</view>
            </picker>
          </view>
        </view>
      </template>
    </view>
    <view class="confirm">
      <view
        class="cu-btn bg-primary"
        :loading="saving"
        @click="save">保存</view>
      <view class="cu-btn line-grey icon-btn" @click="openHistoryList">
        <text class="cuIcon-time text-gray"></text>
      </view>
    </view>

    <cu-modal
      :visible.sync="modalVisible"
      modalTitle="定时自动记账列表"
      v-if="modalVisible">
      <timed-auto-record-list
        :list="pendingList"
        @onSwitchChange="onSwitchChange($event)">
      </timed-auto-record-list>
    </cu-modal>

    <loading ref="loading"></loading>
    <message ref="msg"></message>
  </view>
</template>
<script>
import * as _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import { uniPopup } from '@dcloudio/uni-ui'
import {
  formatDateAsText,
  getDuplicateModeText,
  getDuplicateModeValue,
  formatDate,
  getYearMonthDayArray,
  getTomorrowTime,
} from '@/utils/index'
import {
  duplicateModeMap,
  daySuboption,
  weekSuboption,
  monthSuboption,
  yearSuboption,
} from '@/constant/duplicateModeMultiOption'
import { TimedAutoRecordList } from '@/components/timed-auto-record-list/TimedAutoRecordList'

export default {
  name: 'timed-automatic-bookkeeping',
  data() {
    return {
      isRepeat: false,
      duplicateModeValue: [2, 0],
      duplicateModeMultiOption: [],
      startDate: getTomorrowTime(),
      endDate: '',
      date: getTomorrowTime(),
      saving: false,
      currentPocketbook: {},
      modalVisible: false,
    }
  },
  components: { TimedAutoRecordList },
  filters: {
    formatDateAsText,
    getDuplicateModeText,
  },
  computed: {
    ...mapGetters({
      currentTimedAutoPocketbook: 'getCurrentTimedAutoPocketbook',
      pendingList: 'getPendingPocketbookList',
    })
  },
  methods: {
    ...mapMutations(['setCurrentTimedAutoPocketbook', 'updateTimedAutoBookkeeping']),
    goBack() {
      this.setCurrentTimedAutoPocketbook(undefined)
      uni.navigateBack()
    },
    onSwitchChange(item) {
      const disable = !item.checked
      const { _id } = item

      this.$refs.loading.show({ title: disable ? '正在关闭...' : '正在开启...' })
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'updateTimedAutoBookkeeping',
        data: { _id, disable }
      }).then(() => {
        this.updateTimedAutoBookkeeping({ _id, disable })
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '修改成功！',
          type: 'success'
        })
      }, () => {
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '修改失败！',
          type: 'error'
        })
      })
    },
    onCheckedChange({ target: { value } }) {
      this.isRepeat = value
    },
    onDateChange({ target: { value } }) {
      this.date = value
    },
    onStartDateChange({ target: { value } }) {
      this.startDate = value
    },
    onEndDateChange({ target: { value } }) {
      this.endDate = value
    },
    onColumnChange({ detail: { column, value } }) {
      if (_.isEqual(column, 0)) {
        const optionArray = [daySuboption, weekSuboption, monthSuboption, yearSuboption]
        this.$set(this.duplicateModeMultiOption, 1, optionArray[value])
      }
    },
    onDuplicateModeChange({ detail: { value } }) {
      this.duplicateModeValue = value
    },
    openHistoryList() {
      this.modalVisible = true
    },
    getSubmitPocketbook(isRepeat) {
      const { account_id, amount, type, type_name, description } = this.currentPocketbook
            
      if (!isRepeat) {
        const timestamp = new Date().getTime()
        const [current_year, current_month, current_day] =
              getYearMonthDayArray(formatDate(this.date))

        return { current_year, current_month, current_day, timestamp,
                 account_id, amount, type, type_name, description }
      }

      return { account_id, amount, type, type_name, description }
    },
    save() {
      this.saving = true
      this.$refs.loading.show({
        title: '正在保存...'
      })
      const [ mode, value ] = getDuplicateModeValue(this.duplicateModeValue)
      const { isRepeat, startDate, endDate } = this
      const pocketbook = this.getSubmitPocketbook(isRepeat)
      const [disable, done] = [false, false]

      const submitData = isRepeat ? {
        isRepeat,
        pocketbook,
        mode,
        value,
        disable,
        done,
        startDate: new Date(startDate).getTime(),
        endDate: endDate ? new Date(endDate).getTime() : 0,
      } : { isRepeat, pocketbook, disable, done, startDate: new Date().getTime(), endDate: 0 }

      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'addPendingBookkeeping',
        data: submitData
      }).then(() => {
        this.saving = false
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '保存成功！',
          type: 'success',
        })
        uni.switchTab({
          url: '/pages/tab-bar/PocketBook'
        })
      }, () => {
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '保存失败！',
          type: 'error',
        })
      })
    },
    initDuplicateModeMultiOption() {
      const multiOption = [duplicateModeMap, monthSuboption]
      this.duplicateModeMultiOption = multiOption
    },
  },
  created() {
    this.initDuplicateModeMultiOption()
    this.currentPocketbook = _.clone(this.currentTimedAutoPocketbook)
  },
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  padding-bottom: 52px;
  box-sizing: border-box;
}

.preview {
  padding: 0 20px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed $light-grey;
  box-sizing: border-box;
  background-color: $light-grey;

  .pocket-book {
    display: flex;
    align-items: center;

    &-icon {
      margin-right: 10px;
      width: 50px;
      height: 50px;
      border-radius: 100%;
      border: 1px solid;

      & > image {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }

    &-info {
      .amount {
        margin-left: .5em;
      }
      .sub-text {
        color: inherit;
        font-size: 12px;
        display: block;

        text + text {
          margin-left: .5em;
        }

        text:last-of-type {
          color: #909390;
        }
      }
    }
  }
}

.list {
  padding: 0 10px;
  height: calc(100% - 168px);
  overflow: auto;
  box-sizing: border-box;

  &-item {
    padding: 10px 0;
    font-size: 16px;
    border-bottom: 1px solid $light-grey;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    &:last-of-type {
      border-bottom: 0;
    }

    .label {
      width: 5em;
    }
    
    .content {
      position: relative;
      text-align: right;
      flex: 1 1 auto;
    }

    .picker {
      color: #409EFF;
    }

    .placeholder {
      color: $secondary-text;
    }
  }
}

.confirm {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  
  .cu-btn {
    flex: 1 1 auto;

    &.icon-btn {
      margin-left: 10px;
      max-width: 40px;
      font-size: 18px;
    }
  }
}
</style>