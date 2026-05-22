import { FastifyInstance } from 'fastify'
import { profilesController } from './profiles.controller'

export async function profilesRoutes(fastify: FastifyInstance) {
  fastify.get('/profiles/:username', profilesController.getByUsername)
  fastify.get('/profiles/:username/posts', profilesController.getPostsByUsername)
}
