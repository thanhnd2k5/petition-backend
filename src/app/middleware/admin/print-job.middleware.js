import { getPrintJobById } from '@/app/services/print-job.service'
import { abort } from '@/utils/helpers'

// Middleware kiểm tra quyền truy cập yêu cầu in
export async function verifyPrintJobOwnership(req, res, next) {
    try {
        const { id } = req.params
        const printJob = await getPrintJobById(id)

        req.printJob = printJob
        next()
    } catch (error) {
        next(error)
    }
}

// Middleware kiểm tra số lượng temple
export function validateTempleLimits(req, res, next) {
    try {
        const { temples } = req.body

        if (temples) {
            // Kiểm tra số lượng temple tối đa
            if (temples.length > 10) {
                return abort(400, 'Số lượng đền không được vượt quá 10')
            }

            // Kiểm tra tổng số lượng sớ
            const totalQuantity = temples.reduce((sum, temple) => sum + temple.quantity, 0)
            if (totalQuantity > 100) {
                return abort(400, 'Tổng số lượng sớ không được vượt quá 100')
            }
        }

        next()
    } catch (error) {
        next(error)
    }
} 