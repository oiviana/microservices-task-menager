import { AppProviders } from './providers/AppProviders'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/router'
import { Toaster } from 'sonner'

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProviders>
  )
}

export default App
