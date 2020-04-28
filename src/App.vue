<script lang="javascript">
  import * as _ from 'lodash'
  import Vue from 'vue';
  import { mapMutations } from 'vuex';
  import { formatMonth } from '@/utils/index'

  export default Vue.extend({
    mpType: 'app',
    methods: {
      ...mapMutations([
        'setMyAssets',
        'setBookkeepingTypeList',
        'setMonths',
        'updateLoginStatus',
      ]),
      login() {
        wx.cloud.init()
        // 用户登录
        return wx.cloud.callFunction({
          name: 'login',
        }).then(({ result }) => {
          this.updateLoginStatus({ ...result, state: true })
          // 获取账户列表
          wx.cloud.callFunction({
            name: 'getAccountList',
          }).then(({ result }) => {
            this.setMyAssets(result)
          })

          // 获取图标列表
          wx.cloud.callFunction({
            name: 'getBookkeepingTypeList',
          }).then(({ result }) => {
            this.setBookkeepingTypeList(result)
          })

          // 获取已记账的月份
          wx.cloud.callFunction({
            name: 'getMonthOfAccounting',
          }).then(({ result }) => {
            this.setMonths(result)
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
