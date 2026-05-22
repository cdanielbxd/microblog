import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import prisma from '../../shared/prisma/client'

interface RegisterInput {
  email: string
  password: string
  username: string
  name: string
  bio?: string
}

interface LoginInput {
  email: string
  password: string
}

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser) {
      throw new Error('Email ja cadastrado')
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { username: data.username },
    })
    if (existingProfile) {
      throw new Error('Username ja esta em uso')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        profile: {
          create: {
            username: data.username,
            name: data.name,
            bio: data.bio ?? null,
          },
        },
      },
      include: { profile: true },
    })

    return {
      id: user.id,
      email: user.email,
      profile: user.profile
        ? {
            id: user.profile.id,
            username: user.profile.username,
            name: user.profile.name,
            bio: user.profile.bio,
          }
        : null,
    }
  }

  async login(data: LoginInput, fastify: FastifyInstance) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true },
    })

    if (!user || !user.profile) {
      throw new Error('Credenciais invalidas')
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) {
      throw new Error('Credenciais invalidas')
    }

    const token = fastify.jwt.sign({
      userId: user.id,
      profileId: user.profile.id,
      username: user.profile.username,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: {
          id: user.profile.id,
          username: user.profile.username,
          name: user.profile.name,
          bio: user.profile.bio,
        },
      },
    }
  }
}
