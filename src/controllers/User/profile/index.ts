import { FastifyReply, FastifyRequest } from 'fastify'

export async function profileController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = request.user

    if (!user) {
      return reply.status(401).send({ message: 'User not authenticated' })
    }

    const filteredUser = {
      id: user.sub,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      urlCoverPhoto: user.urlCoverPhoto ?? '',
      phone: user.phone ?? '',
    }

    return reply.status(200).send(filteredUser)
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
