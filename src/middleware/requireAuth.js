import { verifyToken } from '../auth/jwt.js'
import { failure } from '../utils/apiResponse.js'

export function requireAuth(req, res, next) {
  const token = req.cookies?.token

  if (!token) {
    return failure(res, 'No autorizado.', 401)
  }

  try {
    const payload = verifyToken(token)
    req.user = payload
    return next()
  } catch (error) {
    return failure(res, 'Sesión inválida o expirada.', 401)
  }
}
