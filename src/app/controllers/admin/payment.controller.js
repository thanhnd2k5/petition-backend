import * as paymentService from '@/app/services/payment.service'

export async function updatePaymentVerificationRequest(req, res) {
    const { id } = req.params
    const { status } = req.body

    const payment = await paymentService.updatePaymentVerification(id, status)
    res.jsonify(payment)
} 