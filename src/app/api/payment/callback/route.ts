import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getPaymentStatus } from '@/lib/myfatoorah'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get('paymentId')
  const base      = process.env.NEXT_PUBLIC_BASE_URL

  if (!paymentId) {
    return NextResponse.redirect(`${base}/checkout?error=missing_id`)
  }

  try {
    const status  = await getPaymentStatus(paymentId)
    const isPaid  = status?.Data?.InvoiceStatus === 'Paid'
    const orderId = status?.Data?.CustomerReference

    if (isPaid && orderId) {
      // Mark order paid in MongoDB
      try {
        const db = await getDb()
        await db.collection('orders').updateOne(
          { _id: new ObjectId(orderId) },
          { $set: { status: 'paid', paymentId, updatedAt: new Date() } }
        )
      } catch {
        // Non-fatal — order is still shown on success page
      }
      return NextResponse.redirect(`${base}/order-success?id=${orderId}&payment=${paymentId}`)
    }

    return NextResponse.redirect(`${base}/checkout?error=payment_failed`)
  } catch (err) {
    console.error('[payment/callback]', err)
    return NextResponse.redirect(`${base}/checkout?error=server_error`)
  }
}
