import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function Dashboard() {
  const [scale, setScale] = useState('')
  const [origin, setOrigin] = useState('')
  const { signOut } = useAuth()

  return (
    <main className="h-screen bg-hero bg-cover bg-center bg-fixed flex flex-col justify-between items-center ">
      <header>
        <h1>ok</h1>
      </header>
      <div className="flex flex-col gap-3">
        <section className="bg-zinc-800 p-10 rounded-xl opacity-90 flex justify-around">
          <h1 className="text-zinc-200">Timon</h1>
          <h1 className="text-zinc-200">Teresina</h1>
        </section>
        <section className="bg-zinc-800 p-10 rounded-xl opacity-90 flex flex-col gap-3 max-w-xs">
          <label className="text-zinc-200">
            Origem
            <select
              className="h-10 rounded bg-zinc-700 w-full "
              onChange={(e) => setOrigin(e.target.value)}
              value={origin}
              required
            >
              <option value="teresina">Teresina</option>
              <option value="timon">Timon</option>
            </select>
          </label>
          <div className="w-full">
            <label htmlFor="time" className="text-zinc-200">
              Tempo
            </label>
            <input
              type="number"
              id="time"
              className="rounded h-10 px-3 w-full"
              placeholder="Valor"
            />
          </div>
          <label className="text-zinc-200">
            Escolha a opção
            <select
              className="h-10 rounded bg-zinc-700 w-full "
              onChange={(e) => setScale(e.target.value)}
              value={scale}
              required
            >
              <option value="segundos">segundos</option>
              <option value="minutos">minutos</option>
              <option value="horas">horas</option>
              <option value="dias">dias</option>
            </select>
          </label>
          <button
            className="h-10 w-full bg-emerald-500 rounded  hover:bg-emerald-600 text-zinc-200 font-semibold"
            onClick={signOut}
          >
            Enviar
          </button>
          <button
            className="h-10 w-full bg-red-500 rounded  hover:bg-red-600 text-zinc-200 font-semibold"
            onClick={signOut}
          >
            Parar
          </button>
        </section>
      </div>
      <footer className="h-10 bg-zinc-800 w-full opacity-90 flex justify-center items-center">
        <h1 className="text-zinc-200">
          © Copyright 2024 IFMA - Todos os direitos reservados.
        </h1>
      </footer>
    </main>
  )
}
