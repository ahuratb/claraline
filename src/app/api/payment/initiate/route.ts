import { NextRequest, NextResponse } from 'next/server'
import { createCharge } from '@/lib/tap'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().positive(),
  orderId: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const base = process.env.NEXT_PUBLIC_BASE_URL

    const charge = await createCharge({
      amount: body.amount,
      orderId: body.orderId,
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      redirectUrl: `${base}/api/payment/callback`,
      webhookUrl: `${base}/api/payment/callback`,
    })

    if (!charge?.transaction?.url) {
      return NextResponse.json({ error: charge?.message ?? 'Payment initiation failed' }, { status: 400 })
    }

    return NextResponse.json({ url: charge.transaction.url })
  } catch (err) {
    console.error('[payment/initiate]', err)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
