import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Components from '../'

Vue.use(Components)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
