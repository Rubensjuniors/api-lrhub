import { PrismaUsersRepository } from '@/repositories/User/UsersRepository'

import { RegisterService } from './RegisterService'

export function makeRegisterService() {
  const prismaUsers = new PrismaUsersRepository()
  const registerUseCase = new RegisterService(prismaUsers)

  return registerUseCase
}
