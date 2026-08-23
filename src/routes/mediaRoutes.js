import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { upload } from '../middleware/upload.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadMedia, listMedia, updateMediaMeta, deleteMedia } from '../controllers/mediaController.js'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/', asyncHandler(listMedia))
router.post('/', upload.single('file'), asyncHandler(uploadMedia))
router.patch('/:id', asyncHandler(updateMediaMeta))
router.delete('/:id', asyncHandler(deleteMedia))

export default router
