import prisma from '../prisma/client.js'
import { success, failure } from '../utils/apiResponse.js'
import { heroSchema, ctaBlockSchema, brandSchema, contactInfoSchema } from '../validations/contentSchemas.js'

const MEDIA_INCLUDE = { imageAsset: true }

export async function getPublicContent(req, res) {
  const [hero, cta, brand, contact, services, sectors, differentiators, processSteps, offers] = await Promise.all([
    prisma.homeHero.findUnique({ where: { id: 'main' }, include: MEDIA_INCLUDE }),
    prisma.ctaBlock.findUnique({ where: { id: 'main' } }),
    prisma.brandSettings.findUnique({ where: { id: 'main' }, include: { logoAsset: true, faviconAsset: true } }),
    prisma.contactInfo.findUnique({ where: { id: 'main' } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { order: 'asc' }, include: MEDIA_INCLUDE }),
    prisma.sector.findMany({ where: { active: true }, orderBy: { order: 'asc' }, include: MEDIA_INCLUDE }),
    prisma.differentiator.findMany({ where: { active: true }, orderBy: { order: 'asc' }, include: MEDIA_INCLUDE }),
    prisma.processStep.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
    prisma.offer.findMany({ where: { active: true }, orderBy: { order: 'asc' }, include: MEDIA_INCLUDE })
  ])

  return success(res, { hero, cta, brand, contact, services, sectors, differentiators, processSteps, offers })
}

function buildSingletonController(delegate, schema, include) {
  return {
    async get(req, res) {
      const item = await delegate.findUnique({ where: { id: 'main' }, include })
      return success(res, item)
    },
    async update(req, res) {
      const result = schema.safeParse(req.body)

      if (!result.success) {
        return failure(res, result.error.issues[0]?.message || 'Datos inválidos.', 422)
      }

      const item = await delegate.upsert({
        where: { id: 'main' },
        update: result.data,
        create: { id: 'main', ...result.data },
        include
      })

      return success(res, item)
    }
  }
}

export const heroController = buildSingletonController(prisma.homeHero, heroSchema, MEDIA_INCLUDE)
export const ctaController = buildSingletonController(prisma.ctaBlock, ctaBlockSchema)
export const brandController = buildSingletonController(prisma.brandSettings, brandSchema, { logoAsset: true, faviconAsset: true })
export const contactInfoController = buildSingletonController(prisma.contactInfo, contactInfoSchema)
