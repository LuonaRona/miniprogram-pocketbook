<script lang="javascript">
  import * as _ from 'lodash'
  import Vue from 'vue';
  import { formatMonth } from '@/utils/index'

  export default Vue.extend({
    mpType: 'app',
    onLaunch() {
      console.log(uni)
      uni.getSystemInfo({
        success: function(e) {
          // #ifndef MP
          Vue.prototype.StatusBar = e.statusBarHeight;
          if (e.platform == 'android') {
            Vue.prototype.CustomBar = e.statusBarHeight + 50;
          } else {
            Vue.prototype.CustomBar = e.statusBarHeight + 45;
          };
          // #endif
          // #ifdef MP-WEIXIN
          Vue.prototype.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          Vue.prototype.Custom = custom;
          Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
          // #endif		
          // #ifdef MP-ALIPAY
          Vue.prototype.StatusBar = e.statusBarHeight;
          Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
          // #endif
        }
      })
    }
  });
</script>

<style>
  @import "./colorui/main.css";
  @import "./colorui/icon.css";
  @import "./colorui/animation.css";
</style>