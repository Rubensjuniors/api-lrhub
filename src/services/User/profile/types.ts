import { User } from 'generated/prisma'

export interface GetUserProfileServiceRequest {
  userId: string
}

export interface GetUserProfileServiceResponse {
  user: User
}
