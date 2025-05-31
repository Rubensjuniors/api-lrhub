import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { registerController } from '@/controllers/User/register'
// import { verifyJWT } from '@/middlewares/verify-jwt'

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
}
