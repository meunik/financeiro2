import Vue from 'vue'
import VueRouter from 'vue-router'
import Fatura from '../views/Fatura.vue'
import Inicial from '../views/Inicial.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Fatura
  },
  {
    path: '/inicial',
    name: 'inicial',
    component: Inicial
  }
]

const router = new VueRouter({
  routes
})

export default router
