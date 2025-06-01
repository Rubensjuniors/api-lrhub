import { FastifyReply } from 'fastify'
import { FastifyRequest } from 'fastify'

import { ERROR_MESSAGE } from '../constants'

export function logoutController(_request: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie('token', { path: '/' })
    .clearCookie('refreshToken', { path: '/' })
    .status(201)
    .send({ message: ERROR_MESSAGE.LOGOUT_SUCCESS })
}
