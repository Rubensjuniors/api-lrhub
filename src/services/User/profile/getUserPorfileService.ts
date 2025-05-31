import { UsersRepository } from '@/repositories/User/types'
import { ResourceNotFoundError } from '@/services/Errors/ResourceNotFoundError'

import { GetUserProfileServiceRequest, GetUserProfileServiceResponse } from './types'

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
