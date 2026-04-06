import { useAuthStore } from '@/stores/auth.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/HomeView.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      name: 'Login',
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requireAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/AdminDashboard.vue'),
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const token = localStorage.getItem('tokenUser')

  if (to.meta.requireAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/admin')
  } else {
    next()
  }
})
export default router
