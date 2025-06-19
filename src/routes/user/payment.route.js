import express from 'express'
import { createPayment, getPaymentAmount } from '@/app/controllers/user/payment.controller'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

// Tạo thanh toán mới
router.post('/', asyncHandler(createPayment))

// Lấy thông tin số tiền cần thanh toán
router.get('/amount/:print_job_id', asyncHandler(getPaymentAmount))

export default router 