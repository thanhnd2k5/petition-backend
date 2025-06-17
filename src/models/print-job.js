import createModel, {PRINT_JOB_TYPE, PREFERRED_PRINT_TYPE, PRINT_JOB_STATUS, INTENTION} from './base'

const PrintJob = createModel('PrintJob', 'print_jobs', {
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    type: {
        type: String,
        enum: Object.values(PRINT_JOB_TYPE),
        required: true,
    },
    offering_date: {
        type: Date,
        required: true,
    },
    preferred_type: {
        type: String,
        enum: Object.values(PREFERRED_PRINT_TYPE),
        required: true,
    },
    scheduled_at: {
        type: Date,
    },
    people_text: {
        type: String,
        required: true,
    },
    intention: {
        type: String,
        enum: Object.values(INTENTION),
        required: true,
    },
    priest_name: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(PRINT_JOB_STATUS),
        default: PRINT_JOB_STATUS.PENDING,
    },
    printer_id: {
        type: Object,
        ref: 'Printer',
        required: true,
    },
    payment_id: {
        type: Object,
        ref: 'Payment',
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
},
{
    virtuals: {
        printer: {
            ref: 'Printer',
            localField: 'printer_id',
            foreignField: '_id',
            justOne: true,
        },
        payment: {
            ref: 'Payment',
            localField: 'payment_id',
            foreignField: '_id',
            justOne: true,
        },
        temples: {
            ref: 'PrintJobTemple',
            localField: '_id',
            foreignField: 'print_job_id',
        }
    }
}
)

export default PrintJob
