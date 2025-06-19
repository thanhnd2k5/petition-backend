import { Printer } from '@/models'
import { abort } from '@/utils/helpers'
import QRCode from 'qrcode'

export async function createPrinter(data, session) {
    const printer = new Printer(data)
    await printer.save({ session })
    return printer
}

export async function listPrinters(query = {}) {
    const printers = await Printer.find({ ...query, deleted: false })
    return printers
}

export async function getPrinterById(id) {
    const printer = await Printer.findOne({ _id: id, deleted: false })
    if (!printer) {
        abort(404, 'Máy in không tồn tại')
    }
    return printer
}

export async function updatePrinter(id, data, session) {
    const printer = await Printer.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true, runValidators: true },
        { session }
    )
    return printer
}

export async function deletePrinter(id, session) {
    const printer = await Printer.findOneAndUpdate(
        { _id: id, deleted: false },
        { $set: { deleted: true } },
        { new: true },
        { session }
    )
    if (!printer) {
        abort(404, 'Máy in không tồn tại')
    }
    return printer
}

export async function getPrinterByCode(code) {
    const printer = await Printer.findOne({ code })
    if (!printer) {
        abort(404, 'Máy in không tồn tại')
    }
    return printer
}

export async function generatePrinterQR(code) {
    const printer = await getPrinterByCode(code)
    if (!printer) {
        abort(404, 'Máy in không tồn tại')
    }

    const qrContent = `${process.env.APP_URL_CLIENT}/form/${code}`
    const qrCode = await QRCode.toDataURL(qrContent, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300
    })

    return {
        printer,
        qr_code: qrCode
    }
} 