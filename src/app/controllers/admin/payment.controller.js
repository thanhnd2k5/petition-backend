import * as paymentService from '@/app/services/payment.service'

export async function updatePaymentVerificationRequest(req, res) {
    const { id } = req.params
    const { verified } = req.body

    const payment = await paymentService.updatePaymentVerification(id, verified)
    res.jsonify(payment)
} 