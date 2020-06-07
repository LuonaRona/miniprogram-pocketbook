<template>
  <view class="container">
    <cu-custom bgColor="bg-primary-light" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">收支类型管理</block>
    </cu-custom>
    <pocketbook-type-tab
      :type="type"
      @onTypeChange="onTypeChange($event)">
    </pocketbook-type-tab>
    <view class="content">
      <view class="grid-title">显示的{{ type }}类型：</view>
      <view class="grid-icons" v-if="displayedTypes.length">
        <bookkeeping-icon
          class="grid-item"
          badgeIconPath="/static/subtract-circle.png"
          v-for="(icon, index) in displayedTypes"
          :index="index"
          :path="icon.path"
          :name="icon.name"
          :color="icon.color"
          :key="index"
          @click.native="removeIconFromDList(icon)">
        </bookkeeping-icon>
      </view>
      <view class="grid-title">隐藏的{{ type }}类型：</view>
      <view class="grid-icons">
        <bookkeeping-icon
          class="grid-item"
          badgeIconPath="/static/add-circle.png"
          v-for="(icon, index) in hiddenListTypes"
          :index="index"
          :path="icon.path"
          :name="icon.name"
          :color="icon.color"
          :key="index"
          @click.native="removeIconFromHList(icon)">
        </bookkeeping-icon>
      </view>
    </view>
    <view class="confirm">
      <view
        class="cu-btn bg-primary"
        :loading="saving"
        @click="save">保存</view>
    </view>
    <loading ref="loading"></loading>
    <message ref="msg"></message>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import BookkeepingIcon from '@/components/bookkeeping-icon/BookkeepingIcon'
import PocketbookTypeTab from '@/components/pocketbook-type-tab/PocketbookTypeTab'

export default {
  name: 'bookkeeping-settings',
  components: { PocketbookTypeTab, BookkeepingIcon },
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
      this.$refs.loading.show({ title: '正在保存...' })
      const bookkeepingTypes = _.map(this.displayedList, '_id')

      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: { bookkeepingTypes }
      }).then(() => {
        this.updateUserBookkeepingTypes(bookkeepingTypes)
        this.saving = false
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '保存成功！',
          type: 'success'
        })
        uni.navigateBack()
      }, () => {
        this.$refs.loading.hide()
        this.$refs.msg.show({
          message: '保存失败！',
          type: 'error'
        })
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
  },
  onLoad({ type }) {
    this.type = type
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

.grid-title {
  margin-top: 10px;
  padding: 0 15px;
  font-size: 12px;
  color: $secondary-text;
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
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

  .cu-btn {
    width: 98%;
  }
}
</style>