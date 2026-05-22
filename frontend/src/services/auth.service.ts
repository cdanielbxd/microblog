import api from './api'

export interface RegisterData {
  email: string
  password: string
  username: string
  name: string
  bio?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface Profile {
  id: string
  username: string
  name: string
  bio: string | null
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async login(data: LoginData) {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },
}
