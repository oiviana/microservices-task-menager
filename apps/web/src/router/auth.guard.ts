import { redirect } from '@tanstack/react-router'

export const requireAuth = ({ context }: any) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({ to: '/login' })
  }
}
