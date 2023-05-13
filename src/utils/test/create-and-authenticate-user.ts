import { prisma } from '@/lib/prisma'
import { hash } from 'argon2'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456'),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@email.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
