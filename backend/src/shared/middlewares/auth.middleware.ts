import { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    request.log.warn({ err }, 'Falha de autenticacao JWT')
    return reply.status(401).send({ message: 'Nao autorizado' })
  }
}
