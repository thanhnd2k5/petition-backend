import { PrintJob, Payment } from '@/models'
import { abort } from '@/utils/helpers'
import { generateSePayQRCode } from '@/utils/helpers/qr.helper'
import { PAYMENT_METHOD, PRINT_JOB_STATUS } from '@/models/base'

export async function calculatePaymentAmount(printJobId) {
    const printJob = await PrintJob.findById(printJobId)
        .populate('printer')
        .populate('temples')
    
    if (!printJob) {
        abort(404, 'Không tìm thấy yêu cầu in')
    }

    const printer = printJob.printer
    const temples = printJob.temples

    // Tính tổng số lượng
    const totalQuantity = temples.reduce((sum, temple) => sum + temple.quantity, 0)
    
    // Tính tổng tiền
    const totalAmount = totalQuantity * printer.price_per_copy
    return {
        totalQuantity,
        totalAmount,
        pricePerCopy: printer.price_per_copy
    }
}

export async function createPaymentForPrintJob(printJobId, method, session) {
    const job = await PrintJob.findById(printJobId)
    if (!job) abort(404, 'Không tìm thấy đơn in')

    // Kiểm tra phương thức thanh toán
    if (!Object.values(PAYMENT_METHOD).includes(method)) {
        abort(400, 'Phương thức thanh toán không hợp lệ')
    }

    // Kiểm tra xem đã có payment chưa
    const existingPayment = await Payment.findOne({ print_job_id: printJobId })
    if (existingPayment) {
        return existingPayment
    }

    const { totalAmount } = await calculatePaymentAmount(printJobId)

    // Tạo nội dung chuyển khoản
    const content = `SODIEP-${printJobId}`

    // Tạo QR code nếu phương thức là QR
    let qr_code_url = null
    if (method === PAYMENT_METHOD.QR) {
        qr_code_url = generateSePayQRCode(
            process.env.BANK_ACCOUNT,
            process.env.BANK_NAME,
            totalAmount,
            content
        )
    }
    
    const payment = await Payment.create([{
        print_job_id: printJobId,
        method,
        amount: totalAmount,
        qr_code_url,
        content,
        verified: false
    }], { session })

    // Gắn vào PrintJob
    await PrintJob.findByIdAndUpdate(
        printJobId,
        { payment_id: payment[0]._id },
        { session }
    )

    return payment[0]
}

export async function handleSePayWebhook(data) {
    const { content, transferType, transferAmount } = data

    // Kiểm tra loại giao dịch
    if (transferType !== 'in') {
        abort(400, 'Loại giao dịch không hợp lệ')
    }

    // Tìm payment theo nội dung chuyển khoản
    const payment = await Payment.findOne({ content })
    if (!payment) {
        abort(404, 'Không tìm thấy thông tin thanh toán')
    }

    // Kiểm tra số tiền khớp
    if (payment.amount !== transferAmount) {
        abort(400, 'Số tiền không khớp')
    }

    // Cập nhật trạng thái thanh toán
    payment.verified = true
    await payment.save()

    // Cập nhật trạng thái print job
    await PrintJob.findByIdAndUpdate(
        { _id: payment.print_job_id },
        { status: PRINT_JOB_STATUS.APPROVED }
    )

    // Emit socket event cho frontend biết payment đã hoàn tất
    const io = global.app?.get('io')
    if (io) {
        io.to(`print_job_${payment.print_job_id}`).emit('payment_status_update', {
            printJobId: payment.print_job_id,
            paymentId: payment._id,
            status: PRINT_JOB_STATUS.APPROVED,
            verified: true,
            updatedAt: payment.updatedAt,
        })
    }

    return payment
}

export async function getPaymentById(id) {
    const payment = await Payment.findById(id)
        .populate('print_job')
    
    if (!payment) {
        abort(404, 'Không tìm thấy thông tin thanh toán')
    }

    return payment
}
