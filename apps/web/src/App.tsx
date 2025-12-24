import { AppProviders } from './providers/AppProviders'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/router'

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
