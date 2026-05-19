const BASE_URL = process.env.MYFATOORAH_BASE_URL!
const API_KEY = process.env.MYFATOORAH_API_KEY!

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}

export async function initiatePayment(amount: number, currency = 'KWD') {
  const res = await fetch(`${BASE_URL}/v2/InitiatePayment`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ InvoiceAmount: amount, CurrencyIso: currency }),
  })
  return res.json()
}

export async function sendPayment(params: {
  amount: number
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  successUrl: string
  failUrl: string
  callBackUrl: string
  language?: 'AR' | 'EN'
}) {
  const body = {
    PaymentMethodId: 0,
    CustomerName: params.customerName,
    CustomerEmail: params.customerEmail,
    CustomerMobile: params.customerPhone,
    InvoiceValue: params.amount,
    DisplayCurrencyIso: 'KWD',
    CallBackUrl: params.callBackUrl,
    ErrorUrl: params.failUrl,
    Language: params.language ?? 'AR',
    CustomerReference: params.orderId,
    UserDefinedField: params.orderId,
    ExpireDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    InvoiceItems: [{ ItemName: 'claraline Order', Quantity: 1, UnitPrice: params.amount }],
  }
  const res = await fetch(`${BASE_URL}/v2/SendPayment`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function getPaymentStatus(paymentId: string) {
  const res = await fetch(`${BASE_URL}/v2/GetPaymentStatus`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ Key: paymentId, KeyType: 'PaymentId' }),
  })
  return res.json()
}
