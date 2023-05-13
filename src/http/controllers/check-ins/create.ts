import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  const { gymId } = createCheckInParamsSchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    userId: request.user.sub,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return response.status(201).send()
}
