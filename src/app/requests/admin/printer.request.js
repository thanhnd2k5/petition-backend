import { Printer } from '@/models'
import { AsyncValidate } from '@/utils/classes'
import { tryValidateOrDefault } from '@/utils/helpers'
import Joi from 'joi'

export const createItem = Joi.object({
    code: Joi.string()
        .trim()
        .required()
        .label('Mã máy in')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const printer = await Printer.findOne({ code: value })
                    return !printer ? value : helpers.error('any.exists')
                })
        ),
    name: Joi.string()
        .trim()
        .required()
        .label('Tên máy in'),
    location: Joi.string()
        .trim()
        .required()
        .label('Vị trí'),
    owner_name: Joi.string()
        .trim()
        .required()
        .label('Tên chủ sở hữu'),
    owner_phone: Joi.string()
        .trim()
        .required()
        .label('Số điện thoại chủ sở hữu'),
    price_per_copy: Joi.number()
        .required()
        .min(0)
        .label('Giá tiền mỗi bản in'),
    gdrive_link: Joi.string()
        .trim()
        .empty(Joi.valid('', null))
        .default('')
        .label('Link Google Drive')
})

export const updateItem = Joi.object({
    code: Joi.string()
        .trim()
        .required()
        .label('Mã máy in')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const printer = await Printer.findOne({ 
                        code: value, 
                        _id: { $ne: req.printer._id } 
                    })
                    return !printer ? value : helpers.error('any.exists')
                })
        ),
    name: Joi.string()
        .trim()
        .required()
        .label('Tên máy in'),
    location: Joi.string()
        .trim()
        .required()
        .label('Vị trí'),
    owner_name: Joi.string()
        .trim()
        .required()
        .label('Tên chủ sở hữu'),
    owner_phone: Joi.string()
        .trim()
        .required()
        .label('Số điện thoại chủ sở hữu'),
    price_per_copy: Joi.number()
        .required()
        .min(0)
        .label('Giá tiền mỗi bản in'),
    gdrive_link: Joi.string()
        .trim()
        .empty(Joi.valid('', null))
        .default('')
        .label('Link Google Drive')
})

export const listItems = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ''),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 50),
}) 