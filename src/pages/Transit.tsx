import { useState } from 'react'
export function Transit() {
  const [scale, setScale] = useState('')
  return (
    <main className="h-full w-full justify-center items-center bg-hero">
      <label>
        Escolha a opção
        <select
          className="h-10 rounded bg-zinc-700 p-3 justify-start "
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
    </main>
  )
}
