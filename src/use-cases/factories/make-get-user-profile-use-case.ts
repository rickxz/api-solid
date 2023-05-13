import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const getUserProfile = new GetUserProfileUseCase(prismaUsersRepository)

  return getUserProfile
}
