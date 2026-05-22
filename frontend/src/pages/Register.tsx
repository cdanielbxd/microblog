import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { authService } from '../services/auth.service'
import { getApiErrorMessage } from '../services/getApiErrorMessage'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    name: '',
    bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(field: 'email' | 'password' | 'username' | 'name' | 'bio', value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      await authService.register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        name: formData.name,
        bio: formData.bio || undefined,
      })

      navigate('/login')
    } catch (registerError) {
      setError(getApiErrorMessage(registerError, 'Nao foi possivel concluir o cadastro.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-8">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Criar conta</h1>
          <p className="mt-2 text-slate-600">Preencha os dados para criar seu usuario e perfil publico.</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Nome
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                autoComplete="name"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                value={formData.username}
                onChange={(event) => updateField('username', event.target.value)}
                autoComplete="username"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="seu_username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="voce@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(event) => updateField('password', event.target.value)}
                autoComplete="new-password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="Minimo de 6 caracteres"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(event) => updateField('bio', event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="Conte um pouco sobre voce"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Ja possui conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Entrar
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
