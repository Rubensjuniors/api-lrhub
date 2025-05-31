import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { UserAlreadyExistsError } from '@/services/User/errors/UserAlreadyExistsError'
import { makeRegisterService } from '@/services/User/register'

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    urlCoverPhoto: z.string().optional(),
    phone: z.string().optional(),
  })

  const { email, name, password, urlCoverPhoto, phone } = requestBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterService()
    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
      urlCoverPhoto,
      phone,
    })

    return reply.status(201).send(user)
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
