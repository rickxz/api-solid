import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'JavaScript Gym',
      description: null,
      latitude: 0,
      longitude: 0,
      phone: null,
    })

    expect(gym.id).toEqual(expect.any(String))
    expect(gymsRepository.items).toHaveLength(1)
  })
})
