import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from './views/Home.vue'
// import Install from './views/Install.vue'
import routes from './views/routes'

Vue.use(VueRouter)

// const routes = [
//   { path: '/', name: 'home', component: Home },
//   { path: '/install', name: 'install', component: Install },
//   { path: '*', redirect: '/' }
// ]

const router = new VueRouter({ routes })

export default router
