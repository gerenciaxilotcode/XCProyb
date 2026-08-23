import { Router } from 'express'
import { createMessage, listMessages, updateStatus } from '../controllers/contactController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { validate } from '../middleware/validate.js'
import { contactSchema, updateStatusSchema } from '../validations/contactSchema.js'
import { contactLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/', contactLimiter, validate(contactSchema), asyncHandler(createMessage))
router.get('/', requireAuth, requireAdmin, asyncHandler(listMessages))
router.patch('/:id', requireAuth, requireAdmin, validate(updateStatusSchema), asyncHandler(updateStatus))

export default router
