import { PrismaUsersRepository } from '@/repositories/User/UsersRepository'

import { GetUserProfileService } from './getUserPorfileService'

export function makeGetUserProfileService() {
  const prismaUsers = new PrismaUsersRepository()
  const getUserProfile = new GetUserProfileService(prismaUsers)

  return getUserProfile
}
