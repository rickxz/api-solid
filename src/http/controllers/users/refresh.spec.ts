import request from 'supertest'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@email.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const refreshTokenResponse = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(refreshTokenResponse.statusCode).toEqual(200)

    expect(refreshTokenResponse.body).toEqual({
      token: expect.any(String),
    })

    expect(refreshTokenResponse.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
