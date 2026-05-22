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
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
