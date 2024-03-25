import Vue from 'vue'
import VueRouter from 'vue-router'
import Fatura from '@/views/Fatura.vue'
import Inicial from '@/views/Inicial.vue'
import ConfigNubank from '@/views/components/Configuracos/ConfigNubank.vue'

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
  },
  {
    path: '/configNubank',
    name: 'ConfigNubank',
    component: ConfigNubank
  }
]

const router = new VueRouter({
  routes
})

export default router
