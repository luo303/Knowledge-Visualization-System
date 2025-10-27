import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/layout/createmind',
      children: [
        {
          path: 'layout',
          component: () => import('@/views/layout/MainLayout.vue'),
          name: 'layout',
          children: [
            {
              path: 'mymind',
              component: () => import('@/views/MyMind.vue'),
              name: 'mymind'
            },
            {
              path: 'createmind',
              component: () => import('@/views/CreateMind.vue'),
              name: 'createmind'
            },
            {
              path: 'handedit',
              component: () => import('@/views/HandEdit.vue'),
              name: 'handedit'
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/auth/SystemLogin.vue'),
      name: 'login'
    },
    {
      path: '/register',
      component: () => import('@/views/auth/SystemRegister.vue'),
      name: 'register'
    },
    {
      path: '/forgetpwd',
      component: () => import('@/views/auth/ForgetPassword.vue'),
      name: 'forgetpwd'
    }
  ]
})

export default router
