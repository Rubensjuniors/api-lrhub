import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { env } from './env'
import { user } from './routes/User'

export const app = fastify().withTypeProvider()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: true, // Permite todas as origens
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: env.TITLE,
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Formato do token (opcional)
        },
      },
    },
  },
  transform: jsonSchemaTransform, // Supondo que seja para transformar os schemas
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(user)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here e should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
})
