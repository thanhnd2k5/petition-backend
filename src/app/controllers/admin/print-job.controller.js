import { getPrintJobById, listPrintJobs, updatePrintJob, deletePrintJob, getPrintJobsByStatus, listPrintJobsWithPagination, getPrintJobStatistics } from '@/app/services/print-job.service'
import { getPrinterByCode } from '@/app/services/printer.service'
import {calculatePaymentAmount} from '@/app/services/payment.service'
import { abort } from '@/utils/helpers'
import { db } from '@/configs'

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

export async function getPrintJobsByStatusRequest(req, res) {
    let { status } = req.query
    if (!status) abort(400, 'Thiếu tham số status')
    // Hỗ trợ status là mảng hoặc chuỗi
    if (typeof status === 'string' && status.includes(',')) {
        status = status.split(',')
    }
    const printJobs = await getPrintJobsByStatus(status)
    res.jsonify(printJobs)
}

export async function listPrintJobsWithPaginationRequest(req, res) {
    const { page = 1, limit = 10, status, printer_code } = req.query

    // Build query
    const query = {}
    
    // Nếu có printer_code, lấy printer_id
    if (printer_code) {
        const printer = await getPrinterByCode(printer_code)
        if (!printer) {
            abort(404, 'Không tìm thấy máy in')
        }
        query.printer_id = printer._id
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status
    }

    const result = await listPrintJobsWithPagination(query, options)
    res.jsonify(result)
}

export async function getPrintJobStatisticsRequest(req, res) {
    const stats = await getPrintJobStatistics()
    res.jsonify(stats)
} 