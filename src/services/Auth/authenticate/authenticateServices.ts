import { compare } from 'bcryptjs'

import { UsersRepository } from '@/repositories/User/types'

import { InvalidCredentialsError } from '../errors/InvalidCredentialsError'
import { AuthenticateServiceRequest, AuthenticateServiceResponse } from './types'

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
