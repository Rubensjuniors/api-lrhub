import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeAuthenticateService } from '@/services/Auth/authenticate'
import { InvalidCredentialsError } from '@/services/Auth/errors/InvalidCredentialsError'

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = requestBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateService()
    const {
      user: { email: userEmail, id, name, urlCoverPhoto, phone },
    } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        id,
        name,
        email: userEmail,
        urlCoverPhoto: urlCoverPhoto ? urlCoverPhoto : '',
        phone: phone ? phone : '',
      },
      {
        sign: {
          sub: id,
        },
      },
    )

    return reply.status(200).send(token)
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
