import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/auth.service'
import { getApiErrorMessage } from '../services/getApiErrorMessage'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const data = await authService.login({ email, password })
      login(data.user, data.token)
      navigate('/')
    } catch (loginError) {
      setError(getApiErrorMessage(loginError, 'Nao foi possivel fazer login.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl items-center justify-center px-4 py-8">
        <section className="w-full max-w-md card-base">
          <h1 className="text-3xl font-bold text-white">Entrar</h1>
          <p className="mt-2 text-slate-300">Use seu e-mail e senha para acessar o DevConnect.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="input-base"
                placeholder="voce@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="input-base"
                placeholder="Sua senha"
                required
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-400">
            Ainda nao tem conta?{' '}
            <Link to="/register" className="font-medium text-devconnect-300 hover:text-devconnect-200">
              Criar cadastro
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
