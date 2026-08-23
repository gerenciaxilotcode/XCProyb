import { Router } from 'express'
import prisma from '../prisma/client.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { failure } from '../utils/apiResponse.js'
import { heroController, ctaController, brandController, contactInfoController } from '../controllers/contentController.js'
import { createCollectionController } from '../controllers/collectionController.js'
import {
  processStepSchema,
  serviceSchema,
  sectorSchema,
  differentiatorSchema,
  offerSchema,
  reorderSchema
} from '../validations/contentSchemas.js'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/hero', asyncHandler(heroController.get))
router.put('/hero', asyncHandler(heroController.update))

router.get('/cta', asyncHandler(ctaController.get))
router.put('/cta', asyncHandler(ctaController.update))

router.get('/brand', asyncHandler(brandController.get))
router.put('/brand', asyncHandler(brandController.update))

router.get('/contact', asyncHandler(contactInfoController.get))
router.put('/contact', asyncHandler(contactInfoController.update))

function mountCollection(path, delegate, schema, options) {
  const controller = createCollectionController(delegate, schema, options)
  router.get(`/${path}`, asyncHandler(controller.list))
  router.post(`/${path}`, asyncHandler(controller.create))
  router.put(`/${path}/:id`, asyncHandler(controller.update))
  router.delete(`/${path}/:id`, asyncHandler(controller.remove))
  router.post(`/${path}/reorder`, (req, res, next) => {
    const result = reorderSchema.safeParse(req.body)
    if (!result.success) {
      return failure(res, 'Lista de orden inválida.', 422)
    }
    req.body = result.data
    return next()
  }, asyncHandler(controller.reorder))
}

const MEDIA_INCLUDE = { imageAsset: true }

mountCollection('process-steps', prisma.processStep, processStepSchema, { label: 'paso' })
mountCollection('services', prisma.service, serviceSchema, { label: 'servicio', include: MEDIA_INCLUDE })
mountCollection('sectors', prisma.sector, sectorSchema, { label: 'sector', include: MEDIA_INCLUDE })
mountCollection('differentiators', prisma.differentiator, differentiatorSchema, { label: 'diferenciador', include: MEDIA_INCLUDE })
mountCollection('offers', prisma.offer, offerSchema, { label: 'oferta', uniqueField: null, include: MEDIA_INCLUDE })

export default router
