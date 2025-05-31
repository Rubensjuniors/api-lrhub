import { PrismaUsersRepository } from '@/repositories/User/UsersRepository'

import { AuthenticateService } from './authenticateServices'

export function makeAuthenticateService() {
  const prismaUsers = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateService(prismaUsers)

  return authenticateUseCase
}
