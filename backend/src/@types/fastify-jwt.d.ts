import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string
      profileId: string
      username: string
    }
    user: {
      userId: string
      profileId: string
      username: string
    }
  }
}
