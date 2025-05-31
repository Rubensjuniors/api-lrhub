import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeAuthenticateService } from '@/services/Auth/authenticate'
import { InvalidCredentialsError } from '@/services/Auth/errors/InvalidCredentialsError'

const REFRESH_TOKEN_EXPIRES_IN = '1d'
const TOKEN_EXPIRES_IN = '1m'
const COOKIE_CONFIG = {
  path: '/',
  secure: true,
  sameSite: 'strict',
  httpOnly: true,
  maxAge: 60 * 60 * 24, // 1 dia em segundos
} as const

interface AuthenticateResponse {
  token: string
}

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

    const userData = {
      id,
      name,
      email: userEmail,
      urlCoverPhoto: urlCoverPhoto ?? '',
      phone: phone ?? '',
    }

    const [token, refreshToken] = await Promise.all([
      reply.jwtSign(
        { ...userData, password_hash: undefined },
        { sign: { sub: userData.id, expiresIn: TOKEN_EXPIRES_IN } },
      ),
      reply.jwtSign(
        { ...userData, password_hash: undefined },
        { sign: { sub: userData.id, expiresIn: REFRESH_TOKEN_EXPIRES_IN } },
      ),
    ])

    return reply
      .setCookie('refreshToken', refreshToken, COOKIE_CONFIG)
      .status(200)
      .send({ token } satisfies AuthenticateResponse)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data', errors: err.errors })
    }

    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
