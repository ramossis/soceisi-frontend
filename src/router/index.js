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
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/AdminDashboard.vue'),
        },
      ],
      beforeEnter: (to, form, next) => {
        const token = localStorage.getItem('token')
        if (!token) next('/login')
        else next()
      },
    },
  ],
})

export default router
