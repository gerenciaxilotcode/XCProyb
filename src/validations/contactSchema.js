import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es obligatorio.').max(120),
  business: z.string().trim().max(150).optional().or(z.literal('')),
  email: z.string().trim().email('Ingresa un correo válido.'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  projectType: z.enum(['WEBSITE', 'ADMIN_SYSTEM', 'ONLINE_STORE', 'CUSTOM_APP', 'AUTOMATION', 'OTHER']),
  budget: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Cuéntanos un poco más sobre tu proyecto.').max(2000)
})

export const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'READ', 'CONTACTED', 'ARCHIVED'])
})
