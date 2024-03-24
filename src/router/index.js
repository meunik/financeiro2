import Vue from 'vue'
import VueRouter from 'vue-router'
import Fatura from '../views/Fatura.vue'
import Inicial from '../views/Inicial.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Inicial
  },
  {
    path: '/fatura',
    name: 'Fatura',
    component: Fatura
  }
]

const router = new VueRouter({
  routes
})

export default router
