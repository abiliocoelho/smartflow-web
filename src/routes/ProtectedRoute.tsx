import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
type Props = {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuth()

  if (!user?.token) {
    return <Navigate to="/" />
  }
  return children
}
