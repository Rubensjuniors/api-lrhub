import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

// import { authenticate } from '@/controllers/authenticare'

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
          200: z.string(),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send('Hello World')
    },
  )
}
