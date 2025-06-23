import { createPaymentForPrintJob, calculatePaymentAmount } from '@/app/services/payment.service'
import { abort } from '@/utils/helpers'
import { db } from '@/configs'

export async function createPayment(req, res) {
    const { print_job_id, method } = req.body

    if (!print_job_id) {
        abort(400, 'Thiếu thông tin print_job_id')
    }

    const payment = await db.transaction(async function (session) {
        return await createPaymentForPrintJob(print_job_id, method, session)
    })
    res.jsonify(payment)
}

export async function getPaymentAmount(req, res) {
    const { print_job_id } = req.params

    if (!print_job_id) {
        abort(400, 'Thiếu thông tin print_job_id')
    }

    const paymentInfo = await calculatePaymentAmount(print_job_id)
    res.jsonify(paymentInfo)
} 