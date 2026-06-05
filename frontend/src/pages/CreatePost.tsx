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
        <section className="card-base">
          <h1 className="text-3xl font-bold text-white">Novo post</h1>
          <p className="mt-2 text-slate-400">Compartilhe ideias, projetos e experiências com a comunidade.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="content" className="mb-1 block text-sm font-medium text-slate-300">
                Conteudo
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-40 w-full input-base"
                placeholder="O que voce quer compartilhar hoje?"
                maxLength={500}
                required
              />
              <p className="mt-1 text-sm text-slate-400">{content.length}/500 caracteres</p>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Publicando...' : 'Publicar post'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
