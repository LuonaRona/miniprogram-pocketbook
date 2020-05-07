<script lang="javascript">
  import * as _ from 'lodash'
  import Vue from 'vue';
  import { mapMutations } from 'vuex';
  import { formatMonth } from '@/utils/index'

  export default Vue.extend({
    mpType: 'app',
    methods: {
      ...mapMutations([
        'setAccounts',
        'setBookkeepingTypeList',
        'setPocketbookList',
        'setPendingPocketbookList',
        'setMonths',
        'updateLoginStatus',
      ]),
      login() {
        // uni.showLoading({ title: '正在登录' })
        wx.cloud.init()
        // 用户登录
        return wx.cloud.callFunction({
          name: 'login',
        }).then(({ result }) => {
          uni.showLoading({ title: '正在获取数据' })
          this.updateLoginStatus({ ...result, state: true })

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
            uni.hideLoading()
            this.setPocketbookList(result.list)
          })
        })
      }
    },
    onLaunch() {
      this.login()
    }
  });
</script>

<style>
  /*每个页面公共css */
  page {
      color: #303133;
      height: 100%;
  }

  button[type="primary"] {
      color: #fff;
      background-color: #FF6781;
  }

  button[disbaled] {
    opacity: 0.6;
  }

  button[disabled][type=primary], button[loading][type=primary], button[type="primary"].button-hover {
    background-color: rgba(255, 103, 129, 0.6);
  }

  button[type="delete"] {
    color: #F56C6C;
    background: transparent;
  }

  button[type="delete"]:after {
    border: 1px solid;
  }

</style>
