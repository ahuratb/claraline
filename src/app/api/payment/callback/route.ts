import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getCharge } from '@/lib/tap'
import { getDb } from '@/lib/mongodb'

// Tap redirects user here after payment with ?tap_id=chg_xxx
export async function GET(req: NextRequest) {
  const tapId = req.nextUrl.searchParams.get('tap_id')
  const base  = process.env.NEXT_PUBLIC_BASE_URL

  if (!tapId) {
    return NextResponse.redirect(`${base}/checkout?error=missing_id`)
  }

  try {
    const charge  = await getCharge(tapId)
    const isPaid  = charge?.status === 'CAPTURED'
    const orderId = charge?.metadata?.udf1

    if (isPaid && orderId) {
      try {
        const db = await getDb()
        await db.collection('orders').updateOne(
          { _id: new ObjectId(orderId) },
          { $set: { status: 'paid', paymentId: tapId, updatedAt: new Date() } },
        )
      } catch {
        // Non-fatal — order still shown on success page
      }
      return NextResponse.redirect(`${base}/order-success?id=${orderId}&payment=${tapId}`)
    }

    return NextResponse.redirect(`${base}/checkout?error=payment_failed`)
  } catch (err) {
    console.error('[payment/callback]', err)
    return NextResponse.redirect(`${base}/checkout?error=server_error`)
  }
}

// Tap async webhook — marks order paid independently of user redirect
export async function POST(req: NextRequest) {
  try {
    const charge = await req.json()
    if (charge?.status === 'CAPTURED' && charge?.metadata?.udf1) {
      const db = await getDb()
      await db.collection('orders').updateOne(
        { _id: new ObjectId(charge.metadata.udf1) },
        { $set: { status: 'paid', paymentId: charge.id, updatedAt: new Date() } },
      )
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[payment/webhook]', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
