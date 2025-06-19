import * as printerService from '@/app/services/printer.service'
import { db } from '@/configs'

export async function createItem(req, res) {
    await db.transaction(async function (session) {
        const printer = await printerService.createPrinter(req.body, session)
        res.status(201).jsonify(printer)
    })
}

export async function listItems(req, res) {
    const data = await printerService.listPrinters(req.query)
    res.jsonify(data)
}

export async function getItem(req, res) {
    const data = await printerService.getPrinterById(req.params.id)
    res.jsonify(data)
}

export async function updateItem(req, res) {
    await db.transaction(async function (session) {
        await printerService.updatePrinter(req.params.id, req.body, session)
        res.status(201).jsonify()
    })
}

export async function deleteItem(req, res) {
    await db.transaction(async function (session) {
        await printerService.deletePrinter(req.params.id, session)
        res.jsonify()
    })
}

export async function getItemByCode(req, res) {
    const data = await printerService.getPrinterByCode(req.params.code, req.query)
    res.jsonify(data)
}

export async function generateQR(req, res) {
    const data = await printerService.generatePrinterQR(req.params.code)
    res.jsonify(data)
} 