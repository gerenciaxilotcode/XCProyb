import prisma from '../prisma/client.js'
import { success, failure } from '../utils/apiResponse.js'

export async function createMessage(req, res) {
  const { business, phone, budget, ...rest } = req.body

  const message = await prisma.contactMessage.create({
    data: {
      ...rest,
      business: business || null,
      phone: phone || null,
      budget: budget || null
    }
  })

  return success(res, { id: message.id }, 201)
}

export async function listMessages(req, res) {
  const { status } = req.query

  const messages = await prisma.contactMessage.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' }
  })

  return success(res, messages)
}

export async function updateStatus(req, res) {
  const { id } = req.params
  const { status } = req.body

  const existing = await prisma.contactMessage.findUnique({ where: { id } })

  if (!existing) {
    return failure(res, 'No fue posible encontrar este mensaje.', 404)
  }

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { status }
  })

  return success(res, message)
}
