import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/admin/DashboardView.vue'),
          children: [
            {
              path: 'overview',
              name: 'overview',
              component: () => import('../views/admin/dashboard/Listfc.vue')
            },
            {
              path: 'analysis',
              name: 'analysis',
              component: () => import('../views/admin/dashboard/Listcf.vue')
            }
          ]
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/admin/UsersView.vue'),
          children: [
            {
              path: 'list',
              name: 'userList',
              component: () => import('../views/admin/users/UserList.vue')
            }
            // {
            //   path: 'add',
            //   name: 'userAdd',
            //   component: () => import('../views/admin/users/UserAdd.vue')
            // },
            // {
            //   path: 'edit/:id',
            //   name: 'userEdit',
            //   component: () => import('../views/admin/users/UserEdit.vue')
            // }
          ]
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/admin/SettingsView.vue'),
          children: [
            {
              path: 'profile',
              name: 'profile',
              component: () => import('../views/admin/settings/Profile.vue')
            }
            // {
            //   path: 'security',
            //   name: 'security',
            //   component: () => import('../views/admin/settings/Security.vue')
            // }
          ]
        }
      ]
    },
    {
      path: '/',
      redirect: '/admin/dashboard'
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  // 如果有 token，验证其有效性
  if (authStore.token || localStorage.getItem('token')) {
    const isValid = await authStore.validateToken()
    if (isValid) {
      if (to.path === '/login') {
        next('/admin/dashboard')
        return
      }
      next()
      return
    }
  }

  // token 无效或不存在
  if (requiresAuth) {
    next('/login')
    return
  }

  next()
})

export default router
