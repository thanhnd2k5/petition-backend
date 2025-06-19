import express from 'express'
import printJobRouter from './print-job.route'
import paymentRouter from './payment.route'
import sePayRouter from './se-pay.route'


const router = express.Router()

router.use('/print-job', printJobRouter)
router.use('/payments', paymentRouter)
router.use('/webhook/se-pay', sePayRouter)


export default router
