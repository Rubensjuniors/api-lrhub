import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { COOKIE_CONFIG_TOKEN, ERROR_MESSAGE, TOKEN_EXPIRES_IN } from '../constants'

const userSchema = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.date(),
  urlCoverPhoto: z.string().optional(),
  phone: z.string().optional(),
})

type User = z.infer<typeof userSchema>

export async function refreshTokenController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const refreshToken = request.cookies.refreshToken

    if (!refreshToken) {
      return reply.status(401).send({
        message: 'Refresh token não encontrado',
      })
    }

    await request.jwtVerify()

    const user = {
      ...request.user,
    } as User

    const token = await reply.jwtSign(
      {
        ...user,
      },
      {
        sign: {
          sub: user.sub,
          expiresIn: TOKEN_EXPIRES_IN,
        },
      },
    )

    return reply
      .setCookie('token', token, COOKIE_CONFIG_TOKEN)
      .status(200)
      .send({ message: ERROR_MESSAGE.TOKEN_RENEWED })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: ERROR_MESSAGE.INVALID_USER_DATA,
        errors: error.errors,
      })
    }

    return reply.status(401).send({
      message: ERROR_MESSAGE.INVALID_REFRESH_TOKEN,
    })
  }
}
