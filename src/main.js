import Vue from 'vue'
import App from './App.vue'
import './main.scss'
import store from '@/store/index'
import { precision } from '@/utils/index'
import cuCustom from './colorui/components/cu-custom.vue'
import UserInfo from './components/user-info/UserInfo.vue'
import NavFooter from './components/nav-footer/NavFooter.vue'
import Loading from './common/components/loading/Loading'
import Message from './common/components/message/Message'
import CuModal from './common/components/cu-modal/CuModal.vue'

Vue.config.productionTip = false
Vue.prototype.$store = store

Vue.component('cu-custom', cuCustom)
Vue.component('cu-modal', CuModal)
Vue.component('nav-footer', NavFooter)
Vue.component('user-info', UserInfo)
Vue.component('loading', Loading)
Vue.component('message', Message)
Vue.filter('amount', val => {
  return precision(val)
});

new App({ store }).$mount()
