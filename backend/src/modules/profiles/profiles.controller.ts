import { FastifyReply, FastifyRequest } from 'fastify'
import { ProfilesService } from './profiles.service'

type UsernameParams = { username: string }
type PaginationQuery = { page?: string; limit?: string }

const profilesService = new ProfilesService()

export const profilesController = {
  async getByUsername(request: FastifyRequest<{ Params: UsernameParams }>, reply: FastifyReply) {
    try {
      const profile = await profilesService.getByUsername(request.params.username)
      return reply.send(profile)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro interno'
      return reply.status(404).send({ message })
    }
  },

  async getPostsByUsername(
    request: FastifyRequest<{ Params: UsernameParams; Querystring: PaginationQuery }>,
    reply: FastifyReply,
  ) {
    const page = Math.max(1, parseInt(request.query.page ?? '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(request.query.limit ?? '10', 10)))

    try {
      const result = await profilesService.getPostsByUsername(request.params.username, page, limit)
      return reply.send(result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro interno'
      return reply.status(404).send({ message })
    }
  },
}
