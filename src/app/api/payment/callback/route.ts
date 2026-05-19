import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/myfatoorah'

export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get('paymentId')
  const base = process.env.NEXT_PUBLIC_BASE_URL

  if (!paymentId) {
    return NextResponse.redirect(`${base}/checkout?error=missing_id`)
  }

  try {
    const status = await getPaymentStatus(paymentId)
    const isPaid = status?.Data?.InvoiceStatus === 'Paid'
    const orderId = status?.Data?.CustomerReference

    if (isPaid && orderId) {
      return NextResponse.redirect(`${base}/order-success?id=${orderId}&payment=${paymentId}`)
    }

    return NextResponse.redirect(`${base}/checkout?error=payment_failed`)
  } catch (err) {
    console.error('[payment/callback]', err)
    return NextResponse.redirect(`${base}/checkout?error=server_error`)
  }
}
