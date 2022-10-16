import { createRouter, createWebHistory } from 'vue-router'
import ComponentViews from '../views/ComponentViews.vue'
import LoginView from '../views/LoginView.vue'
import CustomerView from '../views/CustomerView.vue'
import EstablishmentView from '../views/EstablishmentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/play',
      name: 'playground',
      component: ComponentViews
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/customer',
      name: 'customer',
      component: CustomerView
    },
    {
      path: '/establishment',
      name: 'establishment',
      component: EstablishmentView
    },
  ]
})

export default router
