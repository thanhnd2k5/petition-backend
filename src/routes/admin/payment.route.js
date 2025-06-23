import express from 'express'
import { updatePaymentVerificationRequest } from '@/app/controllers/admin/payment.controller'
import { asyncHandler } from '@/utils/helpers'
import { paymentMiddleware } from '@/app/middleware/admin/payment.middleware'

const router = express.Router()

// Cập nhật trạng thái xác thực thanh toán
router.put('/:id/verification', asyncHandler(paymentMiddleware), asyncHandler(updatePaymentVerificationRequest))

export default router 