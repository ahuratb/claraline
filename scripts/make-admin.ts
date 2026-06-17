/**
 * scripts/make-admin.ts
 *
 * Promotes (or demotes) a user to admin so they can access /admin.
 *
 * Usage:
 *   npx tsx scripts/make-admin.ts user@email.com           # grant admin
 *   npx tsx scripts/make-admin.ts user@email.com --revoke  # remove admin
 *
 * Loads MONGODB_URI from .env.local automatically.
 */
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config({ path: '.env.local' })

async function main() {
  const email = process.argv[2]
  const revoke = process.argv.includes('--revoke')

  if (!email) {
    console.error('Usage: npx tsx scripts/make-admin.ts <email> [--revoke]')
    process.exit(1)
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set in .env.local')
    process.exit(1)
  }

  const client = new MongoClient(uri)
  await client.connect()

  try {
    const db = client.db('claraline')
    const res = await db.collection('users').updateOne(
      { email },
      { $set: { isAdmin: !revoke } },
    )

    if (res.matchedCount === 0) {
      console.error(`No user found with email: ${email}`)
      process.exit(1)
    }

    console.log(`${revoke ? 'Revoked admin from' : 'Granted admin to'}: ${email}`)
    console.log('Note: the user must sign out and back in for the change to take effect.')
  } finally {
    await client.close()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
