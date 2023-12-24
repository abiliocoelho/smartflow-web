import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { connect } from 'precompiled-mqtt'
import { ArrowFatLeft, ArrowFatRight, HandPalm } from '@phosphor-icons/react'
import Logo from '../assets/if.png'
import { api } from '../services/api'

type Message = {
  origin: string
  remainingtime: number
  updated: number
}

const MQTT_SERVER = '137.184.232.116:9001'
const TOPIC = 'esp32_topic'

export function Dashboard() {
  const [origin, setOrigin] = useState('')
  const [timer, setTimer] = useState(0)
  const [scale, setScale] = useState('')
  const [messageToReceive, setMessageToReceive] = useState<Message>()
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

  async function handleSend() {
    if (origin !== '') {
      switch (scale) {
        case 'segundos':
          await api.post('/state', {
            origin,
            remainingtime: timer,
            updated: new Date().getTime(),
          })
          break
        case 'minutos':
          await api.post('/state', {
            origin,
            remainingtime: timer * 60,
            updated: new Date().getTime(),
          })
          break
        case 'horas':
          await api.post('/state', {
            origin,
            remainingtime: timer * 60 * 60,
            updated: new Date().getTime(),
          })
          break
        case 'dias':
          await api.post('/state', {
            origin,
            remainingtime: timer * 60 * 60 * 24,
            updated: new Date().getTime(),
          })
          break

        default:
          alert('Escolha a escala de tempo')
          break
      }
    } else {
      alert('Escolha a origem')
    }
  }

  async function handleStop() {
    await api.post('/state', {
      origin: 'stop',
      remainingtime: 0,
      updated: new Date().getTime(),
    })
  }

  useEffect(() => {
    const client = connect({
      username: 'mosquitto',
      password: '8PMshux16',
      protocol: 'wss',
      host: '137.184.232.116',
      port: 9001,
    })

    client.on('connect', () => {
      console.log('Conectado ao servidor MQTT')
      client.subscribe(TOPIC)
    })

    client.on('message', (topic, payload) => {
      console.log(`Recebido no tópico ${topic}: ${payload.toString()}`)
      setMessageToReceive(JSON.parse(payload.toString()))
    })

    return () => {
      client.end()
    }
  }, [])
  useEffect(() => {
    let timeRemaining: number
    fetch('https://worldtimeapi.org/api/timezone/America/fortaleza')
      .then((data) => data.json())
      .then((response) => {
        timeRemaining = messageToReceive
          ? messageToReceive?.remainingtime -
            (response.unixtime - messageToReceive?.updated)
          : 0
      })
    const timers = setInterval(() => {
      if (timeRemaining >= 0) {
        setTimeLeft(updateTimer(timeRemaining))
        timeRemaining -= 1
      }
    }, 1000)
    return () => clearInterval(timers)
  }, [messageToReceive])

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
          {messageToReceive?.origin === 'teresina' ? (
            <ArrowFatLeft weight="fill" color="#e4e4e7" size={32} />
          ) : messageToReceive?.origin === 'timon' ? (
            <ArrowFatRight weight="fill" color="#e4e4e7" size={32} />
          ) : (
            <HandPalm weight="fill" color="#ef4444" size={32} />
          )}
          <h1 className="text-zinc-200 font-semibold text-lg">Teresina</h1>
        </section>
        <div>
          <h1 className="text-center text-red-500 font-bold text-xl leading-3">
            DD:HH:MM:SS
          </h1>
          <h1 className="text-center text-zinc-200 font-bold text-2xl">
            {timeLeft}
          </h1>
        </div>

        <section className="bg-zinc-800 p-10 rounded-xl opacity-90 flex flex-col gap-3 max-w-xs">
          <label className="text-zinc-200">
            Origem
            <select
              className="h-10 rounded bg-zinc-700 w-full "
              onChange={(e) => setOrigin(e.target.value)}
              value={origin}
            >
              <option disabled={true} value="">
                Escolha
              </option>
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
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
            />
          </div>
          <label className="text-zinc-200">
            Escolha a opção
            <select
              className="h-10 rounded bg-zinc-700 w-full "
              onChange={(e) => setScale(e.target.value)}
              value={scale}
            >
              <option disabled={true} value="">
                Escolha
              </option>
              <option value="segundos">segundos</option>
              <option value="minutos">minutos</option>
              <option value="horas">horas</option>
              <option value="dias">dias</option>
            </select>
          </label>
          <button
            className="h-10 w-full bg-emerald-500 rounded  hover:bg-emerald-600 text-zinc-200 font-semibold"
            onClick={handleSend}
          >
            Enviar
          </button>
          <button
            className="h-10 w-full bg-red-500 rounded  hover:bg-red-600 text-zinc-200 font-semibold"
            onClick={handleStop}
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
