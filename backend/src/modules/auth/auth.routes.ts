import { FastifyInstance } from 'fastify'
import { authController } from './auth.controller'

export async function authRoutes(fastify: FastifyInstance) {
  const controller = authController(fastify)

  fastify.post('/auth/register', controller.register)
  fastify.post('/auth/login', controller.login)
}
