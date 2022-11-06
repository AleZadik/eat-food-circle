import { createRouter, createWebHistory } from 'vue-router'
import ComponentViews from '../views/ComponentViews.vue'
import LoginView from '../views/LoginView.vue'
import CustomerView from '../views/CustomerView.vue'
import EstablishmentView from '../views/EstablishmentView.vue'
import { useAuthStore } from '../stores/authStore'

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
      component: CustomerView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (authStore.user.u_type && authStore.user.u_type === "customer") {
          next();
        } else if (user && user.uid && user.u_type === "customer"){
          authStore.user = user;
          next();
        } else if (authStore.user.u_type && authStore.user.u_type === "establishment") {
          next('/establishment');
        } else {
          next('/');
        }
      }
    },
    {
      path: '/establishment',
      name: 'establishment',
      component: EstablishmentView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.user.u_type && authStore.user.u_type === "establishment") {
          next();
        } else if (authStore.user.u_type && authStore.user.u_type === "customer") {
          next('/customer');
        }
        else {
          next('/');
        }
      }
    },
  ]
})

export default router
