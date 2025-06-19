import { tryValidateOrDefault } from '@/utils/helpers'
import Joi from 'joi'
import { PRINT_JOB_STATUS } from '@/models/base'

const templeSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .label('Tên đền'),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .label('Số lượng')
})

export const createItem = Joi.object({
    printer_code: Joi.string()
        .trim()
        .required()
        .label('Mã máy in'),
    phone: Joi.string()
        .trim()
        .required()
        .pattern(/^[0-9]{10}$/)
        .label('Số điện thoại'),
    address: Joi.string()
        .trim()
        .label('Địa chỉ'),
    type: Joi.string()
        .required()
        .label('Loại sớ'),
    offering_date: Joi.date()
        .required()
        .min('now')
        .label('Ngày cúng'),
    preferred_type: Joi.string()
        .required()
        .label('Loại in ưa thích'),
    scheduled_at: Joi.date()
        .min('now')
        .when('preferred_type', {
            is: 'scheduled',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .label('Thời gian in'),
    people_text: Joi.string()
        .trim()
        .required()
        .label('Tên người cúng'),
    intention: Joi.string()
        .required()
        .label('Ý nguyện'),
    priest_name: Joi.string()
        .trim()
        .label('Tên thầy'),
    temples: Joi.array()
        .items(templeSchema)
        .min(1)
        .required()
        .label('Danh sách đền')
})

export const updateItem = Joi.object({
    phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .label('Số điện thoại'),
    address: Joi.string()
        .trim()
        .label('Địa chỉ'),
    type: Joi.string()
        .label('Loại sớ'),
    offering_date: Joi.date()
        .min('now')
        .label('Ngày cúng'),
    preferred_type: Joi.string()
        .label('Loại in ưa thích'),
    scheduled_at: Joi.date()
        .min('now')
        .when('preferred_type', {
            is: 'scheduled',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .label('Thời gian in'),
    people_text: Joi.string()
        .trim()
        .label('Tên người cúng'),
    intention: Joi.string()
        .label('Ý nguyện'),
    priest_name: Joi.string()
        .trim()
        .label('Tên thầy'),
    temples: Joi.array()
        .items(templeSchema)
        .min(1)
        .label('Danh sách đền'),
    status: Joi.string()
        .label('Trạng thái')
        .valid(...Object.values(PRINT_JOB_STATUS)),
})

export const listItems = Joi.object({
    printer_code: tryValidateOrDefault(Joi.string().trim(), ''),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 50),
    status: tryValidateOrDefault(Joi.string(), ''),
    from_date: tryValidateOrDefault(Joi.date(), ''),
    to_date: tryValidateOrDefault(Joi.date(), '')
})
