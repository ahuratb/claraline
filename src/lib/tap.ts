const BASE_URL = 'https://api.tap.company/v2'

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
    'Content-Type': 'application/json',
  }
}

function parsePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('965') && digits.length > 8) {
    return { country_code: '965', number: digits.slice(3) }
  }
  return { country_code: '965', number: digits }
}

export async function createCharge(params: {
  amount: number
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  redirectUrl: string
  webhookUrl: string
}) {
  const [first_name, ...rest] = params.customerName.trim().split(' ')
  const last_name = rest.join(' ') || first_name
  const phone = parsePhone(params.customerPhone)

  const res = await fetch(`${BASE_URL}/charges`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      amount: params.amount,
      currency: 'KWD',
      customer_initiated: true,
      threeDSecure: true,
      save_card: false,
      description: 'Claraline Order',
      metadata: { udf1: params.orderId },
      reference: { transaction: params.orderId, order: params.orderId },
      receipt: { email: true, sms: true },
      customer: {
        first_name,
        last_name,
        email: params.customerEmail,
        phone: { country_code: phone.country_code, number: phone.number },
      },
      source: { id: 'src_all' },
      post: { url: params.webhookUrl },
      redirect: { url: params.redirectUrl },
    }),
  })
  return res.json()
}

export async function getCharge(chargeId: string) {
  const res = await fetch(`${BASE_URL}/charges/${chargeId}`, { headers: getHeaders() })
  return res.json()
}
