import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export const runtime = 'nodejs'

export async function GET() {
  const uri = process.env.MONGODB_URI
  const results: Record<string, unknown> = {
    env: {
      MONGODB_URI: uri ? `${uri.slice(0, 30)}…` : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
    },
  }

  if (!uri) {
    return NextResponse.json(
      { ok: false, error: 'MONGODB_URI is not set', results },
      { status: 500 },
    )
  }

  const client = new MongoClient(uri)
  try {
    const t0 = Date.now()
    await client.connect()
    results.connect_ms = Date.now() - t0

    const db = client.db('claraline')

    // ping
    const t1 = Date.now()
    await db.command({ ping: 1 })
    results.ping_ms = Date.now() - t1

    // list collections
    const collections = await db.listCollections().toArray()
    results.collections = collections.map((c) => c.name)

    // insert → read → delete round-trip
    const col = db.collection('_connection_test')
    const t2 = Date.now()
    const ins = await col.insertOne({ _test: true, ts: new Date() })
    const doc = await col.findOne({ _id: ins.insertedId })
    await col.deleteOne({ _id: ins.insertedId })
    results.roundtrip_ms = Date.now() - t2
    results.roundtrip_ok = !!doc

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message, results }, { status: 500 })
  } finally {
    await client.close()
  }
}
