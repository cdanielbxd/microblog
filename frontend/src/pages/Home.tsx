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
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h1 className="text-4xl font-bold text-slate-900">Feed</h1>
          <p className="mt-2 text-slate-600">Posts publicos mais recentes da comunidade.</p>

          <div className="mt-6 space-y-4">
            {loading ? <p className="text-slate-600">Carregando posts...</p> : null}
            {error ? <p className="text-red-600">{error}</p> : null}

            {!loading && !error && posts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">
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
              className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm text-slate-600">
              Pagina {page} de {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((currentPage) => (currentPage < totalPages ? currentPage + 1 : currentPage))}
              disabled={page >= totalPages}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proxima
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
