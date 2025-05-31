import { User } from '@prisma/client'

export interface AuthenticateServiceRequest {
  email: string
  password: string
}

export interface AuthenticateServiceResponse {
  user: User
}
