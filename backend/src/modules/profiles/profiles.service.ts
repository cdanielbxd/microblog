import prisma from '../../shared/prisma/client'

const PROFILE_SELECT = {
  id: true,
  username: true,
  name: true,
  bio: true,
  createdAt: true,
} as const

const PROFILE_POST_SELECT = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  profile: {
    select: {
      username: true,
      name: true,
    },
  },
} as const

export class ProfilesService {
  async getByUsername(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: PROFILE_SELECT,
    })

    if (!profile) {
      throw new Error('Perfil nao encontrado')
    }

    return profile
  }

  async getPostsByUsername(username: string, page: number, limit: number) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true, username: true, name: true, bio: true },
    })

    if (!profile) {
      throw new Error('Perfil nao encontrado')
    }

    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { profileId: profile.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: PROFILE_POST_SELECT,
      }),
      prisma.post.count({
        where: { profileId: profile.id },
      }),
    ])

    return {
      profile,
      posts,
      total,
      page,
      limit,
    }
  }
}
