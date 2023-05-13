import request from 'supertest'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
        phone: null,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Distant Gym',
        description: null,
        latitude: -27.0610928,
        longitude: -49.5229501,
        phone: null,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
