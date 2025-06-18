import { handleSePayWebhook } from '@/app/services/payment.service'
import { abort } from '@/utils/helpers'

export async function handleWebhook(req, res) {
    try {
        // // Kiểm tra API key
        // const apiKey = req.headers.authorization?.split(' ')[1]
        // if (apiKey !== process.env.SEPAY_WEBHOOK_API_KEY) {
        //     return res.status(401).json({ 
        //         success: false, 
        //         message: 'Unauthorized' 
        //     })
        // }

        // Xử lý webhook
        const payment = await handleSePayWebhook(req.body)
        
        res.jsonify(payment)
    } catch (error) {
        console.error('SePay webhook error:', error)
        abort(error.status || 500, error.message || 'Lỗi máy chủ nội bộ')
    }
}
