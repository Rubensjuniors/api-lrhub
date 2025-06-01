import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeAuthenticateService } from '@/services/Auth/authenticate'
import { InvalidCredentialsError } from '@/services/Auth/errors/InvalidCredentialsError'

import {
  COOKIE_CONFIG_REFRESH_TOKEN,
  COOKIE_CONFIG_TOKEN,
  ERROR_MESSAGE,
  REFRESH_TOKEN_EXPIRES_IN,
  TOKEN_EXPIRES_IN,
} from '../constants'

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = requestBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateService()
    const {
      user: { email: userEmail, id, name, urlCoverPhoto, phone, created_at },
    } = await authenticateUseCase.execute({
      email,
      password,
    })

    const userData = {
      id,
      name,
      email: userEmail,
      created_at,
      urlCoverPhoto: urlCoverPhoto ?? '',
      phone: phone ?? '',
    }

    const [token, refreshToken] = await Promise.all([
      reply.jwtSign(
        { ...userData },
        {
          sign: {
            sub: userData.id,
            expiresIn: TOKEN_EXPIRES_IN,
          },
        },
      ),
      reply.jwtSign(
        { ...userData },
        {
          sign: {
            sub: userData.id,
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
          },
        },
      ),
    ])

    return reply
      .setCookie('token', token, COOKIE_CONFIG_TOKEN)
      .setCookie('refreshToken', refreshToken, COOKIE_CONFIG_REFRESH_TOKEN)
      .status(200)
      .send({ message: ERROR_MESSAGE.AUTH_SUCCESS })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: ERROR_MESSAGE.INVALID_USER_DATA, errors: err.errors })
    }

    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: ERROR_MESSAGE.SERVER_ERROR })
  }
}
