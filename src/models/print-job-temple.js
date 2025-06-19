import createModel from './base'

const PrintJobTemple = createModel('PrintJobTemple', 'print_job_temples', {
    print_job_id: {
        type: Object,
        ref: 'PrintJob',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
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

export default PrintJobTemple 