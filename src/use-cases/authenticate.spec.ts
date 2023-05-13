import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'argon2'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate an user', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456'),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateUseCase.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456'),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'johndoe@example.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
