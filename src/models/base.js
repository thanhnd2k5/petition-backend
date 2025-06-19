import mongoose from 'mongoose'

export default function createModel(name, collection, definition, options) {
    const schema = new mongoose.Schema(definition, {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        versionKey: false,
        id: false,
        toJSON: {getters: true, virtuals: true},
        ...(options ?? {}),
    })

    if (options?.virtuals) {
        for (const [key, def] of Object.entries(options.virtuals)) {
            if (typeof def.get === 'function' || typeof def.set === 'function') {
                schema.virtual(key).get(def.get).set(def.set)
            } else {
            // assume it's a populate config
                schema.virtual(key, def)
            }
        }
    }

    return mongoose.model(name, schema, collection)
}

export const {ObjectId} = mongoose.Types

export const ROLE = {
    SUPER_ADMIN: 'super-admin',
}

export const PERMISSION = {
    SUPER_ADMIN: 'super-admin',
    // Role management
    LIST_ROLE: 'list-role',
    CREATE_ROLE: 'create-role',
    UPDATE_ROLE: 'update-role',
    DELETE_ROLE: 'delete-role',

    // Permission management
    UPDATE_PERMISSION_FOR_ROLE: 'update-permission-for-role',
}

export const STATUS_ACCOUNT = {
    ACTIVE: 'ACTIVE',
    DE_ACTIVE: 'DE_ACTIVE',
}

export const PRINT_JOB_TYPE = {
    QUOC_NGU: 'quoc_ngu',
    NHO: 'nho',
    SONG_NGU: 'song_ngu',
}

export const INTENTION = {
    GIA_TIÊN: 'gia_tien',
    CẦU_AN: 'cau_an',
    CẦU_TÀI: 'cau_tai',
    CẦU_LỘC: 'cau_loc',
    CẦU_DUYÊN: 'cau_duyen',
    GIẢI_HẠN: 'giai_han',
    KHÁC: 'khac',
}


export const PREFERRED_PRINT_TYPE = {
    NOW: 'now',
    SCHEDULED: 'scheduled',
}

export const PRINT_JOB_STATUS = {
    PENDING: 'pending',
    PRINTED: 'printed',
}

export const PAYMENT_METHOD = {
    CASH: 'cash',
    QR: 'qr',
}

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
}