import api from './api'

export interface PostItem {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  profile: {
    username: string
    name: string
  }
}

export interface FeedResponse {
  posts: PostItem[]
  total: number
  page: number
  limit: number
}

export const postsService = {
  async getFeed(page = 1, limit = 10) {
    const response = await api.get<FeedResponse>('/posts', {
      params: { page, limit },
    })
    return response.data
  },

  async getById(id: string) {
    const response = await api.get<PostItem>(`/posts/${id}`)
    return response.data
  },

  async create(content: string) {
    const response = await api.post<PostItem>('/posts', { content })
    return response.data
  },

  async update(id: string, content: string) {
    const response = await api.put<PostItem>(`/posts/${id}`, { content })
    return response.data
  },

  async delete(id: string) {
    await api.delete(`/posts/${id}`)
  },
}
