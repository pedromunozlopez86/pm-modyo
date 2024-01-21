import { createRouter, createWebHistory } from 'vue-router'
import LoginHome from '../views/LoginHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login-home',
      component: LoginHome
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    }
  ]
})

export default router
