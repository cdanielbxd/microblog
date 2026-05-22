import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getApiErrorMessage } from '../services/getApiErrorMessage'
import { postsService } from '../services/posts.service'

export default function CreatePost() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      await postsService.create(content)
      navigate('/')
    } catch (createError) {
      setError(getApiErrorMessage(createError, 'Nao foi possivel criar o post.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Novo post</h1>
          <p className="mt-2 text-slate-600">Escreva um texto curto para publicar no seu perfil.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="content" className="mb-1 block text-sm font-medium text-slate-700">
                Conteudo
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-40 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="O que voce quer compartilhar hoje?"
                maxLength={500}
                required
              />
              <p className="mt-1 text-sm text-slate-500">{content.length}/500 caracteres</p>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? 'Publicando...' : 'Publicar post'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
