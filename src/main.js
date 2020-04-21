import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index'
import { precision } from '@/utils/index'

Vue.config.productionTip = false

Vue.prototype.$store = store

Vue.filter('amount', val => {
  return precision(val)
});

new App({ store }).$mount()
