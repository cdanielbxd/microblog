import prisma from '../../shared/prisma/client'

const POST_SELECT = {
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

export class PostsService {
  async create(content: string, profileId: string) {
    return prisma.post.create({
      data: { content, profileId },
      select: POST_SELECT,
    })
  }

  async update(postId: string, content: string, profileId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      throw new Error('Post nao encontrado')
    }
    if (post.profileId !== profileId) {
      throw new Error('Forbidden')
    }

    return prisma.post.update({
      where: { id: postId },
      data: { content },
      select: POST_SELECT,
    })
  }

  async delete(postId: string, profileId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      throw new Error('Post nao encontrado')
    }
    if (post.profileId !== profileId) {
      throw new Error('Forbidden')
    }

    await prisma.post.delete({ where: { id: postId } })
  }

  async getById(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: POST_SELECT,
    })
    if (!post) {
      throw new Error('Post nao encontrado')
    }
    return post
  }

  async getFeed(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: POST_SELECT,
      }),
      prisma.post.count(),
    ])

    return { posts, total, page, limit }
  }
}
