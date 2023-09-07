import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import Ifma from '../assets/if.png'
import { Outlet, useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function setState() {
    await api.post('/state', {
      origin: 'Timon',
      remainingtime: 600,
    })
  }

  useEffect(() => {
    setState()
  }, [])

  return (
    <div className="text-white grid grid-cols-12 grid-rows-6 gap-0.5 h-screen bg-zinc-700">
      <header className="col-span-12 bg-zinc-950 p-4 row-span-1 rounded flex justify-end">
        <img src={Ifma} alt="" className="h-20" />
      </header>
      <aside className="col-span-2 bg-zinc-950 p-4 row-span-5 rounded flex flex-col gap-2">
        <button
          className="bg-zinc-800 p-4 rounded hover:bg-zinc-900"
          onClick={() => {
            navigate('transit')
          }}
        >
          Trânsito
        </button>
        <button
          className="bg-zinc-800 p-4 rounded hover:bg-zinc-900"
          onClick={() => {
            navigate('publish')
          }}
        >
          Publicar
        </button>
        <button
          className="bg-zinc-800 p-4 rounded hover:bg-zinc-900"
          onClick={() => {
            signOut()
          }}
        >
          Sair
        </button>
      </aside>
      <main className="col-span-10 bg-zinc-950 p-4 row-span-5 rounded">
        <Outlet />
      </main>
      <footer className="col-span-12 bg-zinc-950 p-4 row-span-1 rounded flex justify-center items-end">
        © 2023 IFMA. Todos os direitos reservados.
      </footer>
    </div>
  )
}
