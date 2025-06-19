import express from 'express'
import { updatePaymentVerificationRequest } from '@/app/controllers/admin/payment.controller'

const router = express.Router()

// Cập nhật trạng thái xác thực thanh toán
router.put('/:id/verification', updatePaymentVerificationRequest)

export default router 