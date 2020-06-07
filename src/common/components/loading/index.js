import Vue from 'vue'
import LoadingComponent from './Loading.vue'

const Loading = {
  install(Vue) {
    const Constructor = Vue.extend(LoadingComponent)
    const el = document.createElement('view')
    let instance = new Constructor({ el })
    document.body.appendChild(instance.$el)
    Vue.prototype.$loading = (options = {}) => {
      if (options.title) {
        instance.title = options.title
      }

      return instance
    }
  }
}

export default Loading
