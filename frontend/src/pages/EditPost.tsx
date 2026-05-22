import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../services/getApiErrorMessage'
import type { PostItem } from '../services/posts.service'
import { postsService } from '../services/posts.service'

export default function EditPost() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<PostItem | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPost() {
      if (!id) {
        setError('Post invalido.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await postsService.getById(id)
        setPost(data)
        setContent(data.content)
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, 'Nao foi possivel carregar o post.'))
      } finally {
        setLoading(false)
      }
    }

    void loadPost()
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!id) {
      setError('Post invalido.')
      return
    }

    try {
      setSaving(true)
      setError('')
      await postsService.update(id, content)
      navigate('/')
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, 'Nao foi possivel salvar o post.'))
    } finally {
      setSaving(false)
    }
  }

  const isOwner = post ? user?.profile.username === post.profile.username : false

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Editar post</h1>

          {loading ? <p className="mt-4 text-slate-600">Carregando post...</p> : null}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          {!loading && !error && post && !isOwner ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <p>Voce nao pode editar este post porque ele pertence a outro usuario.</p>
              <Link to="/" className="mt-3 inline-block font-medium text-blue-600 hover:text-blue-700">
                Voltar para o feed
              </Link>
            </div>
          ) : null}

          {!loading && post && isOwner ? (
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
                  maxLength={500}
                  required
                />
                <p className="mt-1 text-sm text-slate-500">{content.length}/500 caracteres</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {saving ? 'Salvando...' : 'Salvar alteracoes'}
              </button>
            </form>
          ) : null}
        </section>
      </main>
    </div>
  )
}
