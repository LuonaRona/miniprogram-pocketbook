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
    <view class="content">
      <view class="grid-title">显示的{{ type }}类型：</view>
      <view class="grid-icons" v-if="displayedTypes.length">
        <view class="grid-item"
          v-for="(icon, index) in displayedTypes"
          :index="index"
          :key="index"
          @click="removeIconFromDList(icon)">
          <view class="image-icon">
            <image :src="icon.path"></image>
            <image src="/static/subtract-circle.png" class="badge-icon"></image>
          </view>
          <text class="text">{{ icon.name }}</text>
        </view>
      </view>
      <view class="grid-title">不显示的{{ type }}类型：</view>
      <view class="grid-icons" v-if="hiddenListTypes.length">
        <view class="grid-item"
          v-for="(icon, index) in hiddenListTypes"
          :index="index"
          :key="index"
          @click="removeIconFromHList(icon)">
          <view class="image-icon">
            <image :src="icon.path"></image>
            <image src="/static/add-circle.png" class="badge-icon"></image>
          </view>
          <text class="text">{{ icon.name }}</text>
        </view>
      </view>
    </view>

    <view class="confirm">
      <button class="confirm-primary"
        type="primary"
        :loading="saving"
        @click="save">保存</button>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'bookkeeping-settings',
  data() {
    return {
      displayedList: [],
      hiddenList: [],
      type: '支出',
      saving: false,
    }
  },
  computed: {
    displayedTypes() {
      return _.filter(this.displayedList, ['type', this.type])
    },
    hiddenListTypes() {
      return _.filter(this.hiddenList, ['type', this.type])
    },
    ...mapGetters({
      userInfo: 'getUserInfo',
      allBookkeepingTypes: 'getBookkeepingTypeList',
    })
  },
  methods: {
    isActivedTab(type) {
      return this.type === type
    },
    onTypeChange(type) {
      this.type = type
    },
    save() {
      this.saving = true
      const bookkeepingTypes = _.map(this.displayedList, '_id')

      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: { bookkeepingTypes }
      }).then(() => {
        this.updateUserBookkeepingTypes(bookkeepingTypes)
        uni.navigateBack()
        this.saving = false
      }, () => {
        this.saving = false
      })
    },
    removeIconFromDList(icon) {
      const iconIndex = _.findIndex(this.displayedList, ['_id', icon._id])
      this.$delete(this.displayedList, iconIndex)
      this.hiddenList.push(icon)
    },
    removeIconFromHList(icon) {
      const iconIndex = _.findIndex(this.hiddenList, ['_id', icon._id])
      this.$delete(this.hiddenList, iconIndex)
      this.displayedList.push(icon)
    },
    assortByDisplay() {
      if (!this.allBookkeepingTypes.length) {
        return uni.navigateBack()
      }

      const list = this.allBookkeepingTypes
      const ids = this.userInfo.bookkeepingTypes
      const displayedList = []
      const hiddenList = []

      _.forEach(list, type => {
        if (_.includes(ids, type._id)) {
          displayedList.push(type)
        } else {
          hiddenList.push(type)
        }
      })

      this.displayedList = displayedList
      this.hiddenList = hiddenList
    },
    ...mapMutations(['updateUserBookkeepingTypes'])
  },
  created() {
    this.assortByDisplay()
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 55px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1 1 auto;
    overflow: auto;
  }
}

.pocketbook-type {
  position: relative;
  padding: 0 25px;
  box-sizing: border-box;
  display: flex;
  
  .income, .outlay {
    padding: 0 5px;
    font-size: 14px;
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
    width: calc(50% - 25px);
    height: 2px;
    bottom: 0;
    border-radius: 2px;
    background-color: #FF6781;
    transform: translateX(0);
    transition: .3s all ease;
  }
}

.grid-title {
  margin-top: 10px;
  padding: 0 15px;
  font-size: 12px;
  color: #909399;
}

.grid-icons {
  display: flex;
  flex-wrap: wrap;

  .grid-item {
    margin: 5px 0;
    width: 20%;
    font-size: 14px;
    text-align: center;
    cursor: pointer;

    &.actived {
      .image-icon {
        border: 1px solid;
      }
    }

    .image-icon {
      position: relative;
      margin: 5px auto;
      width: 34px;
      height: 34px;
      color: inherit;
      border-radius: 100%;
      border: 1px solid transparent;

      & > image {
        margin-top: 2px;
        width: 30px;
        height: 30px;
      }

      .badge-icon {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
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
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

  .confirm-primary {
    font-size: 16px;
    line-height: 2.2;
  }
}
</style>