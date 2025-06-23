import Joi from 'joi'
import { PAYMENT_STATUS } from '@/models/base'

export const updatePaymentVerificationRequest = Joi.object({
    verified: Joi.string()
        .valid(...Object.values(PAYMENT_STATUS))
        .required()
        .label('Trạng thái thanh toán'),
})