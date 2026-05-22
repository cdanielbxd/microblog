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
    const storedToken = localStorage.getItem('@microblog:token')
    const storedUser = localStorage.getItem('@microblog:user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser) as AuthUser)
    }
  }, [])

  function login(userData: AuthUser, userToken: string) {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('@microblog:token', userToken)
    localStorage.setItem('@microblog:user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('@microblog:token')
    localStorage.removeItem('@microblog:user')
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
