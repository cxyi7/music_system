import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/login/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/aa',
    name: 'Aa',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Aa" */ '../views/aa/index')
  }
]

const router = createRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  history: createWebHashHistory(),
  routes
})

export default router
