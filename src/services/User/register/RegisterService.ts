import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/User/types'

import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError'
import { RegisterUseCaseRequest, RegisterUseCaseResponse } from './types'

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    urlCoverPhoto,
    phone,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 8)

    const checkEmail = await this.usersRepository.findByEmail(email)

    if (checkEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      created_at: new Date(),
      urlCoverPhoto: urlCoverPhoto ? urlCoverPhoto : '',
      phone: phone ? phone : '',
    })

    return {
      user,
    }
  }
}
