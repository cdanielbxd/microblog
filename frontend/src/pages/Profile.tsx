import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import PostCard from '../components/PostCard'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../services/getApiErrorMessage'
import type { PostItem } from '../services/posts.service'
import { profilesService } from '../services/profiles.service'
import type { PublicProfile } from '../services/profiles.service'

const POSTS_POR_PAGINA = 10

export default function Profile() {
  const { username } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProfile(currentPage: number) {
    if (!username) {
      setError('Perfil invalido.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const [profileData, postsData] = await Promise.all([
        profilesService.getByUsername(username),
        profilesService.getPostsByUsername(username, currentPage, POSTS_POR_PAGINA),
      ])

      setProfile(profileData)
      setPosts(postsData.posts)
      setTotal(postsData.total)
    } catch (profileError) {
      setError(getApiErrorMessage(profileError, 'Nao foi possivel carregar o perfil.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProfile(page)
  }, [page, username])

  const totalPages = Math.max(1, Math.ceil(total / POSTS_POR_PAGINA))
  const isOwnProfile = user?.profile.username === profile?.username

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? <p className="text-slate-600">Carregando perfil...</p> : null}
          {error ? <p className="text-red-600">{error}</p> : null}

          {!loading && !error && profile ? (
            <>
              <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
                <p className="text-slate-500">@{profile.username}</p>
                <p className="text-slate-700">{profile.bio || 'Este perfil ainda nao possui bio.'}</p>
                {isOwnProfile ? <p className="text-sm font-medium text-blue-600">Este e o seu perfil publico.</p> : null}
              </div>

              <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-slate-900">Posts</h2>

                {posts.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                    Este perfil ainda nao publicou nenhum post.
                  </p>
                ) : null}

                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onDeleted={() => void loadProfile(page)} />
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                  disabled={page === 1}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Proxima
                </button>
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  )
}
