import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../services/getApiErrorMessage'
import type { PostItem } from '../services/posts.service'
import { postsService } from '../services/posts.service'

interface PostCardProps {
  post: PostItem
  onDeleted?: () => void
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(data))
}

export default function PostCard({ post, onDeleted }: PostCardProps) {
  const { isAuthenticated, user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const isOwner = isAuthenticated && user?.profile.username === post.profile.username

  async function handleDelete() {
    const confirmed = window.confirm('Tem certeza que deseja excluir este post?')
    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)
      setError('')
      await postsService.delete(post.id)
      onDeleted?.()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, 'Nao foi possivel excluir o post.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to={`/perfil/${post.profile.username}`}
            className="text-lg font-semibold text-slate-900 hover:text-blue-600"
          >
            {post.profile.name}
          </Link>
          <p className="text-sm text-slate-500">@{post.profile.username}</p>
        </div>

        <p className="text-sm text-slate-400">{formatarData(post.createdAt)}</p>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-slate-700">{post.content}</p>

      {isOwner ? (
        <div className="mt-4 flex items-center gap-3">
          <Link to={`/post/editar/${post.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Editar
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:text-red-300"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </article>
  )
}
