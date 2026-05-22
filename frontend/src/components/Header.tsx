import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Microblog
        </Link>

        <nav className="flex items-center gap-3 text-sm text-slate-600">
          <Link to="/" className="hover:text-slate-900">
            Feed
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link to={`/perfil/${user.profile.username}`} className="hover:text-slate-900">
                Meu perfil
              </Link>
              <Link
                to="/post/novo"
                className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Novo post
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-300 px-4 py-2 hover:bg-slate-100"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-slate-900">
                Entrar
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
