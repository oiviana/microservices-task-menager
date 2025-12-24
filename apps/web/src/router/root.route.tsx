import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAuthStore } from '@/stores/auth.store'

const getAuth = () => {
  const { isAuthenticated, user } = useAuthStore.getState()
  return { isAuthenticated, user }
}

export const rootRoute = createRootRoute({
  beforeLoad: () => ({
    auth: getAuth(),
  }),
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
