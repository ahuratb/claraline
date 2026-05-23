import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/mongodb'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const db   = await getDb()

    const existing = await db.collection('users').findOne({ email: body.email })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(body.password, 12)

    const result = await db.collection('users').insertOne({
      name:      body.name,
      email:     body.email,
      password:  hashed,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, userId: result.insertedId })
  } catch (err) {
    console.error('[register] error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Registration failed', detail: message }, { status: 500 })
  }
}
