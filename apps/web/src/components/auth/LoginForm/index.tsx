import { useAuthActions } from '@/actions/auth.actions';

export function LoginForm() {
  const { login, isLoading } = useAuthActions();

  return (
    <button disabled={isLoading} onClick={() => login({ email: 'user@example.com', password: 'password' })}>
      Entrar
    </button>
  );
}
