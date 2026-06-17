/**
 * scripts/seed-admin.ts — one-shot: create (or update) an admin user.
 * Loads MONGODB_URI from .env.local. Short connect timeout so it fails fast.
 */
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

dotenv.config({ path: '.env.local' })

const EMAIL = 'admin@zoeybloom.me'
const NAME = 'admin'
const PASSWORD = 'admin@zoeybloom'

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) { console.error('MONGODB_URI missing in .env.local'); process.exit(1) }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 25000 })
  await client.connect()
  try {
    const db = client.db('claraline')
    const hashed = await bcrypt.hash(PASSWORD, 12)
    const res = await db.collection('users').updateOne(
      { email: EMAIL },
      {
        $set: { name: NAME, password: hashed, isAdmin: true, updatedAt: new Date() },
        $setOnInsert: { email: EMAIL, createdAt: new Date() },
      },
      { upsert: true },
    )
    console.log('OK — admin ready')
    console.log('  email:', EMAIL)
    console.log('  password:', PASSWORD)
    console.log('  upserted:', res.upsertedCount, 'modified:', res.modifiedCount)
  } finally {
    await client.close()
  }
}

main().catch(err => { console.error('FAILED:', err.message); process.exit(1) })
