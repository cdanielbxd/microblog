import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { AuthService } from './auth.service'

const registerSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  name: z.string().min(1).max(100),
  bio: z.string().max(300).optional(),
})

const loginSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
})

const authService = new AuthService()

export function authController(fastify: FastifyInstance) {
  return {
    async register(request: FastifyRequest, reply: FastifyReply) {
      const parsed = registerSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ message: 'Dados invalidos', errors: parsed.error.issues })
      }

      try {
        const result = await authService.register(parsed.data)
        return reply.status(201).send(result)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro interno'
        return reply.status(409).send({ message })
      }
    },

    async login(request: FastifyRequest, reply: FastifyReply) {
      const parsed = loginSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ message: 'Dados invalidos', errors: parsed.error.issues })
      }

      try {
        const result = await authService.login(parsed.data, fastify)
        return reply.status(200).send(result)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro interno'
        return reply.status(401).send({ message })
      }
    },
  }
}
