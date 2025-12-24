import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '@/api/auth/auth.mutations'
import { z } from 'zod'
import { router } from '@/router'
import { registerSchema } from '@/schemas/auth.schema'
import { FormInput } from '@/components/ui/FormInput'

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const registerMutation = useRegister()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        router.navigate({ to: '/login' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-sm">
      <FormInput
        label="Nome"
        placeholder="Digite seu nome"
        register={register('name')}
        error={errors.name}
      />
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
      <button type="submit" className="w-full py-3 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700">
        Cadastrar
      </button>
    </form>
  )
}
