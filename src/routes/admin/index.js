import {Router} from 'express'
import authRouter from './auth.router'
import roleRouter from './role.router'
import printer from './printer.route'
import printJob from './print-job.route'
import payment from './payment.route'

const admin = Router()

admin.use('/auth', authRouter)
admin.use('/roles', roleRouter)
admin.use('/printer', printer)
admin.use('/print-job', printJob)
admin.use('/payment', payment)

export default admin
