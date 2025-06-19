import {Router} from 'express'
import { handleWebhook } from '@/app/controllers/user/se-pay.controller'
import { asyncHandler } from '@/utils/helpers'


const router = Router()

router.post('/', asyncHandler(handleWebhook))

export default router