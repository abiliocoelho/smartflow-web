import { useAuth } from '../hooks/useAuth'
export function Dashboard() {
  const { signOut } = useAuth()
  return (
    <button
      onClick={() => {
        signOut()
      }}
    >
      Sair
    </button>
  )
}
