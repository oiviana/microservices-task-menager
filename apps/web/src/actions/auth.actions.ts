import { useLogin, useLogout } from '@/api/auth/auth.mutations'
import { router } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'

export function useAuthActions() {
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const login = (payload: {
    email: string
    password: string
  }) => {
    loginMutation.mutate(payload, {
      onSuccess: (data) => {
        setAuth(data.user, data.accessToken)

        //  força o TanStack Router reavaliar auth
        router.invalidate()

        //  navega para dashboard
        router.navigate({ to: '/dashboard' })

        toast.success('Login realizado com sucesso')
      },
      onError: () => {
        toast.error('Email ou senha inválidos')
      },
    })
  }

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth()

        router.invalidate()
        router.navigate({ to: '/login' })

        toast.info('Logout realizado')
      },
    })
  }

  return {
    login,
    logout,
    isLoading:
      loginMutation.isPending || logoutMutation.isPending,
  }
}
