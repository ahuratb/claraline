import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const orderSchema = z.object({
  id: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    name_en: z.string(),
    name_ar: z.string(),
    price: z.number(),
    quantity: z.number(),
    shade: z.string().optional(),
  })),
  total: z.number(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  status: z.enum(['pending', 'paid', 'failed']),
})

export async function POST(req: NextRequest) {
  try {
    const body = orderSchema.parse(await req.json())
    // In production: persist to Sanity or your DB here
    console.log('[order created]', body.id)
    return NextResponse.json({ success: true, orderId: body.id })
  } catch (err) {
    console.error('[orders/POST]', err)
    return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
  }
}
