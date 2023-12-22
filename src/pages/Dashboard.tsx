import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { connect } from 'precompiled-mqtt'
import { ArrowFatLeft, ArrowFatRight, HandPalm } from '@phosphor-icons/react'
import Logo from '../assets/if.png'

type Message = {
  origin: string
  remainingtime: number
  updated: number
}

const MQTT_SERVER = 'mqtt://137.184.232.116:9001'
const TOPIC = 'esp32_topic'

export function Dashboard() {
  const [scale, setScale] = useState('')
  const [origin, setOrigin] = useState('')
  const [message, setMessage] = useState<Message>()
  const [timeLeft, setTimeLeft] = useState('')
  const { signOut } = useAuth()

  function updateTimer(seconds: number) {
    const days = Math.floor(seconds / (60 * 60 * 24))
    const hours = Math.floor(seconds / (60 * 60))
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds)

    const dd = days < 10 ? '0' + days : days

    const hh =
      hours - days * 24 < 10 ? '0' + (hours - days * 24) : hours - days * 24
    const mm =
      mins - hours * 60 < 10 ? '0' + (mins - hours * 60) : mins - hours * 60
    const ss =
      secs - mins * 60 < 10 ? '0' + (secs - mins * 60) : secs - mins * 60

    return `${dd}:${hh}:${mm}:${ss}`
  }

  useEffect(() => {
    const client = connect(MQTT_SERVER, {
      username: 'mosquitto',
      password: '8PMshux16',
    })

    client.on('connect', () => {
      console.log('Conectado ao servidor MQTT')
      client.subscribe(TOPIC)
    })

    client.on('message', (topic, payload) => {
      console.log(`Recebido no tópico ${topic}: ${payload.toString()}`)
      setMessage(JSON.parse(payload.toString()))
    })

    return () => {
      client.end()
    }
  }, [])
  useEffect(() => {
    let timeRemaining
    fetch('http://worldtimeapi.org/api/timezone/America/fortaleza')
      .then((data) => data.json())
      .then((response) => {
        timeRemaining =
          message?.remainingtime - (response.unixtime - message?.updated)
      })
    const timers = setInterval(() => {
      if (timeRemaining >= 0) {
        setTimeLeft(updateTimer(timeRemaining))
        timeRemaining -= 1
      }
    }, 1000)
    return () => clearInterval(timers)
  }, [message])

  return (
    <main className="h-screen bg-zinc-900 bg-cover bg-center bg-fixed flex flex-col justify-between items-center ">
      <header className="bg-zinc-800  flex justify-between w-full p-3">
        <img src={Logo} alt="logomarca do IFMA" className="h-10" />
        <button
          className="h-10 p-3  bg-red-500 rounded  hover:bg-red-600 text-zinc-200 font-semibold"
          onClick={signOut}
        >
          Sair
        </button>
      </header>
      <div className="flex flex-col gap-3">
        <section className="bg-zinc-800 p-10 rounded-xl opacity-90 flex justify-around items-center">
          <h1 className="text-zinc-200 font-semibold text-lg">Timon</h1>
          {origin === 'teresina' ? (
            <ArrowFatLeft weight="fill" color="#e4e4e7" size={32} />
          ) : origin === 'timon' ? (
            <ArrowFatRight weight="fill" color="#e4e4e7" size={32} />
          ) : (
            <HandPalm weight="fill" color="#ef4444" size={32} />
          )}
          <h1 className="text-zinc-200 font-semibold text-lg">Teresina</h1>
        </section>
        <h1 className="text-center text-zinc-200 font-bold text-2xl">
          {timeLeft}
        </h1>

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
            onClick={() => setOrigin('stop')}
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
