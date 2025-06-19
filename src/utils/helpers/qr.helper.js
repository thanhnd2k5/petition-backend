export function generateSePayQRCode(account, bank, amount, content) {
    console.log(account, bank, amount, content)
    const url = new URL('https://qr.sepay.vn/img')
    url.searchParams.append('acc', account)
    url.searchParams.append('bank', bank)
    url.searchParams.append('amount', amount.toString())
    url.searchParams.append('des', content)
    return url.toString()
}