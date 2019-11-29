import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from './views/Home.vue'
// import About from './views/About.vue'
import routes from './views/routes'

Vue.use(VueRouter)

// const routes = [
//   { path: '/', name: 'home', component: Home },
//   { path: '/about', name: 'about', component: About },
//   { path: '*', redirect: '/' }
// ]

const router = new VueRouter({ routes })

export default router
