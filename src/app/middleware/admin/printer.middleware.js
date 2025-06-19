import { abort } from '@/utils/helpers'
import { Printer } from '@/models'
import { isValidObjectId } from 'mongoose'

export async function checkValidPrinter(req, res, next) {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            abort(400, 'ID máy in không hợp lệ')
        }

        const printer = await Printer.findOne({ _id: id })
        if (!printer) {
            abort(404, 'Máy in không tồn tại')
        }

        req.printer = printer
        next()
    } catch (error) {
        next(error)
    }
}

export async function checkValidPrinterCode(req, res, next) {
    try {
        const { code } = req.params
        if (!code) {
            abort(400, 'Mã máy in không được để trống')
        }

        const printer = await Printer.findOne({ code })
        if (!printer) {
            abort(404, 'Máy in không tồn tại')
        }

        req.printer = printer
        next()
    } catch (error) {
        next(error)
    }
} 