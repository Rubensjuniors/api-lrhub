export const REFRESH_TOKEN_EXPIRES_IN = '1d'
export const TOKEN_EXPIRES_IN = '1m'

export const COOKIE_CONFIG_REFRESH_TOKEN = {
  path: '/',
  secure: true,
  sameSite: 'strict',
  httpOnly: true,
  maxAge: 60 * 60 * 24, // 1 dia em segundos
} as const

export const COOKIE_CONFIG_TOKEN = {
  path: '/',
  secure: true,
  sameSite: 'strict',
  httpOnly: true,
  maxAge: 60 * 60 * 12, // 12H em segundos
} as const

export const ERROR_MESSAGE = {
  AUTH_SUCCESS: 'Authenticated successfully',
  INVALID_REQUEST: 'Invalid request data',
  SERVER_ERROR: 'Internal server error',
  TOKEN_RENEWED: 'Token renovado com sucesso.',
  LOGOUT_SUCCESS: 'Logout feito com sucesso',
  INVALID_USER_DATA: 'Dados do usuário inválidos',
  INVALID_REFRESH_TOKEN: 'Refresh token inválido',
}
