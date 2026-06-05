import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PostsService } from './posts.service'

const postBodySchema = z.object({
  content: z.string().min(1, 'Conteudo nao pode ser vazio').max(500, 'Maximo 500 caracteres'),
})

type PostIdParams = { id: string }
type PaginationQuery = { page?: string; limit?: string }

const postsService = new PostsService()

export const postsController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = postBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ message: 'Dados invalidos', errors: parsed.error.issues })
    }

    const post = await postsService.create(parsed.data.content, request.user.profileId)
    return reply.status(201).send(post)
  },

  async update(request: FastifyRequest<{ Params: PostIdParams }>, reply: FastifyReply) {
    const parsed = postBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ message: 'Dados invalidos', errors: parsed.error.issues })
    }

    try {
      const post = await postsService.update(request.params.id, parsed.data.content, request.user.profileId)
      return reply.send(post)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro interno'
      if (message === 'Forbidden') {
        return reply.status(403).send({ message: 'Proibido' })
      }
      if (message === 'Post nao encontrado') {
        return reply.status(404).send({ message })
      }
      return reply.status(500).send({ message })
    }
  },

  async delete(request: FastifyRequest<{ Params: PostIdParams }>, reply: FastifyReply) {
    try {
      await postsService.delete(request.params.id, request.user.profileId)
      return reply.status(204).send()
    } catch (err: unknown) {
      request.log.error({ err, postId: request.params.id, profileId: request.user?.profileId }, 'Erro ao excluir post')
      const message = err instanceof Error ? err.message : 'Erro interno'
      if (message === 'Forbidden') {
        return reply.status(403).send({ message: 'Proibido' })
      }
      if (message === 'Post nao encontrado') {
        return reply.status(404).send({ message })
      }
      return reply.status(500).send({ message })
    }
  },

  async getById(request: FastifyRequest<{ Params: PostIdParams }>, reply: FastifyReply) {
    try {
      const post = await postsService.getById(request.params.id)
      return reply.send(post)
    } catch {
      return reply.status(404).send({ message: 'Post nao encontrado' })
    }
  },

  async getFeed(request: FastifyRequest<{ Querystring: PaginationQuery }>, reply: FastifyReply) {
    const page = Math.max(1, parseInt(request.query.page ?? '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(request.query.limit ?? '10', 10)))
    const result = await postsService.getFeed(page, limit)
    return reply.send(result)
  },
}
