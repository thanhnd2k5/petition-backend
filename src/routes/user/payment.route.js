import express from 'express'
import { createPayment, getPaymentAmount } from '@/app/controllers/user/payment.controller'

const router = express.Router()

// Tạo thanh toán mới
router.post('/', createPayment)

// Lấy thông tin số tiền cần thanh toán
router.get('/amount/:print_job_id', getPaymentAmount)

export default router 