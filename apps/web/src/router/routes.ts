import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './root.route'
import { requireAuth } from './auth.guard'

import LoginPage from '@/routes/auth/login.page'
import DashboardPage from '@/routes/dashboard/dashboard.page'

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }

    throw redirect({ to: '/login' })
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: requireAuth,
  component: DashboardPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
])
