import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import Start from './views/Start.vue'

Vue.use(VueRouter)

export const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/start', name: '上手', component: Start },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({ routes })

export default router
