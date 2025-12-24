import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '@/api/auth/auth.mutations'
import { useAuthStore } from '@/stores/auth.store'

import type { z } from 'zod'
import { router } from '@/router'
import { FormInput } from '@/components/ui/FormInput'
import { loginSchema } from '@/schemas/auth.schema'

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const loginMutation = useLogin()
  const setAuth = useAuthStore((state) => state.setAuth)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        setAuth(res.user, res.accessToken)
        router.navigate({ to: '/dashboard' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-sm">
      <FormInput
        label="Email"
        placeholder="Digite seu email"
        type="email"
        register={register('email')}
        error={errors.email}
      />
      <FormInput
        label="Senha"
        placeholder="Digite sua senha"
        type="password"
        register={register('password')}
        error={errors.password}
      />
      <button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Entrar
      </button>
    </form>
  )
}
