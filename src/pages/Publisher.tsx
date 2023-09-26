import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
export function Publisher() {
  const [thumbnail, setThumbnail] = useState<Blob | File | null>(null)
  const [images, setImages] = useState<string[]>([])

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null
  }, [thumbnail])

  useEffect(() => {
    fetch('http://localhost:3333/notice')
      .then((data) => data.json())
      .then((response) => setImages(response))
  }, [images])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const data = new FormData()
    data.append('image', thumbnail!)
    await api.post('/notice', data)
    setThumbnail(null)
    alert('Notícia cadastrada com sucesso!')
  }

  return (
    <main className="h-full">
      <div className="p-12 flex mb-4 justify-around">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="s">Selecione uma imagem</label>
          <input
            type="file"
            name="s"
            id="s"
            onChange={(event) => setThumbnail(event.target.files![0])}
          />
          <button type="submit" className="btn">
            Cadastrar
          </button>
        </form>
        {preview && (
          <div className="flex flex-col items-center">
            <img src={preview} alt="imagem escolhida" className="max-h-60" />
            <div className="flex gap-2">
              <button className="bg-zinc-800 p-4 rounded hover:bg-zinc-900">
                Enviar
              </button>
              <button
                className="bg-red-400 p-4 rounded hover:bg-red-500"
                onClick={() => {}}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <img
            src={image}
            alt="image"
            key={image}
            className="hover:scale-105"
          />
        ))}
      </div>
    </main>
  )
}
