import createModel, {PAYMENT_METHOD} from './base'

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
        type: Boolean,
        default: false,
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
