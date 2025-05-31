import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: {
      name: string
      email: string
      photoUrl: string
    } // payload type is used for signing and verifying
    user: {
      sub: string
    } // user type is return type of `request.user` object
  }
}
