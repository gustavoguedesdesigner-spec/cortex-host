import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppState } from '@/context/AppStateContext'

/**
 * Protecao de rota simulada (sem backend). Redireciona para o login
 * quando nao ha sessao demonstrativa ativa.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAppState()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
