import { LoginForm } from "@/components/auth/LoginForm"
import { Link } from "@tanstack/react-router"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <LoginForm />
      <p className="text-center mt-4 text-sm text-gray-600">
        Não tem uma conta?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}
