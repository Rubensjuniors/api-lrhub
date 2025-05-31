import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { authenticateController } from '@/controllers/Auth/authenticate'
import { refreshTokenController } from '@/controllers/Auth/refreshToken'

export const auth: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        operationId: 'login',
        description: 'Authenticate user.',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({ message: z.string(), errors: z.array(z.any()).optional() }),
          401: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    authenticateController,
  )

  app.patch(
    '/auth/refreshToken',
    {
      schema: {
        tags: ['Auth'],
        operationId: 'refreshToken',
        description: 'Refresh user authentication token',
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
            errors: z.array(z.any()).optional(),
          }),
          401: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    refreshTokenController,
  )
}
