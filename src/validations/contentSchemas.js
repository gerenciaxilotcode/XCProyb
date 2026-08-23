import { z } from 'zod'

export const heroSchema = z.object({
  eyebrow: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  subtitle: z.string().trim().min(1).max(400),
  ctaPrimaryLabel: z.string().trim().min(1).max(60),
  ctaSecondaryLabel: z.string().trim().min(1).max(60),
  tagline: z.string().trim().min(1).max(120),
  imageAssetId: z.string().trim().min(1).nullable().optional()
})

export const ctaBlockSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(400),
  buttonLabel: z.string().trim().min(1).max(60)
})

export const brandSchema = z.object({
  name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(400),
  logoAssetId: z.string().trim().min(1).nullable().optional(),
  faviconAssetId: z.string().trim().min(1).nullable().optional()
})

export const contactInfoSchema = z.object({
  phone: z.string().trim().max(30).nullable().optional(),
  email: z.string().trim().email('Ingresa un correo válido.').nullable().optional().or(z.literal('')),
  whatsappNumber: z.string().trim().min(8, 'Ingresa un número de WhatsApp válido.').max(20),
  whatsappMessage: z.string().trim().max(200).nullable().optional(),
  address: z.string().trim().max(200).nullable().optional(),
  schedule: z.string().trim().max(200).nullable().optional(),
  instagramUrl: z.string().trim().max(300).nullable().optional().or(z.literal('')),
  facebookUrl: z.string().trim().max(300).nullable().optional().or(z.literal('')),
  linkedinUrl: z.string().trim().max(300).nullable().optional().or(z.literal(''))
})

export const processStepSchema = z.object({
  key: z.string().trim().min(1).max(60),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(300),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true)
})

export const serviceSchema = z.object({
  key: z.string().trim().min(1).max(60),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(300),
  iconKey: z.string().trim().min(1).max(40),
  imageAssetId: z.string().trim().min(1).nullable().optional(),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true)
})

export const sectorSchema = z.object({
  key: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300).nullable().optional(),
  imageAssetId: z.string().trim().min(1).nullable().optional(),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true)
})

export const differentiatorSchema = z.object({
  key: z.string().trim().min(1).max(60),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(300),
  iconKey: z.string().trim().min(1).max(40),
  imageAssetId: z.string().trim().min(1).nullable().optional(),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true)
})

export const offerSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(400),
  priceText: z.string().trim().max(60).nullable().optional(),
  ctaLabel: z.string().trim().max(60).nullable().optional(),
  ctaLink: z.string().trim().max(300).nullable().optional(),
  imageAssetId: z.string().trim().min(1).nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(false)
})

export const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string().min(1), order: z.coerce.number().int() })).min(1)
})

export const mediaMetaSchema = z.object({
  altText: z.string().trim().max(200).nullable().optional(),
  label: z.string().trim().max(120).nullable().optional()
})
