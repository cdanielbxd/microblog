import { FastifyInstance } from 'fastify'
import { authenticate } from '../../shared/middlewares/auth.middleware'
import { postsController } from './posts.controller'

type PostIdParams = { id: string }

export async function postsRoutes(fastify: FastifyInstance) {
  fastify.get('/posts', postsController.getFeed)
  fastify.get<{ Params: PostIdParams }>('/posts/:id', postsController.getById)

  fastify.post('/posts', { preHandler: [authenticate] }, postsController.create)
  fastify.put<{ Params: PostIdParams }>(
    '/posts/:id',
    { preHandler: [authenticate] },
    postsController.update,
  )
  fastify.delete<{ Params: PostIdParams }>(
    '/posts/:id',
    { preHandler: [authenticate] },
    postsController.delete,
  )
}
