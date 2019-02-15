import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import Meta from 'vue-meta'

import App from './app.vue'
import createRouter from './config/router'
import createStore from './store/store'
import Notification from './components/notification'
import Tabs from './components/tabs'
import './assets/scss/global.css'

Vue.use(Router)
Vue.use(Vuex)
Vue.use(Meta)
Vue.use(Notification)
Vue.use(Tabs)

export default () => {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: (h) => h(App)
  })
  return {app, router, store}
}

