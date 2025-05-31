import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      name: string
      email: string
      created_at: Date
      urlCoverPhoto?: string
      phone?: string
    }
  }
}
