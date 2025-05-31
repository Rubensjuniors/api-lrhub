import { User } from 'generated/prisma'

export interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
  urlCoverPhoto?: string
  phone?: string
}

export interface RegisterUseCaseResponse {
  user: User
}
