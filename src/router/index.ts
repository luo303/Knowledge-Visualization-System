import { createRouter, createWebHashHistory } from 'vue-router'
import AuthPage from '@/views/auth/SystemLogin.vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthPage
    },
    {
      path: '/',
      redirect: '/login',
      children: [
        {
          path: 'layout',
          component: () => import('@/views/layout/MainLayout.vue'),
          name: 'layout',
          redirect: 'layout/createmind',
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
            },
            {
              path: 'personalcenter',
              component: () => import('@/views/PersonalCenter.vue')
            },
            {
              path: 'generate-pro',
              component: () => import('@/views/Generate-pro.vue'),
              name: 'generate-pro'
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
//添加路由前置守卫
router.beforeEach((to, from, next) => {
  const userstore = useUserStore()
  if (
    !userstore.token &&
    to.path !== '/login' &&
    to.path !== '/register' &&
    to.path !== '/forgetpwd'
  ) {
    next('/login')
    ElMessage.error('请先登录')
  } else next()
})
export default router
