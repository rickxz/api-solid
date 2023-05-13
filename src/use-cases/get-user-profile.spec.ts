import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { hash } from 'argon2'
import { ResourceNotFoundError } from './errors/resource-not-foud-error'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get an user profile', async () => {
    const created_user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456'),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: created_user.id,
    })

    expect(user.id).toEqual(created_user.id)
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get an user profile with incorrect id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'not-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
