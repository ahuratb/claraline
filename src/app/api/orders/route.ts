import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db     = await getDb()
  const orders = await db.collection('orders')
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const body    = await req.json()
    const session = await getServerSession(authOptions)
    const db      = await getDb()

    const result = await db.collection('orders').insertOne({
      userId:    session?.user?.id ?? null,
      items:     body.items,
      total:     body.total,
      customer:  body.customer,
      status:    'pending',
      paymentId: null,
      createdAt: new Date(),
    })

    return NextResponse.json({ orderId: result.insertedId.toString() })
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
