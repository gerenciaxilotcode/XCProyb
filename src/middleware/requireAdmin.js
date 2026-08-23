import { failure } from '../utils/apiResponse.js'

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return failure(res, 'Permisos insuficientes.', 403)
  }
  return next()
}
