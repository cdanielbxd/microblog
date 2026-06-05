import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './modules/auth/auth.routes'
import { profilesRoutes } from './modules/profiles/profiles.routes'
import { postsRoutes } from './modules/posts/posts.routes'

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET nao esta definido nas variaveis de ambiente')
  process.exit(1)
}

const fastify = Fastify({ logger: true })

async function start() {
  fastify.addHook('onRequest', async (request) => {
    request.log.info({ method: request.method, url: request.url }, 'Requisicao recebida')
  })

  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  })

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  })

  await fastify.register(authRoutes)
  await fastify.register(profilesRoutes)
  await fastify.register(postsRoutes)

  fastify.get('/health', async () => ({ status: 'ok' }))

  const port = parseInt(process.env.PORT || '3333', 10)
  await fastify.listen({ port, host: '0.0.0.0' })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
