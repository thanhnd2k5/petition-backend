import * as paymentService from '@/app/services/payment.service'
import { db } from '@/configs'

export async function updatePaymentVerificationRequest(req, res) {
    const id = req.payment._id
    const { verified } = req.body

    const payment = await db.transaction(async function (session) {
        return await paymentService.updatePaymentVerification(id, verified, session)
    })
    res.jsonify(payment)
} 