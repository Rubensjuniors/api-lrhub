import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const REFRESH_TOKEN_EXPIRES_IN = '1d'
const TOKEN_EXPIRES_IN = '1m'
const COOKIE_CONFIG = {
  path: '/',
  secure: true,
  sameSite: 'strict',
  httpOnly: true,
  maxAge: 60 * 60 * 24, // 1 dia em segundos
} as const

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
    await request.jwtVerify({ onlyCookie: true })

    const user = {
      ...request.user,
      password_hash: undefined,
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

    const newRefreshToken = await reply.jwtSign(
      { ...user },
      {
        sign: {
          sub: user.sub,
          expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        },
      },
    )

    return reply.setCookie('refreshToken', newRefreshToken, COOKIE_CONFIG).status(200).send({
      token: token,
    })
  } catch (error) {
    console.error('Error refreshing token:', error)

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Invalid user data',
        errors: error.errors,
      })
    }

    return reply.status(401).send({
      message: 'Invalid refresh token',
    })
  }
}
