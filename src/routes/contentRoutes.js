import { Router } from 'express'
import { getPublicContent } from '../controllers/contentController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(getPublicContent))

export default router
