import api from './api'
import type { PostItem } from './posts.service'

export interface PublicProfile {
  id: string
  username: string
  name: string
  bio: string | null
  createdAt: string
}

export interface ProfilePostsResponse {
  profile: {
    id: string
    username: string
    name: string
    bio: string | null
  }
  posts: PostItem[]
  total: number
  page: number
  limit: number
}

export const profilesService = {
  async getByUsername(username: string) {
    const response = await api.get<PublicProfile>(`/profiles/${username}`)
    return response.data
  },

  async getPostsByUsername(username: string, page = 1, limit = 10) {
    const response = await api.get<ProfilePostsResponse>(`/profiles/${username}/posts`, {
      params: { page, limit },
    })
    return response.data
  },
}
