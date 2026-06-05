import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="border-b border-slate-700 bg-slate-950/95">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-devconnect-200">
          DevConnect
        </Link>

        <nav className="flex items-center gap-3 text-sm text-slate-300">
          <Link to="/" className="hover:text-white">
            Feed
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link to={`/perfil/${user.profile.username}`} className="hover:text-white">
                Meu perfil
              </Link>
              <Link to="/post/novo" className="btn-primary">
                Novo post
              </Link>
              <button type="button" onClick={logout} className="btn-secondary">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white">
                Entrar
              </Link>
              <Link to="/register" className="btn-primary">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
