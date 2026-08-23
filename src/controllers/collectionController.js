import { success, failure } from '../utils/apiResponse.js'

export function createCollectionController(delegate, schema, options = {}) {
  const { label = 'elemento', uniqueField = 'key', include } = options

  async function list(req, res) {
    const items = await delegate.findMany({ orderBy: { order: 'asc' }, include })
    return success(res, items)
  }

  async function create(req, res) {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return failure(res, result.error.issues[0]?.message || 'Datos inválidos.', 422)
    }

    if (uniqueField && result.data[uniqueField]) {
      const existing = await delegate.findUnique({ where: { [uniqueField]: result.data[uniqueField] } })
      if (existing) {
        return failure(res, `Ya existe un ${label} con esa clave.`, 409)
      }
    }

    const created = await delegate.create({ data: result.data, include })
    return success(res, created, 201)
  }

  async function update(req, res) {
    const { id } = req.params
    const result = schema.partial().safeParse(req.body)

    if (!result.success) {
      return failure(res, result.error.issues[0]?.message || 'Datos inválidos.', 422)
    }

    const existing = await delegate.findUnique({ where: { id } })
    if (!existing) {
      return failure(res, `No se encontró el ${label}.`, 404)
    }

    const updated = await delegate.update({ where: { id }, data: result.data, include })
    return success(res, updated)
  }

  async function remove(req, res) {
    const { id } = req.params

    const existing = await delegate.findUnique({ where: { id } })
    if (!existing) {
      return failure(res, `No se encontró el ${label}.`, 404)
    }

    await delegate.delete({ where: { id } })
    return success(res, null)
  }

  async function reorder(req, res) {
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return failure(res, 'Lista de orden inválida.', 422)
    }

    await Promise.all(
      items.map((item) => delegate.update({ where: { id: item.id }, data: { order: item.order } }))
    )

    const updated = await delegate.findMany({ orderBy: { order: 'asc' }, include })
    return success(res, updated)
  }

  return { list, create, update, remove, reorder }
}
