import { Router } from 'express'
import { login, logout, me } from '../controllers/authController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/login', authLimiter, asyncHandler(login))
router.post('/logout', requireAuth, asyncHandler(logout))
router.get('/me', requireAuth, asyncHandler(me))

export default router
