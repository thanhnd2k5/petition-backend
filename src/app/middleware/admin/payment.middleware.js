import { Payment } from '@/models'
import { abort } from '@/utils/helpers'

export const paymentMiddleware = async (req, res, next) => {
    const id = req.params.id
    const payment = await Payment.findById(id)
    if (!payment) {
        abort(404, 'Không tìm thấy thanh toán')
    }
    req.payment = payment
    next()
}