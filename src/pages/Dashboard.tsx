import { useAuth } from '../hooks/useAuth'
export function Dashboard() {
  const { signOut } = useAuth()
  return (
    <main className="flex h-screen bg-zinc-950 text-zinc-200 items-center justify-center">
      <button
        onClick={() => {
          signOut()
        }}
      >
        Sair
      </button>
    </main>
  )
}
