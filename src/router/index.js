import { createRouter, createWebHistory } from 'vue-router'
import ComponentViews from '../views/ComponentViews.vue'
import LoginView from '../views/LoginView.vue'

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
  ]
})

export default router
