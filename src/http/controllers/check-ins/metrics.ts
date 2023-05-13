import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, response: FastifyReply) {
  const fetchUserCheckInsHistoryUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
  })

  return response.status(200).send({ checkInsCount })
}
