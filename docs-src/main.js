import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Components from '../'
import('../package.json').then(item => {
  import(`../dist/${item.name}.css`)
})

import ElementUI from 'element-ui'
import 'element-ui/packages/theme-chalk/lib/index.css'

Vue.use(Components)
Vue.use(ElementUI, { size: 'small' })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
