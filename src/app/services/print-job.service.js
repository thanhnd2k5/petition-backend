import { PrintJob, PrintJobTemple } from '@/models'
import { abort } from '@/utils/helpers'

export async function createPrintJob(data, session) {
    const { temples, ...printJobData } = data
    
    // Tạo print job
    const printJob = new PrintJob(printJobData)
    await printJob.save({ session })

    // Tạo các temple records
    if (temples && temples.length > 0) {
        const templeRecords = temples.map(temple => ({
            print_job_id: printJob._id,
            name: temple.name,
            quantity: temple.quantity
        }))
        await PrintJobTemple.insertMany(templeRecords, { session })
    }

    return printJob
}

export async function getPrintJobById(id) {
    const printJob = await PrintJob.findOne({ _id: id })
        .populate('temples')
        .populate('printer')
        .populate('payment')
    
    if (!printJob) {
        abort(404, 'Không tìm thấy yêu cầu in')
    }
    return printJob
}

export async function updatePrintJob(id, data, session) {
    const { temples, ...printJobData } = data
    
    // Cập nhật print job
    const printJob = await PrintJob.findOneAndUpdate(
        { _id: id },
        { $set: printJobData },
        { new: true, runValidators: true },
        { session }
    )

    if (!printJob) {
        abort(404, 'Không tìm thấy yêu cầu in')
    }

    // Cập nhật temples nếu có
    if (temples) {
        // Xóa temples cũ
        await PrintJobTemple.deleteMany({ print_job_id: id }, { session })
        
        // Tạo temples mới
        if (temples.length > 0) {
            const templeRecords = temples.map(temple => ({
                print_job_id: id,
                name: temple.name,
                quantity: temple.quantity
            }))
            await PrintJobTemple.insertMany(templeRecords, { session })
        }
    }

    return printJob
}

export async function listPrintJobs(query = {}) {
    const printJobs = await PrintJob.find(query)
        .populate('temples')
        .populate('printer')
        .populate('payment')
    return printJobs
}

export async function listPrintJobsWithPagination(query = {}, options = {}) {
    const { page = 1, limit = 10, status } = options
    
    // Build query
    const findQuery = { ...query }
    if (status && status !== '') {
        findQuery.status = status
    }
    
    const skip = (page - 1) * limit
    
    // Get total count
    const total = await PrintJob.countDocuments(findQuery)
    
    // Get paginated results
    const printJobs = await PrintJob.find(findQuery)
        .populate('temples')
        .populate('printer') 
        .populate('payment')
        .sort({ created_at: -1 }) // Sắp xếp mới nhất trước
        .skip(skip)
        .limit(parseInt(limit))
    
    return {
        data: printJobs,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
    }
}

export async function deletePrintJob(id, session) {
    const printJob = await PrintJob.findOneAndDelete({ _id: id }, { session })
    if (!printJob) {
        abort(404, 'Không tìm thấy yêu cầu in')
    }
    
    // Xóa các temple records liên quan
    await PrintJobTemple.deleteMany({ print_job_id: id }, { session })
    
    return printJob
}

export async function getPrintJobsByStatus(status) {
    const query = Array.isArray(status) ? { status: { $in: status } } : { status }
    const printJobs = await PrintJob.find(query)
        .populate('temples')
        .populate('printer')
        .populate('payment')
    return printJobs
}

export async function getPrintJobStatistics() {
    const stats = await PrintJob.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ])
    
    // Chuyển đổi thành object để dễ sử dụng
    const result = {
        total: 0,
        pending: 0,
        printed: 0
    }
    
    stats.forEach(stat => {
        result[stat._id] = stat.count
        result.total += stat.count
    })
    
    return result
} 