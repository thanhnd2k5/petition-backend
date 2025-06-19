import createModel from './base'

const Printer = createModel('Printer', 'printers', {
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    owner_name: {
        type: String,
        required: true,
    },
    owner_phone: {
        type: String,
        required: true,
    },
    price_per_copy: {
        type: Number,
        required: true,
    },
    gdrive_link: {
        type: String,
    },
})

export default Printer
