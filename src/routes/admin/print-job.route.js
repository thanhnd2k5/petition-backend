import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'
import { updateItem, listItems } from '@/app/requests/admin/print-job.request'
import * as printJobController from '@/app/controllers/admin/print-job.controller'
import { verifyPrintJobOwnership, validateTempleLimits } from '@/app/middleware/admin/print-job.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

// Route pagination - phải đặt trước route '/' để tránh conflict
router.get('/paginated', 
    asyncHandler(printJobController.listPrintJobsWithPaginationRequest)
)

// Route statistics
router.get('/statistics', 
    asyncHandler(printJobController.getPrintJobStatisticsRequest)
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
    validateTempleLimits, 
    asyncHandler(printJobController.updatePrintJobRequest)
)

router.delete('/:id', 
    asyncHandler(verifyPrintJobOwnership), 
    asyncHandler(printJobController.deletePrintJobRequest)
)

router.get('/by-status', asyncHandler(printJobController.getPrintJobsByStatusRequest))

export default router 