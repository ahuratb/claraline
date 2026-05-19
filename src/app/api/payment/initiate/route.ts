import { NextRequest, NextResponse } from 'next/server'
import { sendPayment } from '@/lib/myfatoorah'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().positive(),
  orderId: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  lang: z.enum(['AR', 'EN']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const base = process.env.NEXT_PUBLIC_BASE_URL

    const result = await sendPayment({
      amount: body.amount,
      orderId: body.orderId,
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      successUrl: `${base}/order-success?id=${body.orderId}`,
      failUrl: `${base}/checkout?error=payment_failed`,
      callBackUrl: `${base}/api/payment/callback`,
      language: body.lang ?? 'AR',
    })

    if (!result.IsSuccess) {
      return NextResponse.json({ error: result.Message }, { status: 400 })
    }

    return NextResponse.json({ url: result.Data.InvoiceURL })
  } catch (err) {
    console.error('[payment/initiate]', err)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
