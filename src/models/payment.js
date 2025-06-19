import createModel, {PAYMENT_METHOD, PAYMENT_STATUS} from './base'

const Payment = createModel('Payment', 'payments', {
    print_job_id: {
        type: Object,
        ref: 'PrintJob',
        required: true,
    },
    method: {
        type: String,
        enum: Object.values(PAYMENT_METHOD),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    qr_code_url: {
        type: String,
    },
    content: {
        type: String,
    },
    verified: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
},
{
    virtuals: {
        print_job: {
            ref: 'PrintJob',
            localField: 'print_job_id',
            foreignField: '_id',
            justOne: true,
        }
    }
}
)

export default Payment
