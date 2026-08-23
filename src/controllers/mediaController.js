import prisma from '../prisma/client.js'
import { uploadBuffer, destroyAsset } from '../services/cloudinaryService.js'
import { getMediaReferences } from '../utils/mediaReferences.js'
import { mediaMetaSchema } from '../validations/contentSchemas.js'
import { success, failure } from '../utils/apiResponse.js'

export async function uploadMedia(req, res) {
  if (!req.file) {
    return failure(res, 'Selecciona una imagen para subir.', 400)
  }

  const result = await uploadBuffer(req.file.buffer)

  const asset = await prisma.mediaAsset.create({
    data: {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      label: req.body.label || null
    }
  })

  return success(res, asset, 201)
}

export async function listMedia(req, res) {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } })
  return success(res, assets)
}

export async function updateMediaMeta(req, res) {
  const { id } = req.params
  const result = mediaMetaSchema.safeParse(req.body)

  if (!result.success) {
    return failure(res, result.error.issues[0]?.message || 'Datos inválidos.', 422)
  }

  const existing = await prisma.mediaAsset.findUnique({ where: { id } })
  if (!existing) {
    return failure(res, 'No se encontró la imagen.', 404)
  }

  const updated = await prisma.mediaAsset.update({ where: { id }, data: result.data })
  return success(res, updated)
}

export async function deleteMedia(req, res) {
  const { id } = req.params

  const existing = await prisma.mediaAsset.findUnique({ where: { id } })
  if (!existing) {
    return failure(res, 'No se encontró la imagen.', 404)
  }

  const references = await getMediaReferences(id)

  if (references.length > 0) {
    return failure(res, `No se puede eliminar: esta imagen se usa en ${references.join(', ')}.`, 409)
  }

  await destroyAsset(existing.publicId)
  await prisma.mediaAsset.delete({ where: { id } })

  return success(res, null)
}
