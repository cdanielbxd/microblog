import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '../services/auth.service'

interface AuthContextData {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('@DevConnect:token')
    const storedUser = localStorage.getItem('@DevConnect:user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser) as AuthUser)
    }
  }, [])

  function login(userData: AuthUser, userToken: string) {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('@DevConnect:token', userToken)
    localStorage.setItem('@DevConnect:user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('@DevConnect:token')
    localStorage.removeItem('@DevConnect:user')
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
