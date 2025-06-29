import { createPrintJob, getPrintJobById, listPrintJobs, updatePrintJob, deletePrintJob } from '@/app/services/print-job.service'
import { getPrinterByCode } from '@/app/services/printer.service'
import {calculatePaymentAmount} from '@/app/services/payment.service'
import { abort } from '@/utils/helpers'
import { db } from '@/configs'

export async function createPrintJobRequest(req, res) {
    const { printer_code } = req.body

    // Kiểm tra máy in
    const printer = await getPrinterByCode(printer_code)
    if (!printer) {
        abort(404, 'Không tìm thấy máy in')
    }

    // Thêm printer_id vào data
    const data = {
        ...req.body,
        printer_id: printer._id,
        status: 'pending'
    }

    const printJob = await db.transaction(async function (session) {
        return await createPrintJob(data, session)
    })
    res.jsonify(printJob)
}

export async function getPrintJobDetails(req, res) {
    const id = req.printJob._id
    const printJob = await getPrintJobById(id)
    const totalAmount = await calculatePaymentAmount(id)
    res.jsonify({totalAmount, printJob})
}

export async function listPrintJobRequests(req, res) {
    const { printer_code } = req.query

    // Nếu có printer_code, lấy printer_id
    const query = {}
    if (printer_code) {
        const printer = await getPrinterByCode(printer_code)
        if (!printer) {
            abort(404, 'Không tìm thấy máy in')
        }
        query.printer_id = printer._id
    }

    const printJobs = await listPrintJobs(query)
    res.jsonify(printJobs)
}

export async function updatePrintJobRequest(req, res) {
    const id = req.printJob._id
    const printJob = await db.transaction(async function (session) {
        return await updatePrintJob(id, req.body, session)
    })
    res.jsonify(printJob)
}

export async function deletePrintJobRequest(req, res) {
    const id = req.printJob._id
    const printJob = await db.transaction(async function (session) {
        return await deletePrintJob(id, session)
    })
    res.jsonify(printJob)
}