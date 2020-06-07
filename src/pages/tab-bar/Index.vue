<template>
  <view class="index">
    <image src="@/static/bg.png" class="bg-image"></image>
    <view class="welcome" :style="'top: ' + top">
      <image src="@/static/pocket-book-pencil.png" class="icon"></image>
      <text class="title">欢迎使用</text>
      <text class="sub-title">轻松记一笔</text>
    </view>
    <create-user v-if="isShow" @submit="login($event)"></create-user>
    <loading ref="loading"></loading>
  </view>
</template>
<script>
import { mapMutations } from 'vuex'
import CreateUser from '@/components/create-user/CreateUser'

export default {
  name: 'index',
  components: { CreateUser },
  data() {
    return {
      top: '50%',
      isShow: false,
    }
  },
  methods: {
    initData(userinfo) {
      this.updateLoginStatus({ ...userinfo, state: true })
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1

      // 获取账户列表
      wx.cloud.callFunction({
        name: 'getAccountList',
      }).then(({ result }) => {
        this.setAccounts(result)
      })

      // 获取图标列表
      wx.cloud.callFunction({
        name: 'getBookkeepingTypeList',
      }).then(({ result }) => {
        this.setBookkeepingTypeList(result)
      })

      // 获取自动定时记账数据
      wx.cloud.callFunction({
        name: 'getTimedAutoBookkeeping'
      }).then(({ result }) => {
        this.setPendingPocketbookList(result.data)
      })

      // 获取所有记账数据
      wx.cloud.callFunction({
        name: 'getAllPocketbook',
        data: { year, month },
      }).then(({ result }) => {
        this.setPocketbookList(result.list)
        this.$refs.loading.hide()
        uni.switchTab({
          url: '/pages/tab-bar/PocketBook',
        })
      })
    },
    login(name) {
      this.isShow = false
      this.$refs.loading.show()

      wx.cloud.init()
      // 用户登录
      return wx.cloud.callFunction({
        name: 'login',
        data: { name },
      }).then(({ result }) => {
        this.initData(result)
      }, () => {
        // 用户登录失败
      })
    },
    ...mapMutations([
      'setAccounts',
      'setBookkeepingTypeList',
      'setPocketbookList',
      'setPendingPocketbookList',
      'setMonths',
      'updateLoginStatus',
    ]),
  },
  mounted() {
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'getRegistrationStatus',
    }).then(({ result }) => {
      if (result === '用户未注册') {
        this.top = '200px'
        this.isShow = true
      } else {
        this.initData(result)
      }
    })
  },
}
</script>
<style lang="scss" scoped>
.index {
  position: relative;
  height: 100%;
}

.bg-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.welcome {
  position: absolute;
  top: 50%;
  left: 50%;
  transition: .2s all ease-in-out;
  transform: translate(-50%, -50%);

  image, text {
    margin: 0 auto;
    text-align: center;
    display: block;
  }

  .icon {
    width: 70px;
    height: 65px;
  }

  .title {
    margin-top: 20px;
    font-size: 24px;
    line-height: 2;
    letter-spacing: 2px;
    color: $primary-color;
  }

  .sub-title {
    font-size: 20px;
    line-height: 1.5;
    letter-spacing: 5px;
    color: $primary-color;
  }
}

</style>