import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserProfileService } from '@/services/User/profile'

export async function profileController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfile = makeGetUserProfileService()
    const {
      user: { email, created_at, id, name, urlCoverPhoto, phone },
    } = await getUserProfile.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({
      id,
      name,
      email,
      created_at,
      urlCoverPhoto,
      phone,
    })
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
