import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { profileController } from '@/controllers/User/profile'
import { registerController } from '@/controllers/User/register'
import { verifyJWT } from '@/middlewares/verify-jwt'

export const user: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/register/user',
    {
      schema: {
        tags: ['Users'],
        operationId: 'registerUser',
        description: 'Create user.',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
          urlCoverPhoto: z.string().optional(),
          phone: z.string().optional(),
        }),
        response: {
          201: z.object({}),
          409: z.object({ message: z.string() }),
        },
      },
    },
    registerController,
  )
  /** Authenticated */
  app.get(
    '/user/profile',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['Users'],
        operationId: 'getUser',
        description: 'Get User when authenticated.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
            created_at: z.date(),
            urlCoverPhoto: z.string().optional(),
            phone: z.string().optional(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    profileController,
  )
}
