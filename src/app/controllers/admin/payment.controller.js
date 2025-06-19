import { updatePaymentVerification } from '@/app/services/payment.service'
import { abort } from '@/utils/helpers'

export async function updatePaymentVerificationRequest(req, res) {
    const { id } = req.params
    const { status } = req.body

    if (typeof status !== 'string') {
        abort(400, 'Trạng thái thanh toán phải là string')
    }

    const payment = await updatePaymentVerification(id, status)
    res.jsonify(payment)
} 