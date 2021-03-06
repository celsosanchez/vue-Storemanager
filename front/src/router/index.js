import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '@/views/NotFound'
import Producer from '@/views/Producer'
import Consumer from '@/views/Consumer'
import Account from '@/views/Account'
import Store from '@/views/Store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/producer',
    name: 'Producer',
    component: Producer
  },
  {
    path: '/store',
    name: 'Store',
    component: Store
  },
  {
    path: '/consumer',
    name: 'Consumer',
    component: Consumer
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/:pathMatch(.*)*",
    name: 'NotFound',
    component: NotFound
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
