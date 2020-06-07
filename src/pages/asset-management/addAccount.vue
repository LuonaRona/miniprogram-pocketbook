<template>
  <view>
    <cu-custom bgColor="bg-primary-light" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">账户管理</block>
    </cu-custom>
    <view class="preview">
      <view class="account-item" :style="currentAccountBgColor">
        <view class="account-name">
          <image :src="currentAccountIcon" class="account-icon"></image>
          <view class="account-title">
            <text class="title">{{ account.name || '请输入账户名称' }}</text><br>
            <text class="description">{{ account.description }}</text>
          </view>
        </view>
        <view class="account-balance">{{ (account.balance || 0) | amount }}</view>
      </view>
    </view>
    <view class="list">
      <view class="list-item">
        <text class="label">账户名称</text>
        <view class="content">
          <input v-model="account.name" class="uni-input" type="text" placeholder="请输入账户名称">
        </view>
      </view>
      <view class="list-item">
        <text class="label">账户余额</text>
        <view class="content">
          <input v-model="account.balance" class="uni-input" type="digit" placeholder="请输入账户余额">
        </view>
      </view>
      <view class="list-item show-arrow">
        <text class="label">账户类型</text>
        <picker class="picker"
          :value="currentAccountTypeIndex"
          :range="accountTypeList"
          range-key="typeName"
          @change="onAccountTypeChange">
          <view class="uni-input">{{ accountTypeList[currentAccountTypeIndex].typeName }}</view>
        </picker>
        <view class="arrow">
          <image src="/static/arrow-right.png"></image>
        </view>
      </view>
      <view class="list-item show-arrow">
        <text class="label">账户颜色</text>
        <view class="color-board" :style="currentAccountBgColor" @click="openColorPopup"></view>
        <view class="arrow">
          <image src="/static/arrow-right.png"></image>
        </view>
      </view>
      <view class="list-item show-arrow">
        <text class="label">图标</text>
        <image class="account-icon"
          :src="currentAccountIcon"
          :style="currentAccountBgColor"
          @click="openIconPopup">
        </image>
        <view class="arrow">
          <image src="/static/arrow-right.png"></image>
        </view>
      </view>
      <view class="list-item">
        <text class="label">备注</text>
        <view class="content">
          <input v-model="account.description" class="uni-input" maxlength="16" type="text" placeholder="备注说明">
        </view>
      </view>
    </view>

    <view class="confirm">
      <view class="cu-btn bg-primary"
        :loading="saving"
        :style="currentAccountBgColor"
        @click="save">保存</view>
    </view>

    <cu-modal
      modalTitle="请选择账户颜色"
      :visible.sync="colorModalVisible"
      v-if="colorModalVisible">
      <view class="color-board-list">
        <view class="color-board"
          v-for="bgColor in bgColors"
          :key="bgColor"
          :style="bgColor"
          @click="onChangeAccountBgColor(bgColor)">
        </view>
      </view>
    </cu-modal>

    <cu-modal
      modalTitle="请选择账户图标"
      :visible.sync="iconModalVisible"
      v-if="iconModalVisible">
      <view class="icon-list" :style="currentAccountBgColor">
        <image class="account-icon"
          v-for="iconPath in accountIcons"
          :key="iconPath"
          :src="iconPath"
          @click="onChangeAccountIcon(iconPath)">
        </image>
      </view>
    </cu-modal>
    
    <loading ref="loading"></loading>
    <message ref="msg"></message>
  </view>
</template>

<script>
import * as _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import { uniPopup } from '@dcloudio/uni-ui'
import { precision } from '@/utils/index'
import bgColors from './accountBgColors'
import accountIcons from './accountIcons'

export default {
  name: 'add-account',
  data() {
    return {
      title: '新增账户',
      saving: false,
      account: {
        name: '',
        balance: undefined,
        bgColor: '',
        description: '',
        iconPath: '',
        inTotal: 0,
        outTotal: 0,
        timestamp: 0,
      },
      content: '弹出层',
      bgColors,
      accountIcons,
      currentAccountBgColor: '',
      currentAccountIcon: '',
      currentAccountTypeIndex: 0,
      accountTypeList: [
        { type: 'asset', typeName: '资产账户' },
        // { type: 'debt', typeName: '负债账户' }
      ],
      colorModalVisible: false,
      iconModalVisible: false,
    }
  },
  watch: {
    'account.balance': {
      handler: function(val) {
        if (val > 100000000) {
          this.account.balance = 99999999.99
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      currentAccountDetail: 'getCurrentAccount',
    })
  },
  methods: {
    onInit() {
      const isEdit = !_.isNil(this.currentAccountDetail)
      if (isEdit) {
        this.title = '编辑账户信息'
        this.account = this.currentAccountDetail
        this.currentAccountBgColor = this.account.bgColor
        this.currentAccountIcon = this.account.iconPath
      } else {
        this.currentAccountBgColor = bgColors[0]
        this.currentAccountIcon = accountIcons[0]
      }
    },
    onChangeAccountBgColor(color) {
      this.currentAccountBgColor = color
      this.closeColorPopup()
    },
    onChangeAccountIcon(iconPath) {
      this.currentAccountIcon = iconPath
      this.closeIconPopup()
    },
    onAccountTypeChange(event) {
    },
    save() {
      const name = this.account.name
      const balance = parseFloat(precision(this.account.balance))

      if (name && _.isNumber(balance)) {
        this.$refs.loading.show({ title: '正在保存...' })
        this.saving = true
        this.account.bgColor = this.currentAccountBgColor
        this.account.iconPath = this.currentAccountIcon
        this.account.balance = balance
        this.account.timestamp = new Date().getTime()
        
        wx.cloud.init()
        wx.cloud.callFunction({
          name: 'addAccount',
          data: this.account
        }).then((res) => {
          console.log(this.account)
          this.updateAccountInfoById(this.account)
          this.$refs.loading.hide()
          this.$refs.msg.show({
            message: '修改成功！',
            type: 'success'
          })
          uni.navigateBack()
        }, () => {
          this.$refs.loading.hide()
          this.$refs.msg.show({
            message: '修改失败！',
            type: 'error'
          })
        })
      }
    },
    openColorPopup() {
      this.colorModalVisible = true
    },
    closeColorPopup() {
      this.colorModalVisible = false
    },
    openIconPopup() {
      this.iconModalVisible = true
    },
    closeIconPopup() {
      this.iconModalVisible = false
    },
    ...mapMutations(['updateAccountInfoById'])
  },
  created() {
    this.onInit()
  },
  components: { uniPopup },
}
</script>
<style lang="scss" scoped>
.list {
  padding: 0 10px;

  &-item {
    padding: 10px 0;
    font-size: 16px;
    border-bottom: 1px solid $light-grey;
    display: flex;
    justify-content: space-between;

    &.show-arrow {
      position: relative;
      padding-right: 1em;
    }

    &:last-of-type {
      border-bottom: 0;
    }

    .label {
      width: 5em;
    }
    
    .content {
      text-align: right;
      flex: 1 1 auto;

      .uni-input {
      }
    }
  }

  .arrow {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: flex;

    & > image {
      width: 1em;
      height: 1em;
    }
  }
}

.color-board {
  min-width: 45px;
  border-radius: 4px;
  cursor: pointer;
}

.color-board-list {
  padding: 15px 5px 5px 15px;
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .color-board {
    margin: 0 10px 10px 0;
    min-width: 20%;
    height: 25px;
    flex: 1;
  }
}

.account-icon {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  cursor: pointer;
}

.icon-list {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .account-icon {
    margin: 10px;
    width: 30px;
    height: 30px;
  }
}

.preview {
  padding: 10px;
  border-bottom: 1px dashed $light-grey;
}

.account-item {
  padding: 1rem;
  color: #fff;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: inherit;

  &.add {
    color: #C0C4CC;
    border: 1px dashed;
    justify-content: center;
  }

  .account-name {
    display: flex;
    align-items: center;
  }

  .account-title {
    display: inline-block;

    .description {
      width: 160px;
      display: block;
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .account-icon {
    margin-right: 5px;
    min-width: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
  }
}

.confirm {
  margin-top: 10px;
  padding: 0 10px;

  .cu-btn {
    width: 100%;
  }
}
</style>