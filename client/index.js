import Vue from 'vue'
import App from './App.vue'

import './assets/styles/global.styl' // 引入全局样式

new Vue({
  render: h => h(App)
}).$mount('#root')
