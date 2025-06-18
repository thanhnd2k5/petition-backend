import { Router } from 'express'
import validate from '@/app/middleware/user/validate'
import { createItem, updateItem, listItems } from '@/app/requests/user/print-job.request'
import * as printJobController from '@/app/controllers/user/print-job.controller'
import { verifyPrintJobOwnership, verifyPrintJobStatus, validateTempleLimits } from '@/app/middleware/user/print-job'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

router.post('/', 
    asyncHandler(validate(createItem)), 
    validateTempleLimits, 
    asyncHandler(printJobController.createPrintJobRequest)
)

router.get('/', 
    asyncHandler(validate(listItems)), 
    asyncHandler(printJobController.listPrintJobRequests)
)

router.get('/:id', 
    asyncHandler(verifyPrintJobOwnership), 
    asyncHandler(printJobController.getPrintJobDetails)
)

router.put('/:id', 
    asyncHandler(validate(updateItem)), 
    asyncHandler(verifyPrintJobOwnership), 
    verifyPrintJobStatus, 
    validateTempleLimits, 
    asyncHandler(printJobController.updatePrintJobRequest)
)

router.delete('/:id', 
    asyncHandler(verifyPrintJobOwnership), 
    verifyPrintJobStatus, 
    asyncHandler(printJobController.deletePrintJobRequest)
)

export default router 