import prisma from '../prisma/client.js'
import { verifyPassword } from '../auth/password.js'
import { signToken } from '../auth/jwt.js'
import { success, failure } from '../utils/apiResponse.js'
import { env } from '../config/env.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return failure(res, 'Correo y contraseña son obligatorios.', 400)
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } })

  if (!admin) {
    return failure(res, 'Credenciales inválidas.', 401)
  }

  const valid = await verifyPassword(admin.passwordHash, password)

  if (!valid) {
    return failure(res, 'Credenciales inválidas.', 401)
  }

  const token = signToken({ sub: admin.id, role: 'ADMIN', email: admin.email })

  res.cookie('token', token, COOKIE_OPTIONS)

  return success(res, { id: admin.id, email: admin.email, name: admin.name })
}

export async function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTIONS)
  return success(res, null)
}

export async function me(req, res) {
  const admin = await prisma.adminUser.findUnique({ where: { id: req.user.sub } })

  if (!admin) {
    return failure(res, 'No autorizado.', 401)
  }

  return success(res, { id: admin.id, email: admin.email, name: admin.name })
}
