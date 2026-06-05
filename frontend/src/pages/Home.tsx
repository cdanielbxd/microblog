import { useEffect, useState } from 'react'
import Header from '../components/Header'
import PostCard from '../components/PostCard'
import { getApiErrorMessage } from '../services/getApiErrorMessage'
import type { FeedResponse, PostItem } from '../services/posts.service'
import { postsService } from '../services/posts.service'

const POSTS_POR_PAGINA = 10

export default function Home() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadFeed(currentPage: number) {
    try {
      setLoading(true)
      setError('')
      const data: FeedResponse = await postsService.getFeed(currentPage, POSTS_POR_PAGINA)
      setPosts(data.posts)
      setTotal(data.total)
    } catch (feedError) {
      setError(getApiErrorMessage(feedError, 'Nao foi possivel carregar o feed.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFeed(page)
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / POSTS_POR_PAGINA))

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-devconnect-300">DevConnect</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Um blog para compartilhar ideias, código e experiências.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
            Compartilhe ideias, projetos e experiências com outros desenvolvedores em um espaço elegante, moderno e colaborativo.
          </p>
        </section>

        <section className="card-base">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Feed</h2>
              <p className="mt-1 text-slate-400">Posts públicos mais recentes da comunidade.</p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 shadow-sm">
              {total} posts publicados
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? <p className="text-slate-400">Carregando posts...</p> : null}
            {error ? <p className="text-red-500">{error}</p> : null}

            {!loading && !error && posts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-slate-400">
                Nenhum post publicado ainda.
              </p>
            ) : null}

            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDeleted={() => void loadFeed(page)} />
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={page === 1}
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm text-slate-400">
              Pagina {page} de {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((currentPage) => (currentPage < totalPages ? currentPage + 1 : currentPage))}
              disabled={page >= totalPages}
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proxima
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
