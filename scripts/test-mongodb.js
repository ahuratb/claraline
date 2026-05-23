// @ts-check
/**
 * Standalone MongoDB Atlas connection tester.
 * Run: node scripts/test-mongodb.js
 * (loads MONGODB_URI from .env.local automatically)
 */

const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// ── colours ──────────────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold:  '\x1b[1m',
  green: '\x1b[32m',
  red:   '\x1b[31m',
  yellow:'\x1b[33m',
  cyan:  '\x1b[36m',
  gray:  '\x1b[90m',
}
const ok   = (s) => `${c.green}${c.bold}✔${c.reset} ${s}`
const fail = (s) => `${c.red}${c.bold}✘${c.reset} ${s}`
const info = (s) => `${c.cyan}ℹ${c.reset} ${s}`
const warn = (s) => `${c.yellow}⚠${c.reset} ${s}`
const dim  = (s) => `${c.gray}${s}${c.reset}`

function step(label) {
  process.stdout.write(`\n${c.bold}${label}${c.reset}\n`)
}

// ── load .env.local ───────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.log(warn('.env.local not found — using process.env only'))
    return
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
  console.log(ok('.env.local loaded'))
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}MongoDB Atlas — Connection Test${c.reset}`)
  console.log(dim('─'.repeat(40)))

  // 1. Load env
  step('1. Environment')
  loadEnv()

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log(fail('MONGODB_URI is not set!'))
    console.log(warn('Add it to .env.local:'))
    console.log(dim('  MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/'))
    process.exit(1)
  }
  const safeUri = uri.replace(/:([^@]+)@/, ':****@')
  console.log(ok(`MONGODB_URI found: ${dim(safeUri)}`))

  const client = new MongoClient(uri)

  // 2. Connect
  step('2. Connect to Atlas')
  let t = Date.now()
  try {
    await client.connect()
    console.log(ok(`Connected in ${Date.now() - t} ms`))
  } catch (err) {
    console.log(fail(`Connection failed: ${err.message}`))
    console.log(warn('Common causes:'))
    console.log('  • IP not whitelisted — add 0.0.0.0/0 in Atlas → Network Access')
    console.log('  • Wrong username / password in the connection string')
    console.log('  • Cluster paused (free tier sleeps after 60 days of inactivity)')
    process.exit(1)
  }

  // 3. Ping
  step('3. Ping database "claraline"')
  const db = client.db('claraline')
  t = Date.now()
  try {
    await db.command({ ping: 1 })
    console.log(ok(`Ping OK in ${Date.now() - t} ms`))
  } catch (err) {
    console.log(fail(`Ping failed: ${err.message}`))
  }

  // 4. List databases
  step('4. List databases')
  try {
    const admin = client.db().admin()
    const { databases } = await admin.listDatabases()
    const names = databases.map((d) => d.name)
    console.log(ok(`Databases: ${names.join(', ')}`))
    if (!names.includes('claraline')) {
      console.log(warn('"claraline" database not found — it will be created on first write'))
    }
  } catch (err) {
    console.log(warn(`Could not list databases (permission may be restricted): ${err.message}`))
  }

  // 5. List collections
  step('5. Collections in "claraline"')
  try {
    const cols = await db.listCollections().toArray()
    if (cols.length === 0) {
      console.log(info('No collections yet (database is empty)'))
    } else {
      cols.forEach((c) => console.log(ok(c.name)))
    }
  } catch (err) {
    console.log(fail(`listCollections failed: ${err.message}`))
  }

  // 6. Insert
  step('6. Insert test document')
  const col = db.collection('_connection_test')
  let insertedId
  t = Date.now()
  try {
    const res = await col.insertOne({ _test: true, ts: new Date(), source: 'test-script' })
    insertedId = res.insertedId
    console.log(ok(`Inserted _id=${insertedId} in ${Date.now() - t} ms`))
  } catch (err) {
    console.log(fail(`Insert failed: ${err.message}`))
  }

  // 7. Read
  step('7. Read test document')
  if (insertedId) {
    t = Date.now()
    try {
      const doc = await col.findOne({ _id: insertedId })
      if (doc) {
        console.log(ok(`Read OK in ${Date.now() - t} ms — doc: ${JSON.stringify(doc)}`))
      } else {
        console.log(fail('Document not found after insert'))
      }
    } catch (err) {
      console.log(fail(`Read failed: ${err.message}`))
    }
  }

  // 8. Delete
  step('8. Delete test document')
  if (insertedId) {
    t = Date.now()
    try {
      const res = await col.deleteOne({ _id: insertedId })
      console.log(ok(`Deleted ${res.deletedCount} doc in ${Date.now() - t} ms`))
    } catch (err) {
      console.log(fail(`Delete failed: ${err.message}`))
    }
  }

  await client.close()

  console.log(`\n${c.green}${c.bold}All tests complete.${c.reset}\n`)
}

main().catch((err) => {
  console.error(fail(`Unexpected error: ${err.message}`))
  process.exit(1)
})
