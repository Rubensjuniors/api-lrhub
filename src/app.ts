import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { env } from '@/env'
import { auth } from '@/routes/auth'
import { user } from '@/routes/User'

export const app = fastify().withTypeProvider()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// register cors
app.register(cors, {
  origin: env.NODE_ENV === 'development' ? true : env.WEB_URL,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
})

// Register Cookies
app.register(fastifyCookie)

// jwt configuration
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
  verify: {
    extractToken: (request) => {
      const refreshToken = request.cookies.refreshToken
      if (refreshToken) {
        return refreshToken
      }
      return request.cookies.token
    },
  },
})

// swagger configuration
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: env.TITLE,
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Register Routesv
app.register(auth)
app.register(user)

// Set errors OK
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
