import { Router } from 'express'
import * as printerController from '@/app/controllers/admin/printer.controller'
import * as printerRequest from '@/app/requests/admin/printer.request'
import validate from '@/app/middleware/admin/validate'
// import { checkValidToken } from '@/app/middleware/admin/auth.middleware'
import { checkValidPrinter, checkValidPrinterCode } from '@/app/middleware/admin/printer.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

router.post(
    '/',
    asyncHandler(validate(printerRequest.createItem)),
    asyncHandler(printerController.createItem)
)

router.get(
    '/',
    asyncHandler(validate(printerRequest.listItems)),
    asyncHandler(printerController.listItems)
)

router.get(
    '/:id',
    asyncHandler(checkValidPrinter),
    asyncHandler(printerController.getItem)
)

router.put(
    '/:id',
    asyncHandler(checkValidPrinter),
    asyncHandler(validate(printerRequest.updateItem)),
    printerController.updateItem
)

router.delete(
    '/:id',
    asyncHandler(checkValidPrinter),
    asyncHandler(printerController.deleteItem)
)

router.get(
    '/code/:code',
    asyncHandler(checkValidPrinterCode),
    asyncHandler(printerController.getItemByCode)
)

router.get(
    '/code/:code/qr',
    asyncHandler(checkValidPrinterCode),
    asyncHandler(printerController.generateQR)
)

export default router 